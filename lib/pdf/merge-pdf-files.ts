import { PDFDocument } from "pdf-lib";

export type MergeOutputPageSize = "original" | "a4" | "letter";

export type MergePdfOptions = {
  outputPageSize?: MergeOutputPageSize;
};

const PAGE_SIZES: Record<Exclude<MergeOutputPageSize, "original">, { width: number; height: number }> = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 }
};

export async function mergePdfFiles(
  files: File[],
  options: MergePdfOptions = {}
): Promise<Blob> {
  const mergedDocument = await PDFDocument.create();
  const outputPageSize = options.outputPageSize ?? "original";

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const sourceDocument = await PDFDocument.load(bytes, {
      ignoreEncryption: true
    });

    if (outputPageSize === "original") {
      const copiedPages = await mergedDocument.copyPages(
        sourceDocument,
        sourceDocument.getPageIndices()
      );

      copiedPages.forEach((page) => mergedDocument.addPage(page));
      continue;
    }

    const target = PAGE_SIZES[outputPageSize];

    for (const sourcePage of sourceDocument.getPages()) {
      const embeddedPage = await mergedDocument.embedPage(sourcePage);
      const { width: sourceWidth, height: sourceHeight } = sourcePage.getSize();
      const scale = Math.min(target.width / sourceWidth, target.height / sourceHeight);

      const drawWidth = sourceWidth * scale;
      const drawHeight = sourceHeight * scale;
      const x = (target.width - drawWidth) / 2;
      const y = (target.height - drawHeight) / 2;

      const outputPage = mergedDocument.addPage([target.width, target.height]);
      outputPage.drawPage(embeddedPage, {
        x,
        y,
        width: drawWidth,
        height: drawHeight
      });
    }
  }

  const mergedBytes = await mergedDocument.save({
    addDefaultPage: false,
    useObjectStreams: true,
    updateFieldAppearances: false
  });

  return new Blob([Uint8Array.from(mergedBytes)], { type: "application/pdf" });
}
