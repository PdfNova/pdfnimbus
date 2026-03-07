import { PDFDocument } from "pdf-lib";

function isPng(file: File) {
  return file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
}

export async function imagesToPdf(files: File[]): Promise<Blob> {
  const pdfDocument = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const image = isPng(file)
      ? await pdfDocument.embedPng(bytes)
      : await pdfDocument.embedJpg(bytes);

    const page = pdfDocument.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height
    });
  }

  const output = await pdfDocument.save({
    addDefaultPage: false,
    useObjectStreams: true,
    updateFieldAppearances: false
  });

  return new Blob([Uint8Array.from(output)], { type: "application/pdf" });
}
