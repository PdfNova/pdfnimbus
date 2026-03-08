import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";

export class PowerPointToPdfError extends Error {}

function extToMime(name: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

export async function powerPointToPdf(file: File): Promise<Blob> {
  const lower = file.name.toLowerCase();
  if (!lower.endsWith(".pptx")) {
    throw new PowerPointToPdfError("Please upload a .pptx presentation file.");
  }

  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const mediaFiles = Object.keys(zip.files)
    .filter((name) => name.startsWith("ppt/media/"))
    .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
    .sort();

  if (mediaFiles.length === 0) {
    throw new PowerPointToPdfError("This presentation has no extractable slide images.");
  }

  const pdf = await PDFDocument.create();

  for (const mediaPath of mediaFiles) {
    const bytes = await zip.file(mediaPath)?.async("uint8array");
    if (!bytes) continue;
    const mime = extToMime(mediaPath);
    const image = mime === "image/png"
      ? await pdf.embedPng(bytes)
      : await pdf.embedJpg(bytes);

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
