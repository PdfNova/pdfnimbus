import { PDFDocument } from "pdf-lib";

export class UnlockPdfError extends Error {
  code:
    | "INVALID_OR_MISSING_PASSWORD"
    | "UNSUPPORTED_ENCRYPTION"
    | "UNKNOWN";

  constructor(
    code: UnlockPdfError["code"],
    message: string
  ) {
    super(message);
    this.code = code;
  }
}

export async function unlockPdfFile(
  file: File,
  password: string
): Promise<Blob> {
  const bytes = await file.arrayBuffer();

  // First attempt: explicit password flow for user-password protected files.
  if (password.trim().length > 0) {
    try {
      const doc = await PDFDocument.load(bytes, {
        ...( { password } as object )
      });

      const output = await doc.save({
        addDefaultPage: false,
        useObjectStreams: true,
        updateFieldAppearances: false
      });

      return new Blob([Uint8Array.from(output)], {
        type: "application/pdf"
      });
    } catch {
      // continue with fallback for owner-password restrictions
    }
  }

  // Fallback: some owner-restriction PDFs can be re-saved by loading with ignoreEncryption.
  try {
    const doc = await PDFDocument.load(bytes, {
      ignoreEncryption: true
    });

    const output = await doc.save({
      addDefaultPage: false,
      useObjectStreams: true,
      updateFieldAppearances: false
    });

    return new Blob([Uint8Array.from(output)], {
      type: "application/pdf"
    });
  } catch {
    if (password.trim().length === 0) {
      throw new UnlockPdfError(
        "INVALID_OR_MISSING_PASSWORD",
        "Enter the correct PDF password to remove it permanently."
      );
    }

    throw new UnlockPdfError(
      "UNSUPPORTED_ENCRYPTION",
      "This PDF cannot be unlocked in-browser with the provided credentials."
    );
  }
}
