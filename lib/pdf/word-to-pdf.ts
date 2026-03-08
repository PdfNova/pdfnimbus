import JSZip from "jszip";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export class WordToPdfError extends Error {}

function extractDocxText(xml: string) {
  return xml
    .replace(/<w:p[^>]*>/g, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}

function wrapText(text: string, maxChars = 90) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  return lines;
}

export async function wordToPdf(file: File): Promise<Blob> {
  const lower = file.name.toLowerCase();
  let text = "";

  if (lower.endsWith(".docx")) {
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const xml = await zip.file("word/document.xml")?.async("string");
    if (!xml) {
      throw new WordToPdfError("This DOCX file could not be read in-browser.");
    }
    text = extractDocxText(xml);
  } else if (lower.endsWith(".txt")) {
    text = await file.text();
  } else {
    throw new WordToPdfError("Please upload a DOCX or TXT file.");
  }

  if (!text.trim()) {
    throw new WordToPdfError("No extractable text was found in this document.");
  }

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  let page = pdf.addPage([595.28, 841.89]);
  let y = 800;
  const margin = 48;
  const lineHeight = 16;

  text.split(/\n+/).forEach((paragraph) => {
    const lines = wrapText(paragraph.trim(), 88);
    if (lines.length === 0) {
      y -= lineHeight;
      return;
    }
    lines.forEach((line) => {
      if (y < 60) {
        page = pdf.addPage([595.28, 841.89]);
        y = 800;
      }
      page.drawText(line, {
        x: margin,
        y,
        size: 11,
        font,
        color: rgb(0.16, 0.2, 0.28)
      });
      y -= lineHeight;
    });
    y -= 6;
  });

  const bytes = await pdf.save({ addDefaultPage: false, useObjectStreams: true });
  return new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
}
