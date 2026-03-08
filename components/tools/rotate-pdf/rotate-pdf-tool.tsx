"use client";

import { useMemo, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import {
  getPdfPageCount,
  rotatePdfFile,
  type RotationAngle,
  type RotationStep
} from "@/lib/pdf/rotate-pdf-file";
import { trackToolConversionCompleted, trackToolDownloadClicked, trackToolUploadStarted } from "@/lib/analytics";
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

function buildOutputName(fileName: string) {
  const baseName = fileName.replace(/\.pdf$/i, "");
  return `${baseName}-rotated.pdf`;
}

function applyRotation(previous: RotationAngle, step: RotationStep): RotationAngle {
  return ((previous + step) % 360) as RotationAngle;
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
  const [defaultRotationStep, setDefaultRotationStep] = useState<RotationStep>(90);
  const [pageRotations, setPageRotations] = useState<RotationAngle[]>([]);
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
          uploadHint: "Sin subida obligatoria. Todo queda en tu navegador.",
          filePreview: "Vista del archivo",
          loading: "Cargando detalles y vista previa del PDF...",
          noFile: "Aun no hay archivo agregado.",
          page: "pagina",
          pages: "paginas",
          pageAlt: (page: number) => `Pagina PDF ${page}`,
          options: "Opciones de rotacion",
          globalStep: "Paso de rotacion",
          rotateAll: "Rotar todas las paginas",
          resetAll: "Restablecer todas",
          pageControls: "Controles por pagina",
          currentPageRotation: (deg: number) => `Rotacion de pagina: ${deg} grados`,
          adjustedPages: (count: number) => `Paginas ajustadas: ${count}`,
          rotateBy: (deg: number) => `+${deg} grados`,
          rotateBusy: "Rotando...",
          rotateCta: "Descargar PDF rotado",
          clear: "Limpiar",
          trust: "Procesamiento local en navegador. Los archivos no se suben al servidor.",
          invalid: (name: string) => `Solo se permiten PDF. Invalido: ${name}`,
          tooLarge: (name: string) => `Tamano maximo ${formatFileLimit()}. Muy grande: ${name}`,
          singleFile: "Sube un solo PDF por vez.",
          readFailed: "No se pudo leer este PDF. Prueba con un archivo valido.",
          uploadFirst: "Sube un PDF antes de rotar.",
          rotationFailed: "La rotacion fallo. Prueba con otro PDF.",
          success: (name: string) => `Listo. Se genero y descargo ${name}.`
        }
      : {
          replaceFile: "Replace PDF file",
          selectOrDrop: "Select PDF or drop it here",
          uploadHint: "No mandatory upload. Everything stays in your browser.",
          filePreview: "File preview",
          loading: "Loading PDF details and preview...",
          noFile: "No file added yet.",
          page: "page",
          pages: "pages",
          pageAlt: (page: number) => `PDF page ${page}`,
          options: "Rotate options",
          globalStep: "Rotation step",
          rotateAll: "Rotate all pages",
          resetAll: "Reset all",
          pageControls: "Per-page controls",
          currentPageRotation: (deg: number) => `Page rotation: ${deg} degrees`,
          adjustedPages: (count: number) => `Adjusted pages: ${count}`,
          rotateBy: (deg: number) => `+${deg} degrees`,
          rotateBusy: "Rotating...",
          rotateCta: "Download rotated PDF",
          clear: "Clear",
          trust: "Browser-first local processing. Files are not uploaded to the server.",
          invalid: (name: string) => `Only PDF files are allowed. Invalid file: ${name}`,
          tooLarge: (name: string) => `Max file size is ${formatFileLimit()}. Too large: ${name}`,
          singleFile: "Please upload one PDF file at a time.",
          readFailed: "Could not read this PDF file. Please try a valid PDF.",
          uploadFirst: "Please upload a PDF file before rotating.",
          rotationFailed: "Rotation failed. Please try another PDF file.",
          success: (name: string) => `Done. Generated and downloaded ${name}.`
        };

  const anyRotationApplied = useMemo(() => pageRotations.some((angle) => angle !== 0), [pageRotations]);

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
      trackToolUploadStarted({ tool_slug: "rotate-pdf", page_path: "/tools/rotate-pdf", locale: language, file_count: 1 });
      setPageRotations(Array.from({ length: count }, () => 0));

      if (incomingFiles.length > 1) {
        setError(copy.singleFile);
      }
    } catch {
      setFile(null);
      setPageCount(null);
      setPagePreviews([]);
      setPageRotations([]);
      setError(copy.readFailed);
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const rotateSinglePage = (pageIndex: number, step: RotationStep) => {
    setPageRotations((current) =>
      current.map((rotation, index) => (index === pageIndex ? applyRotation(rotation, step) : rotation))
    );
  };

  const rotateAllPages = () => {
    setPageRotations((current) => current.map((rotation) => applyRotation(rotation, defaultRotationStep)));
  };

  const resetAllPages = () => {
    setPageRotations((current) => current.map(() => 0));
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
      const outputBlob = await rotatePdfFile(file, pageRotations);
      const outputName = buildOutputName(file.name);

      const url = URL.createObjectURL(outputBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = outputName;
      document.body.appendChild(link);
      trackToolDownloadClicked({ tool_slug: "rotate-pdf", page_path: "/tools/rotate-pdf", locale: language, output_format: "pdf" });
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      trackToolConversionCompleted({ tool_slug: "rotate-pdf", page_path: "/tools/rotate-pdf", locale: language, output_format: "pdf" });
      setSuccessMessage(copy.success(outputName));
    } catch {
      setError(copy.rotationFailed);
    } finally {
      setIsRotating(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
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
        className={`w-full rounded-xl border-2 border-dashed px-4 py-5 text-center transition ${
          isDragging
            ? "border-brand-600 bg-brand-50"
            : "border-slate-300 bg-slate-50 hover:border-brand-500 hover:bg-brand-50"
        }`}
      >
        <span className="block text-sm font-semibold text-slate-700">
          {file ? copy.replaceFile : copy.selectOrDrop}
        </span>
        <span className="mt-1.5 block text-xs text-slate-500">{copy.uploadHint}</span>
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

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] 2xl:grid-cols-[minmax(0,1fr)_340px]">
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
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {pagePreviews.map((preview, index) => {
                const rotation = pageRotations[index] ?? 0;

                return (
                  <div
                    key={`${file?.name ?? "pdf"}-${file?.lastModified ?? 0}-${preview.pageNumber}`}
                    className="rounded-lg border border-slate-200 bg-white p-2"
                  >
                    <div className="flex min-h-[130px] items-center justify-center overflow-hidden rounded border border-slate-200 bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview.thumbnailDataUrl}
                        alt={copy.pageAlt(preview.pageNumber)}
                        style={{
                          transform: `rotate(${rotation}deg)`,
                          transformOrigin: "center center"
                        }}
                        className="h-auto w-full object-contain transition-transform duration-200"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-[11px] font-medium text-slate-700">
                        {copy.page} {preview.pageNumber}
                      </p>
                      <span className="text-[11px] font-semibold text-brand-700">{rotation}°</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {ROTATION_OPTIONS.map((step) => (
                        <button
                          key={`${preview.pageNumber}-${step}`}
                          type="button"
                          onClick={() => rotateSinglePage(index, step)}
                          className="rounded border border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-brand-500 hover:text-brand-700"
                        >
                          {copy.rotateBy(step)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-3 lg:sticky lg:top-20">
          <h2 className="text-sm font-semibold text-slate-900">{copy.options}</h2>

          <label className="mt-3 block text-xs font-semibold text-slate-700">
            {copy.globalStep}
            <select
              value={defaultRotationStep}
              onChange={(event) => setDefaultRotationStep(Number(event.target.value) as RotationStep)}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm font-medium outline-none focus:border-brand-500"
            >
              <option value={90}>90°</option>
              <option value={180}>180°</option>
              <option value={270}>270°</option>
            </select>
          </label>

          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={rotateAllPages}
              disabled={!file || isLoadingPdf}
              className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-brand-500 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {copy.rotateAll}
            </button>
            <button
              type="button"
              onClick={resetAllPages}
              disabled={!file || !anyRotationApplied}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-brand-500 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {copy.resetAll}
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-600">{copy.pageControls}</p>
          <p className="mt-1 text-xs font-medium text-slate-700">
            {copy.adjustedPages(pageRotations.filter((angle) => angle !== 0).length)}
          </p>

          <button
            type="button"
            onClick={onRotate}
            disabled={!file || isRotating || isLoadingPdf}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRotating ? copy.rotateBusy : copy.rotateCta}
          </button>

          <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            {copy.trust}
          </p>

          {file ? (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPageCount(null);
                setPagePreviews([]);
                setPageRotations([]);
                setError(null);
                setSuccessMessage(null);
              }}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              {copy.clear}
            </button>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
