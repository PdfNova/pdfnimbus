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
  angleOrPerPage: RotationAngle | RotationAngle[]
): Promise<Blob> {
  const sourceBytes = await file.arrayBuffer();
  const document = await PDFDocument.load(sourceBytes, {
    ignoreEncryption: true
  });

  const perPageAngles = Array.isArray(angleOrPerPage)
    ? angleOrPerPage
    : document.getPages().map(() => angleOrPerPage);

  document.getPages().forEach((page, index) => {
    const currentAngle = page.getRotation().angle;
    const pageAngle = perPageAngles[index] ?? 0;
    page.setRotation(pdfDegrees((currentAngle + pageAngle) % 360));
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
