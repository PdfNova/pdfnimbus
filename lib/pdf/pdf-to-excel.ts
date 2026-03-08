import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

export type ExtractedPdfRow = {
  page: number;
  row: number;
  text: string;
};

function csvEscape(value: string) {
  const normalized = value.replace(/\r?\n/g, " ").trim();
  if (/[",]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

export async function extractPdfRows(file: File): Promise<ExtractedPdfRow[]> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocument({ data: bytes }).promise;
  const rows: ExtractedPdfRow[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const items = content.items
      .filter((item) => "str" in item && "transform" in item)
      .map((item) => ({
        text: item.str,
        y: Math.round((item.transform as number[])[5] ?? 0),
        x: Math.round((item.transform as number[])[4] ?? 0)
      }))
      .filter((item) => item.text.trim().length > 0)
      .sort((a, b) => (b.y - a.y) || (a.x - b.x));

    const grouped = new Map<number, string[]>();
    items.forEach((item) => {
      const key = item.y;
      const existing = grouped.get(key) ?? [];
      existing.push(item.text);
      grouped.set(key, existing);
    });

    Array.from(grouped.values()).forEach((texts, index) => {
      rows.push({ page: pageNumber, row: index + 1, text: texts.join(" ") });
    });
  }

  return rows;
}

export async function pdfToCsv(file: File): Promise<Blob> {
  const rows = await extractPdfRows(file);
  const csvRows = ["page,row,text", ...rows.map((row) => `${row.page},${row.row},${csvEscape(row.text)}`)];
  return new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8" });
}
