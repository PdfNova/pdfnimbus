import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

async function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create JPEG output."));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
}

function clampQuality(quality: number) {
  if (Number.isNaN(quality)) {
    return 0.9;
  }

  return Math.max(0.1, Math.min(quality, 1));
}

export async function pdfToJpgFiles(file: File, quality = 0.92): Promise<Blob[]> {
  const normalizedQuality = clampQuality(quality);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const loadingTask = getDocument({ data: bytes });
  const pdf = await loadingTask.promise;

  const output: Blob[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });

    if (!context) {
      throw new Error("Canvas 2D context unavailable");
    }

    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));

    await page.render({ canvasContext: context, viewport }).promise;

    const blob = await canvasToJpegBlob(canvas, normalizedQuality);
    output.push(blob);

    canvas.width = 0;
    canvas.height = 0;
  }

  return output;
}
