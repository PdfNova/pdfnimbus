import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export class SpreadsheetToPdfError extends Error {}

function parseDelimitedText(text: string) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const delimiter = lines.some((line) => line.includes("\t")) ? "\t" : ",";
  return lines.map((line) => line.split(delimiter).map((cell) => cell.trim()));
}

async function rowsFromXlsx(file: File): Promise<string[][]> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const firstSheet = workbook.SheetNames[0];
  if (!firstSheet) throw new SpreadsheetToPdfError("The uploaded spreadsheet appears to be empty.");
  const sheet = workbook.Sheets[firstSheet];
  const rows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
    header: 1,
    raw: false,
    blankrows: false
  });
  return rows
    .map((row) => row.map((cell) => (cell ?? "").toString().trim()))
    .filter((row) => row.some((cell) => cell.length > 0));
}

export async function spreadsheetToPdf(file: File): Promise<Blob> {
  const lower = file.name.toLowerCase();

  let rows: string[][];
  if (lower.endsWith(".xlsx")) {
    rows = await rowsFromXlsx(file);
  } else if (lower.endsWith(".csv") || lower.endsWith(".txt") || lower.endsWith(".tsv")) {
    rows = parseDelimitedText(await file.text());
  } else {
    throw new SpreadsheetToPdfError("Please upload a CSV, TSV, TXT, or XLSX spreadsheet file.");
  }

  if (rows.length === 0) {
    throw new SpreadsheetToPdfError("The uploaded spreadsheet appears to be empty.");
  }

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([595.28, 841.89]);
  let y = 800;
  const margin = 36;
  const rowHeight = 20;
  const fontSize = 9;
  const maxColumns = Math.max(...rows.map((row) => row.length), 1);
  const displayColumns = Math.min(maxColumns, 6);
  const usableWidth = page.getWidth() - margin * 2;
  const colWidth = usableWidth / displayColumns;

  rows.forEach((row, rowIndex) => {
    if (y < 60) {
      page = pdf.addPage([595.28, 841.89]);
      y = 800;
    }

    page.drawRectangle({
      x: margin,
      y: y - rowHeight + 4,
      width: usableWidth,
      height: rowHeight,
      color: rowIndex === 0 ? rgb(0.93, 0.96, 1) : rgb(0.98, 0.98, 0.99),
      borderColor: rgb(0.85, 0.88, 0.92),
      borderWidth: 0.5
    });

    row.slice(0, displayColumns).forEach((cell, colIndex) => {
      const drawFont = rowIndex === 0 ? boldFont : font;
      const clean = cell.length > 24 ? `${cell.slice(0, 21)}...` : cell;
      page.drawText(clean, {
        x: margin + colIndex * colWidth + 6,
        y: y - 11,
        size: fontSize,
        font: drawFont,
        color: rgb(0.18, 0.23, 0.32)
      });
    });

    y -= rowHeight;
  });

  const bytes = await pdf.save({ addDefaultPage: false, useObjectStreams: true });
  return new Blob([Uint8Array.from(bytes)], { type: "application/pdf" });
}
