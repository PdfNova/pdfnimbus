import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

export type CompressionLevel = "extreme" | "recommended" | "low";

const QUALITY_BY_LEVEL: Record<CompressionLevel, number> = {
  extreme: 0.4,
  recommended: 0.65,
  low: 0.85
};

function canvasToJpegDataUrl(canvas: HTMLCanvasElement, quality: number) {
  return canvas.toDataURL("image/jpeg", quality);
}

export async function compressPdfFile(
  file: File,
  level: CompressionLevel
): Promise<Blob> {
  const quality = QUALITY_BY_LEVEL[level];
  const sourceBytes = new Uint8Array(await file.arrayBuffer());
  const loadingTask = getDocument({ data: sourceBytes });
  const sourcePdf = await loadingTask.promise;

  const outputPdf = await PDFDocument.create();

  for (let pageNumber = 1; pageNumber <= sourcePdf.numPages; pageNumber += 1) {
    const page = await sourcePdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });

    if (!context) {
      throw new Error("Canvas 2D context unavailable");
    }

    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));

    await page.render({ canvasContext: context, viewport }).promise;

    const jpegDataUrl = canvasToJpegDataUrl(canvas, quality);
    const embeddedImage = await outputPdf.embedJpg(jpegDataUrl);

    const outputPage = outputPdf.addPage([viewport.width, viewport.height]);
    outputPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height
    });

    canvas.width = 0;
    canvas.height = 0;
  }

  const outputBytes = await outputPdf.save({
    addDefaultPage: false,
    useObjectStreams: true,
    updateFieldAppearances: false
  });

  return new Blob([Uint8Array.from(outputBytes)], { type: "application/pdf" });
}
