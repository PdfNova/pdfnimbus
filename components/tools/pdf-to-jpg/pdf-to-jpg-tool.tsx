"use client";

import { useRef, useState } from "react";
import JSZip from "jszip";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import { pdfToJpgFiles } from "@/lib/pdf/pdf-to-jpg";
import { formatFileLimit, isFileTooLarge } from "@/lib/upload-constraints";
import { useTranslation } from "@/components/i18n-provider";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

type PdfPreview = {
  thumbnailDataUrl: string;
  pageCount: number;
};

type ConversionOutput = {
  name: string;
  blob: Blob;
};

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function formatMb(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function generatePdfPreview(file: File): Promise<PdfPreview> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const loadingTask = getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 0.35 });
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

export function PdfToJpgTool() {
  const { language } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PdfPreview | null>(null);
  const [outputs, setOutputs] = useState<ConversionOutput[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isPreparingFile, setIsPreparingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const copy =
    language === "es"
      ? {
          replaceFile: "Reemplazar archivo PDF",
          selectOrDrop: "Selecciona PDF o sueltalo aqui",
          uploadHint: "Convierte paginas en JPG sin subir archivos.",
          loadingPreview: "Cargando vista previa del PDF...",
          filePreview: "Vista del archivo",
          noFile: "Aun no hay archivo agregado.",
          page: "pagina",
          pages: "paginas",
          previewAlt: (name: string) => `Vista previa de ${name}`,
          options: "Opciones de conversion",
          optionsHint: "Procesamiento local en navegador. Sin almacenamiento en servidor.",
          clear: "Limpiar",
          convertBusy: "Convirtiendo...",
          convertCta: "Convertir a JPG",
          downloadOne: "Descargar imagen",
          downloadAllZip: "Descargar todo en ZIP",
          outputTitle: "Resultados de conversion",
          outputReady: (count: number) => `${count} archivo(s) JPG listos para descargar.`,
          invalid: (name: string) => `Solo se permiten PDF. Invalido: ${name}`,
          tooLarge: (name: string) => `Tamano maximo ${formatFileLimit()}. Muy grande: ${name}`,
          readFailed: "No se pudo leer este PDF. Prueba con otro valido.",
          uploadBefore: "Sube un PDF antes de convertir.",
          noPages: "No se encontraron paginas en este PDF.",
          convertFailed: "La conversion fallo. Prueba con otro PDF.",
          done: (count: number, total: string) => `Listo. ${count} archivo(s) JPG generado(s) (${total} en total).`
        }
      : {
          replaceFile: "Replace PDF file",
          selectOrDrop: "Select PDF or drop it here",
          uploadHint: "Convert pages to JPG without uploading files.",
          loadingPreview: "Loading PDF preview...",
          filePreview: "File preview",
          noFile: "No file added yet.",
          page: "page",
          pages: "pages",
          previewAlt: (name: string) => `Preview of ${name}`,
          options: "Convert options",
          optionsHint: "Browser-first local processing. No server storage.",
          clear: "Clear",
          convertBusy: "Converting...",
          convertCta: "Convert to JPG",
          downloadOne: "Download image",
          downloadAllZip: "Download all as ZIP",
          outputTitle: "Conversion outputs",
          outputReady: (count: number) => `${count} JPG file(s) ready to download.`,
          invalid: (name: string) => `Only PDF files are allowed. Invalid file: ${name}`,
          tooLarge: (name: string) => `Max file size is ${formatFileLimit()}. Too large: ${name}`,
          readFailed: "Could not read this PDF file. Please try another valid PDF.",
          uploadBefore: "Please upload a PDF file before converting.",
          noPages: "No pages were found in this PDF.",
          convertFailed: "Conversion failed. Please try another PDF file.",
          done: (count: number, total: string) => `Done. ${count} JPG file(s) generated (${total} total).`
        };

  const loadSelectedFile = async (selected: File) => {
    setIsPreparingFile(true);
    setError(null);
    setSuccessMessage(null);
    setOutputs([]);

    try {
      const nextPreview = await generatePdfPreview(selected);
      setFile(selected);
      setPreview(nextPreview);
    } catch {
      setFile(null);
      setPreview(null);
      setError(copy.readFailed);
    } finally {
      setIsPreparingFile(false);
    }
  };

  const onConvert = async () => {
    if (!file) {
      setError(copy.uploadBefore);
      return;
    }

    setIsConverting(true);
    setError(null);
    setSuccessMessage(null);
    setOutputs([]);

    try {
      const jpgBlobs = await pdfToJpgFiles(file);

      if (jpgBlobs.length === 0) {
        setError(copy.noPages);
        return;
      }

      const baseName = file.name.replace(/\.pdf$/i, "");
      const nextOutputs = jpgBlobs.map((blob, index) => ({
        blob,
        name: `${baseName}-page-${index + 1}.jpg`
      }));

      setOutputs(nextOutputs);
      const totalOutputBytes = jpgBlobs.reduce((sum, blob) => sum + blob.size, 0);
      setSuccessMessage(copy.done(jpgBlobs.length, formatMb(totalOutputBytes)));

      if (nextOutputs.length === 1) {
        downloadBlob(nextOutputs[0].blob, nextOutputs[0].name);
      }
    } catch {
      setError(copy.convertFailed);
    } finally {
      setIsConverting(false);
    }
  };

  const downloadZip = async () => {
    if (outputs.length === 0) return;

    const zip = new JSZip();
    outputs.forEach((item) => {
      zip.file(item.name, item.blob);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const baseName = file?.name.replace(/\.pdf$/i, "") ?? "pdf-images";
    downloadBlob(zipBlob, `${baseName}-jpg-pages.zip`);
  };

  const validateAndLoad = (selected: File | undefined) => {
    if (!selected) return;
    if (!isPdfFile(selected)) {
      setError(copy.invalid(selected.name));
      return;
    }
    if (isFileTooLarge(selected)) {
      setError(copy.tooLarge(selected.name));
      return;
    }

    void loadSelectedFile(selected);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(event) => {
          const selected = Array.from(event.target.files ?? [])[0];
          event.target.value = "";
          validateAndLoad(selected);
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
          const selected = Array.from(event.dataTransfer.files)[0];
          validateAndLoad(selected);
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

      {successMessage ? (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <h2 className="text-sm font-semibold text-slate-900">{copy.filePreview}</h2>
          {!file ? (
            <p className="mt-2 text-sm text-slate-600">{copy.noFile}</p>
          ) : (
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
              <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
              <p className="mt-1 text-xs text-slate-500">
                {preview ? `${preview.pageCount} ${preview.pageCount === 1 ? copy.page : copy.pages} - ` : ""}
                {formatMb(file.size)}
              </p>

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

          {outputs.length > 0 ? (
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
              <h3 className="text-sm font-semibold text-slate-900">{copy.outputTitle}</h3>
              <p className="mt-1 text-xs text-slate-600">{copy.outputReady(outputs.length)}</p>
              <ul className="mt-2 max-h-48 space-y-1 overflow-auto text-xs text-slate-700">
                {outputs.map((item) => (
                  <li key={item.name} className="flex items-center justify-between gap-2 rounded border border-slate-200 px-2 py-1.5">
                    <span className="truncate">{item.name}</span>
                    <button
                      type="button"
                      onClick={() => downloadBlob(item.blob, item.name)}
                      className="rounded border border-slate-300 px-2 py-1 font-medium text-slate-700 hover:border-brand-500 hover:text-brand-700"
                    >
                      {copy.downloadOne}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-3 lg:sticky lg:top-20">
          <h2 className="text-sm font-semibold text-slate-900">{copy.options}</h2>
          <p className="mt-1 text-xs text-slate-600">{copy.optionsHint}</p>

          <div className="mt-4 grid gap-2">
            {file ? (
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setOutputs([]);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {copy.clear}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onConvert}
              disabled={isConverting || !file || isPreparingFile}
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isConverting ? copy.convertBusy : copy.convertCta}
            </button>

            <button
              type="button"
              onClick={() => {
                if (outputs.length === 1) {
                  downloadBlob(outputs[0].blob, outputs[0].name);
                  return;
                }
                void downloadZip();
              }}
              disabled={outputs.length === 0}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {outputs.length <= 1 ? copy.downloadOne : copy.downloadAllZip}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
