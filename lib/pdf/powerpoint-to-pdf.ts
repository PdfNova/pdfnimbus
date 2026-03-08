import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";

export class PowerPointToPdfError extends Error {}

function extToMime(name: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

function parseSlideOrder(xml: string) {
  return Array.from(xml.matchAll(/r:id="([^"]+)"/g)).map((match) => match[1]);
}

function parseRelationships(xml: string) {
  return Array.from(xml.matchAll(/<Relationship[^>]*Id="([^"]+)"[^>]*Type="([^"]+)"[^>]*Target="([^"]+)"/g)).map((match) => ({
    id: match[1],
    type: match[2],
    target: match[3]
  }));
}

function resolveTarget(basePath: string, target: string) {
  const baseParts = basePath.split("/").slice(0, -1);
  target.split("/").forEach((part) => {
    if (part === "..") baseParts.pop();
    else if (part !== ".") baseParts.push(part);
  });
  return baseParts.join("/");
}

function getShapeIdsByRid(slideXml: string) {
  const ids = new Map<string, number>();
  const picRegex = /<p:pic>[\s\S]*?<p:cNvPr[^>]*id="(\d+)"[\s\S]*?<a:blip[^>]*r:embed="([^"]+)"[\s\S]*?<\/p:pic>/g;
  for (const match of slideXml.matchAll(picRegex)) {
    ids.set(match[2], Number(match[1]));
  }
  return ids;
}

async function getImageArea(bytes: Uint8Array, mime: string) {
  const blob = new Blob([bytes.slice().buffer], { type: mime });
  const url = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = url;
    });
    return image.width * image.height;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function powerPointToPdf(file: File): Promise<Blob> {
  const lower = file.name.toLowerCase();
  if (!lower.endsWith(".pptx")) {
    throw new PowerPointToPdfError("Please upload a .pptx presentation file.");
  }

  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const presentationXml = await zip.file("ppt/presentation.xml")?.async("string");
  const presentationRelsXml = await zip.file("ppt/_rels/presentation.xml.rels")?.async("string");

  if (!presentationXml || !presentationRelsXml) {
    throw new PowerPointToPdfError("This presentation could not be parsed in-browser.");
  }

  const orderedRelIds = parseSlideOrder(presentationXml);
  const presentationRels = parseRelationships(presentationRelsXml);
  const slideTargets = orderedRelIds
    .map((relId) => presentationRels.find((rel) => rel.id === relId && rel.type.includes("/slide"))?.target)
    .filter((target): target is string => Boolean(target))
    .map((target) => resolveTarget("ppt/presentation.xml", target));

  const seenMedia = new Set<string>();
  const selectedMedia: { path: string; mime: string }[] = [];

  for (const slidePath of slideTargets) {
    const slideXml = await zip.file(slidePath)?.async("string");
    const slideRelsXml = await zip.file(`${slidePath.replace(/[^/]+$/, "_rels/")}${slidePath.split("/").pop()}.rels`)?.async("string");
    if (!slideXml || !slideRelsXml) continue;

    const shapeIds = getShapeIdsByRid(slideXml);
    const relationships = parseRelationships(slideRelsXml).filter((rel) => rel.type.includes("/image"));
    const candidates: { path: string; mime: string; area: number; shapeId: number }[] = [];

    for (const rel of relationships) {
      const mediaPath = resolveTarget(slidePath, rel.target);
      const fileRef = zip.file(mediaPath);
      if (!fileRef) continue;
      const bytes = await fileRef.async("uint8array");
      const mime = extToMime(mediaPath);
      const area = await getImageArea(bytes, mime);
      candidates.push({
        path: mediaPath,
        mime,
        area,
        shapeId: shapeIds.get(rel.id) ?? Number.MAX_SAFE_INTEGER
      });
    }

    candidates.sort((a, b) => (b.area - a.area) || (a.shapeId - b.shapeId));
    const selected = candidates.find((candidate) => !seenMedia.has(candidate.path)) ?? candidates[0];
    if (!selected) continue;
    seenMedia.add(selected.path);
    selectedMedia.push({ path: selected.path, mime: selected.mime });
  }

  if (selectedMedia.length === 0) {
    throw new PowerPointToPdfError("This presentation has no extractable slide images.");
  }

  const pdf = await PDFDocument.create();

  for (const media of selectedMedia) {
    const bytes = await zip.file(media.path)?.async("uint8array");
    if (!bytes) continue;
    const image = media.mime === "image/png" ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    const page = pdf.addPage([595.28, 841.89]);
    const margin = 24;
    const maxWidth = page.getWidth() - margin * 2;
    const maxHeight = page.getHeight() - margin * 2;
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    const x = (page.getWidth() - width) / 2;
    const y = (page.getHeight() - height) / 2;
    page.drawImage(image, { x, y, width, height });
  }

  const bytes = await pdf.save({ addDefaultPage: false, useObjectStreams: true });
  return new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
}
