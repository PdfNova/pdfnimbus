import { PDFDocument } from "pdf-lib-plus-encrypt";

export class ProtectPdfError extends Error {}

export async function protectPdfFile(file: File, password: string): Promise<Blob> {
  if (!password.trim()) {
    throw new ProtectPdfError("Please enter a password.");
  }

  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  pdfDoc.encrypt({
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: "lowResolution",
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false
    }
  });

  const output = await pdfDoc.save({ addDefaultPage: false, useObjectStreams: true });
  return new Blob([Uint8Array.from(output)], { type: "application/pdf" });
}
