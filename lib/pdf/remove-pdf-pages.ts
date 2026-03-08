import { PDFDocument } from "pdf-lib";

export class RemovePdfPagesError extends Error {}

export async function removePdfPages(file: File, removedPageIndexes: number[]): Promise<Blob> {
  const sourceBytes = await file.arrayBuffer();
  const sourceDoc = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });
  const totalPages = sourceDoc.getPageCount();
  const removeSet = new Set(removedPageIndexes);
  const keepIndexes = Array.from({ length: totalPages }, (_, index) => index).filter((index) => !removeSet.has(index));

  if (keepIndexes.length === 0) {
    throw new RemovePdfPagesError("You must keep at least one page in the output PDF.");
  }

  const targetDoc = await PDFDocument.create();
  const copiedPages = await targetDoc.copyPages(sourceDoc, keepIndexes);
  copiedPages.forEach((page) => targetDoc.addPage(page));

  const output = await targetDoc.save({ addDefaultPage: false, useObjectStreams: true });
  return new Blob([Uint8Array.from(output)], { type: "application/pdf" });
}
