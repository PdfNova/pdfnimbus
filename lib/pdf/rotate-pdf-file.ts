import { PDFDocument, degrees as pdfDegrees } from "pdf-lib";

export type RotationStep = 90 | 180 | 270;
export type RotationAngle = 0 | 90 | 180 | 270;

export async function getPdfPageCount(file: File): Promise<number> {
  const sourceBytes = await file.arrayBuffer();
  const sourceDocument = await PDFDocument.load(sourceBytes, {
    ignoreEncryption: true
  });

  return sourceDocument.getPageCount();
}

export async function rotatePdfFile(
  file: File,
  angle: RotationAngle
): Promise<Blob> {
  const sourceBytes = await file.arrayBuffer();
  const document = await PDFDocument.load(sourceBytes, {
    ignoreEncryption: true
  });

  document.getPages().forEach((page) => {
    const currentAngle = page.getRotation().angle;
    page.setRotation(pdfDegrees((currentAngle + angle) % 360));
  });

  const outputBytes = await document.save({
    addDefaultPage: false,
    updateFieldAppearances: false,
    useObjectStreams: true
  });

  return new Blob([Uint8Array.from(outputBytes)], {
    type: "application/pdf"
  });
}
