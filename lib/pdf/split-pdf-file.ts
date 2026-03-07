import { PDFDocument } from "pdf-lib";

export type SplitMode =
  | "all-pages"
  | "selected-pages"
  | "custom-ranges"
  | "every-n-pages";

export type OutputMode = "separate" | "combined";

export type PageRange = {
  startPage: number;
  endPage: number;
};

export type SplitOptions =
  | { mode: "all-pages" }
  | {
      mode: "selected-pages";
      selectedPages: number[];
      outputMode: OutputMode;
    }
  | {
      mode: "custom-ranges";
      ranges: PageRange[];
      outputMode: OutputMode;
    }
  | { mode: "every-n-pages"; chunkSize: number };

export type SplitOutputFile = {
  fileName: string;
  blob: Blob;
};

function baseNameFromFile(fileName: string) {
  return fileName.replace(/\.pdf$/i, "");
}

async function buildPdfFromPageIndices(
  sourceDocument: PDFDocument,
  pageIndices: number[]
): Promise<Blob> {
  const outputDocument = await PDFDocument.create();
  const copiedPages = await outputDocument.copyPages(sourceDocument, pageIndices);

  copiedPages.forEach((page) => outputDocument.addPage(page));

  const outputBytes = await outputDocument.save({
    addDefaultPage: false,
    useObjectStreams: true,
    updateFieldAppearances: false
  });

  return new Blob([Uint8Array.from(outputBytes)], { type: "application/pdf" });
}

export async function getPdfPageCount(file: File): Promise<number> {
  const sourceBytes = await file.arrayBuffer();
  const sourceDocument = await PDFDocument.load(sourceBytes, {
    ignoreEncryption: true
  });

  return sourceDocument.getPageCount();
}

export async function splitPdfFile(
  file: File,
  options: SplitOptions
): Promise<SplitOutputFile[]> {
  const sourceBytes = await file.arrayBuffer();
  const sourceDocument = await PDFDocument.load(sourceBytes, {
    ignoreEncryption: true
  });

  const pageCount = sourceDocument.getPageCount();
  const fileBaseName = baseNameFromFile(file.name);

  if (options.mode === "all-pages") {
    const outputs: SplitOutputFile[] = [];

    for (let page = 1; page <= pageCount; page += 1) {
      const blob = await buildPdfFromPageIndices(sourceDocument, [page - 1]);
      outputs.push({
        fileName: `${fileBaseName}-page-${page}.pdf`,
        blob
      });
    }

    return outputs;
  }

  if (options.mode === "selected-pages") {
    const uniquePagesInSelectionOrder: number[] = [];
    const seenPages = new Set<number>();

    for (const page of options.selectedPages) {
      if (!seenPages.has(page)) {
        seenPages.add(page);
        uniquePagesInSelectionOrder.push(page);
      }
    }

    const pageIndices = uniquePagesInSelectionOrder.map((page) => page - 1);

    if (options.outputMode === "combined") {
      const blob = await buildPdfFromPageIndices(sourceDocument, pageIndices);
      return [
        {
          fileName: `${fileBaseName}-selected-pages.pdf`,
          blob
        }
      ];
    }

    const outputs: SplitOutputFile[] = [];

    for (const page of uniquePagesInSelectionOrder) {
      const blob = await buildPdfFromPageIndices(sourceDocument, [page - 1]);
      outputs.push({
        fileName: `${fileBaseName}-page-${page}.pdf`,
        blob
      });
    }

    return outputs;
  }

  if (options.mode === "custom-ranges") {
    if (options.outputMode === "combined") {
      const combinedPageIndices: number[] = [];

      for (const range of options.ranges) {
        for (let page = range.startPage; page <= range.endPage; page += 1) {
          combinedPageIndices.push(page - 1);
        }
      }

      const blob = await buildPdfFromPageIndices(sourceDocument, combinedPageIndices);

      return [
        {
          fileName: `${fileBaseName}-ranges-combined.pdf`,
          blob
        }
      ];
    }

    const outputs: SplitOutputFile[] = [];

    for (let index = 0; index < options.ranges.length; index += 1) {
      const range = options.ranges[index];
      const pageIndices: number[] = [];

      for (let page = range.startPage; page <= range.endPage; page += 1) {
        pageIndices.push(page - 1);
      }

      const blob = await buildPdfFromPageIndices(sourceDocument, pageIndices);
      outputs.push({
        fileName: `${fileBaseName}-range-${index + 1}-pages-${range.startPage}-${range.endPage}.pdf`,
        blob
      });
    }

    return outputs;
  }

  const outputs: SplitOutputFile[] = [];
  let partNumber = 1;

  for (let start = 1; start <= pageCount; start += options.chunkSize) {
    const end = Math.min(start + options.chunkSize - 1, pageCount);
    const pageIndices: number[] = [];

    for (let page = start; page <= end; page += 1) {
      pageIndices.push(page - 1);
    }

    const blob = await buildPdfFromPageIndices(sourceDocument, pageIndices);
    outputs.push({
      fileName: `${fileBaseName}-part-${partNumber}-pages-${start}-${end}.pdf`,
      blob
    });

    partNumber += 1;
  }

  return outputs;
}
