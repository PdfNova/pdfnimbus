"use client";

import { useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import {
  getPdfPageCount,
  rotatePdfFile,
  type RotationAngle,
  type RotationStep
} from "@/lib/pdf/rotate-pdf-file";
import { formatFileLimit, isFileTooLarge } from "@/lib/upload-constraints";
import { useTranslation } from "@/components/i18n-provider";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

type PagePreview = {
  pageNumber: number;
  thumbnailDataUrl: string;
};

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function formatMb(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function buildOutputName(fileName: string, angle: RotationAngle) {
  const baseName = fileName.replace(/\.pdf$/i, "");
  return `${baseName}-rotated-${angle}.pdf`;
}

async function generatePdfPreviews(file: File): Promise<PagePreview[]> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const loadingTask = getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const previews: PagePreview[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 0.35 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });

    if (!context) {
      throw new Error("Canvas 2D context unavailable");
    }

    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));

    await page.render({ canvasContext: context, viewport }).promise;

    previews.push({
      pageNumber,
      thumbnailDataUrl: canvas.toDataURL("image/jpeg", 0.82)
    });

    canvas.width = 0;
    canvas.height = 0;
  }

  return previews;
}

const ROTATION_OPTIONS: RotationStep[] = [90, 180, 270];

export function RotatePdfTool() {
  const { language } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pagePreviews, setPagePreviews] = useState<PagePreview[]>([]);
  const [currentRotation, setCurrentRotation] = useState<RotationAngle>(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const copy =
    language === "es"
      ? {
          replaceFile: "Reemplazar archivo PDF",
          selectOrDrop: "Selecciona PDF o sueltalo aqui",
          filePreview: "Vista del archivo",
          loading: "Cargando detalles y vista previa del PDF...",
          noFile: "Aun no hay archivo agregado.",
          page: "pagina",
          pages: "paginas",
          pageAlt: (page: number) => `Pagina PDF ${page}`,
          options: "Opciones de rotacion",
          currentRotation: (deg: number) => `Rotacion actual: ${deg} grados`,
          rotateBy: (deg: number) => `+${deg} grados en sentido horario`,
          rotateBusy: "Rotando...",
          rotateCta: "Rotar PDF",
          clear: "Limpiar",
          invalid: (name: string) => `Solo se permiten PDF. Invalido: ${name}`,
          tooLarge: (name: string) => `Tamano maximo ${formatFileLimit()}. Muy grande: ${name}`,
          singleFile: "Sube un solo PDF por vez.",
          readFailed: "No se pudo leer este PDF. Prueba con un archivo valido.",
          uploadFirst: "Sube un PDF antes de rotar.",
          rotationFailed: "La rotacion fallo. Prueba con otro PDF.",
          success: (count: number | null, deg: number, name: string) =>
            `Listo. Se rotaron ${count ?? "todas"} ${count === 1 ? "pagina" : "paginas"} ${deg} grados y se descargo ${name}.`
        }
      : {
          replaceFile: "Replace PDF file",
          selectOrDrop: "Select PDF or drop it here",
          filePreview: "File preview",
          loading: "Loading PDF details and preview...",
          noFile: "No file added yet.",
          page: "page",
          pages: "pages",
          pageAlt: (page: number) => `PDF page ${page}`,
          options: "Rotate options",
          currentRotation: (deg: number) => `Current rotation: ${deg} degrees`,
          rotateBy: (deg: number) => `+${deg} degrees clockwise`,
          rotateBusy: "Rotating...",
          rotateCta: "Rotate PDF",
          clear: "Clear",
          invalid: (name: string) => `Only PDF files are allowed. Invalid file: ${name}`,
          tooLarge: (name: string) => `Max file size is ${formatFileLimit()}. Too large: ${name}`,
          singleFile: "Please upload one PDF file at a time.",
          readFailed: "Could not read this PDF file. Please try a valid PDF.",
          uploadFirst: "Please upload a PDF file before rotating.",
          rotationFailed: "Rotation failed. Please try another PDF file.",
          success: (count: number | null, deg: number, name: string) =>
            `Done. Rotated ${count ?? "all"} ${count === 1 ? "page" : "pages"} by ${deg} degrees and downloaded ${name}.`
        };

  const handleIncomingFiles = async (incomingFiles: File[]) => {
    if (incomingFiles.length === 0) {
      return;
    }

    const selectedFile = incomingFiles[0];

    if (!isPdfFile(selectedFile)) {
      setError(copy.invalid(selectedFile.name));
      return;
    }

    if (isFileTooLarge(selectedFile)) {
      setError(copy.tooLarge(selectedFile.name));
      return;
    }

    setIsLoadingPdf(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const [count, previews] = await Promise.all([
        getPdfPageCount(selectedFile),
        generatePdfPreviews(selectedFile)
      ]);

      setFile(selectedFile);
      setPageCount(count);
      setPagePreviews(previews);
      setCurrentRotation(0);

      if (incomingFiles.length > 1) {
        setError(copy.singleFile);
      }
    } catch {
      setFile(null);
      setPageCount(null);
      setPagePreviews([]);
      setError(copy.readFailed);
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const onRotate = async () => {
    if (!file) {
      setError(copy.uploadFirst);
      return;
    }

    setIsRotating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const outputBlob = await rotatePdfFile(file, currentRotation);
      const outputName = buildOutputName(file.name, currentRotation);

      const url = URL.createObjectURL(outputBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = outputName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setSuccessMessage(copy.success(pageCount, currentRotation, outputName));
    } catch {
      setError(copy.rotationFailed);
    } finally {
      setIsRotating(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(event) => {
          void handleIncomingFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void handleIncomingFiles(Array.from(event.dataTransfer.files));
        }}
        className={`w-full rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
          isDragging
            ? "border-brand-600 bg-brand-50"
            : "border-slate-300 bg-slate-50 hover:border-brand-500 hover:bg-brand-50"
        }`}
      >
        <span className="block text-sm font-semibold text-slate-700">
          {file ? copy.replaceFile : copy.selectOrDrop}
        </span>
      </button>

      {error ? (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <h2 className="text-sm font-semibold text-slate-900">{copy.filePreview}</h2>
          <p className="mt-1 text-xs text-slate-600">
            {isLoadingPdf
              ? copy.loading
              : file
                ? `${file.name} - ${pageCount ?? "-"} ${pageCount === 1 ? copy.page : copy.pages} - ${formatMb(file.size)}`
                : copy.noFile}
          </p>

          {pagePreviews.length > 0 ? (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
              {pagePreviews.map((preview) => (
                <div
                  key={`${file?.name ?? "pdf"}-${file?.lastModified ?? 0}-${preview.pageNumber}-${currentRotation}`}
                  className="rounded-lg border border-slate-200 bg-white p-2"
                >
                  <div className="flex min-h-[120px] items-center justify-center overflow-hidden rounded border border-slate-200 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview.thumbnailDataUrl}
                      alt={copy.pageAlt(preview.pageNumber)}
                      style={{
                        transform: `rotate(${currentRotation}deg)`,
                        transformOrigin: "center center"
                      }}
                      className="h-auto w-full object-contain transition-transform duration-200"
                    />
                  </div>
                  <p className="mt-1.5 text-center text-[11px] font-medium text-slate-700">
                    {copy.page} {preview.pageNumber}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-3">
          <h2 className="text-sm font-semibold text-slate-900">{copy.options}</h2>
          <p className="mt-1 text-xs text-slate-600">{copy.currentRotation(currentRotation)}</p>

          <div className="mt-3 space-y-2">
            {ROTATION_OPTIONS.map((angle) => (
              <button
                key={angle}
                type="button"
                onClick={() => {
                  setCurrentRotation((previous) => (((previous + angle) % 360) as RotationAngle));
                }}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:bg-white"
              >
                {copy.rotateBy(angle)}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={onRotate}
              disabled={!file || isRotating || isLoadingPdf}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRotating ? copy.rotateBusy : copy.rotateCta}
            </button>

            {file ? (
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPageCount(null);
                  setPagePreviews([]);
                  setCurrentRotation(0);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                {copy.clear}
              </button>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
