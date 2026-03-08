"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import { compressPdfFile, type CompressionLevel } from "@/lib/pdf/compress-pdf-file";
import {
  trackDownloadGenerated,
  trackFileUploaded,
  trackToolUsed,
  trackEvent
} from "@/lib/analytics";
import { formatFileLimit, isFileTooLarge } from "@/lib/upload-constraints";
import { useTranslation } from "@/components/i18n-provider";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

type PdfPreview = {
  thumbnailDataUrl: string;
  pageCount: number;
};

type CompressionResult = {
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  outputBlob: Blob;
  outputFileName: string;
};

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function formatSize(sizeInBytes: number) {
  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(0)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getDownloadName(fileName: string) {
  if (fileName.toLowerCase().endsWith(".pdf")) {
    return `${fileName.slice(0, -4)}-optimized.pdf`;
  }

  return `${fileName}-optimized.pdf`;
}

function downloadBlob(blob: Blob, filename: string) {
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
}

async function generatePdfPreview(file: File): Promise<PdfPreview> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const loadingTask = getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 0.4 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { alpha: false });

  if (!context) {
    throw new Error("Canvas 2D context unavailable");
  }

  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));

  await page.render({ canvasContext: context, viewport }).promise;

  const preview: PdfPreview = {
    thumbnailDataUrl: canvas.toDataURL("image/jpeg", 0.82),
    pageCount: pdf.numPages
  };

  canvas.width = 0;
  canvas.height = 0;

  return preview;
}

export function CompressPdfTool() {
  const { language } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PdfPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreparingFile, setIsPreparingFile] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("recommended");
  const [result, setResult] = useState<CompressionResult | null>(null);

  const copy =
    language === "es"
      ? {
          replaceFile: "Reemplazar archivo PDF",
          selectOrDrop: "Selecciona PDF o sueltalo aqui",
          uploadHint: "Procesamiento local en navegador. Sin subida obligatoria.",
          loadingPreview: "Cargando vista previa del PDF...",
          filePreviewTitle: "Vista del archivo",
          noFileSelected: "Aun no hay archivo seleccionado.",
          page: "pagina",
          pages: "paginas",
          previewAlt: (name: string) => `Vista previa de ${name}`,
          remove: "Quitar",
          settingsTitle: "Opciones de compresion",
          compressButton: "Comprimir PDF",
          compressingButton: "Comprimiendo PDF...",
          resultTitle: "Compresion lista",
          resultSummary: "Resultado",
          resultMetrics: {
            saved: "reduccion",
            original: "original",
            optimized: "optimizado"
          },
          downloadOptimized: "Descargar PDF optimizado",
          continueWith: "Continuar con",
          trustTitle: "Seguro. Privado. Bajo tu control.",
          trustItems: [
            "Cifrado SSL",
            "Cumplimiento GDPR",
            "Procesamiento en navegador",
            "Sin almacenamiento de archivos"
          ],
          levels: {
            extreme: { label: "Compresion extrema", hint: "Maxima reduccion, menor calidad visual." },
            recommended: { label: "Compresion recomendada", hint: "Mejor equilibrio entre calidad y tamano." },
            low: { label: "Compresion baja", hint: "Mayor calidad con reduccion ligera." }
          },
          continueCards: {
            merge: "Unir PDF",
            split: "Dividir PDF",
            rotate: "Rotar PDF",
            jpg: "PDF a JPG"
          },
          invalidFile: (name: string) => `Solo se permiten archivos PDF. Archivo invalido: ${name}`,
          tooLarge: (name: string) => `El tamano maximo es ${formatFileLimit()}. Muy grande: ${name}`,
          singleFileOnly: "Sube un solo PDF por vez.",
          unreadable: "No se pudo leer este PDF. Prueba con otro archivo valido.",
          uploadBefore: "Sube un PDF antes de comprimir.",
          compressionFailed: "La compresion fallo. Prueba con otro PDF o uno mas pequeno."
        }
      : {
          replaceFile: "Replace PDF file",
          selectOrDrop: "Select PDF or drop it here",
          uploadHint: "Browser-first processing. No mandatory upload.",
          loadingPreview: "Loading PDF preview...",
          filePreviewTitle: "File preview",
          noFileSelected: "No file selected yet.",
          page: "page",
          pages: "pages",
          previewAlt: (name: string) => `Preview of ${name}`,
          remove: "Remove",
          settingsTitle: "Compression settings",
          compressButton: "Compress PDF",
          compressingButton: "Compressing PDF...",
          resultTitle: "Compression complete",
          resultSummary: "Result",
          resultMetrics: {
            saved: "saved",
            original: "original",
            optimized: "optimized"
          },
          downloadOptimized: "Download optimized PDF",
          continueWith: "Continue with",
          trustTitle: "Secure. Private. Under your control.",
          trustItems: [
            "SSL encryption",
            "GDPR compliant",
            "Browser-first processing",
            "No file storage"
          ],
          levels: {
            extreme: { label: "Extreme compression", hint: "Maximum size reduction, lower visual quality." },
            recommended: { label: "Recommended compression", hint: "Best balance of quality and file size." },
            low: { label: "Low compression", hint: "Higher quality with lighter reduction." }
          },
          continueCards: {
            merge: "Merge PDF",
            split: "Split PDF",
            rotate: "Rotate PDF",
            jpg: "PDF to JPG"
          },
          invalidFile: (name: string) => `Only PDF files are allowed. Invalid file: ${name}`,
          tooLarge: (name: string) => `Max file size is ${formatFileLimit()}. Too large: ${name}`,
          singleFileOnly: "Please upload one PDF file at a time.",
          unreadable: "Could not read this PDF file. Please try another valid PDF.",
          uploadBefore: "Please upload a PDF file before compressing.",
          compressionFailed: "Compression failed. Please try again with a different or smaller PDF file."
        };

  const compressionOptions: Array<{
    value: CompressionLevel;
    label: string;
    hint: string;
  }> = [
    {
      value: "extreme",
      label: copy.levels.extreme.label,
      hint: copy.levels.extreme.hint
    },
    {
      value: "recommended",
      label: copy.levels.recommended.label,
      hint: copy.levels.recommended.hint
    },
    {
      value: "low",
      label: copy.levels.low.label,
      hint: copy.levels.low.hint
    }
  ];

  const handleIncomingFiles = async (incomingFiles: File[]) => {
    if (incomingFiles.length === 0) {
      return;
    }

    const [selectedFile] = incomingFiles;

    if (!isPdfFile(selectedFile)) {
      setError(copy.invalidFile(selectedFile.name));
      return;
    }

    if (isFileTooLarge(selectedFile)) {
      setError(copy.tooLarge(selectedFile.name));
      return;
    }

    setIsPreparingFile(true);
    setError(incomingFiles.length > 1 ? copy.singleFileOnly : null);
    setResult(null);

    try {
      const nextPreview = await generatePdfPreview(selectedFile);
      setFile(selectedFile);
      setPreview(nextPreview);
      trackFileUploaded("compress_pdf", 1);
    } catch {
      setFile(null);
      setPreview(null);
      setError(copy.unreadable);
    } finally {
      setIsPreparingFile(false);
    }
  };

  const onCompress = async () => {
    if (!file) {
      setError(copy.uploadBefore);
      return;
    }

    setIsCompressing(true);
    setError(null);

    try {
      const outputBlob = await compressPdfFile(file, compressionLevel);
      const outputFileName = getDownloadName(file.name);
      const savedPercent = Math.max(0, Math.round((1 - outputBlob.size / Math.max(file.size, 1)) * 100));

      setResult({
        originalSize: file.size,
        compressedSize: outputBlob.size,
        savedPercent,
        outputBlob,
        outputFileName
      });

      downloadBlob(outputBlob, outputFileName);
      trackToolUsed("compress_pdf");
      trackDownloadGenerated("compress_pdf", "pdf");
      trackEvent("compress_pdf_complete", {
        level: compressionLevel,
        original_size: file.size,
        compressed_size: outputBlob.size
      });
    } catch {
      setError(copy.compressionFailed);
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={(event) => {
          const selectedFiles = Array.from(event.target.files ?? []);
          void handleIncomingFiles(selectedFiles);
          event.target.value = "";
        }}
        className="hidden"
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

      {isPreparingFile ? (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          {copy.loadingPreview}
        </div>
      ) : null}

      {error ? (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <h2 className="text-sm font-semibold text-slate-900">{copy.filePreviewTitle}</h2>

          {!file ? (
            <p className="mt-3 text-sm text-slate-600">{copy.noFileSelected}</p>
          ) : (
            <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {preview ? `${preview.pageCount} ${preview.pageCount === 1 ? copy.page : copy.pages} - ` : ""}
                    {formatSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setResult(null);
                  }}
                  className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                >
                  {copy.remove}
                </button>
              </div>

              {preview ? (
                <div className="mt-3 overflow-hidden rounded border border-slate-200 bg-slate-50 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.thumbnailDataUrl}
                    alt={copy.previewAlt(file.name)}
                    className="mx-auto h-auto w-full max-w-[460px] object-contain"
                  />
                </div>
              ) : null}
            </div>
          )}
        </section>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-3 lg:sticky lg:top-20">
          <h2 className="text-sm font-semibold text-slate-900">{copy.settingsTitle}</h2>
          <div className="mt-3 space-y-2">
            {compressionOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCompressionLevel(option.value)}
                className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                  compressionLevel === option.value
                    ? "border-brand-600 bg-brand-50 text-slate-900"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-400"
                }`}
              >
                <span className="block text-sm font-semibold">{option.label}</span>
                <span className="mt-1 block text-xs text-slate-600">{option.hint}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onCompress}
            disabled={isCompressing || !file || isPreparingFile}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCompressing ? copy.compressingButton : copy.compressButton}
          </button>
        </aside>
      </div>

      {result ? (
        <section className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="rounded-xl border border-emerald-300 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{copy.resultSummary}</p>
            <div className="mt-1.5 flex flex-wrap items-end justify-between gap-2">
              <h2 className="text-base font-bold text-emerald-900">{copy.resultTitle}</h2>
              <span className="text-3xl font-extrabold leading-none text-emerald-800">
                {result.savedPercent}% {copy.resultMetrics.saved}
              </span>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
              <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="font-semibold">{copy.resultMetrics.original}: </span>
                {formatSize(result.originalSize)}
              </p>
              <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <span className="font-semibold">{copy.resultMetrics.optimized}: </span>
                {formatSize(result.compressedSize)}
              </p>
              <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 sm:col-span-2 lg:col-span-1">
                <span className="font-semibold">{copy.downloadOptimized}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => downloadBlob(result.outputBlob, result.outputFileName)}
            className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-5 py-3.5 text-base font-bold text-white transition hover:bg-brand-700"
          >
            {copy.downloadOptimized}
          </button>

          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-900">{copy.continueWith}</h3>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/tools/merge-pdf" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand-400 hover:text-brand-700">{copy.continueCards.merge}</Link>
              <Link href="/tools/split-pdf" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand-400 hover:text-brand-700">{copy.continueCards.split}</Link>
              <Link href="/tools/rotate-pdf" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand-400 hover:text-brand-700">{copy.continueCards.rotate}</Link>
              <Link href="/tools/pdf-to-jpg" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand-400 hover:text-brand-700">{copy.continueCards.jpg}</Link>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
            <h3 className="text-sm font-semibold text-slate-900">{copy.trustTitle}</h3>
            <div className="mt-2 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
              {copy.trustItems.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </section>
  );
}
