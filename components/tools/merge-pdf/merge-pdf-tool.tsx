"use client";

import { useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import { mergePdfFiles, type MergeOutputPageSize } from "@/lib/pdf/merge-pdf-files";
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

type UploadItem = {
  id: string;
  file: File;
  previewDataUrl: string;
  pageCount: number;
};

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function createItemId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatMb(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function createPdfPreview(file: File): Promise<{ previewDataUrl: string; pageCount: number }> {
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

  const previewDataUrl = canvas.toDataURL("image/jpeg", 0.82);
  const pageCount = pdf.numPages;

  canvas.width = 0;
  canvas.height = 0;

  return { previewDataUrl, pageCount };
}

export function MergePdfTool() {
  const { language } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [outputPageSize, setOutputPageSize] = useState<MergeOutputPageSize>("a4");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const copy =
    language === "es"
      ? {
          uploadPromptEmpty: "Arrastra archivos PDF aqui o haz clic para subir.",
          uploadPromptMore: "Agregar mas archivos PDF",
          uploadHint: "Puedes volver a soltar archivos para anexar mas PDFs.",
          processing: "Procesando vistas previas de PDF...",
          clear: "Limpiar",
          filesTitle: (count: number) => `Archivos (${count})`,
          clearAll: "Limpiar todo",
          emptyState: "Sube PDFs para empezar. Puedes arrastrar tarjetas para definir el orden final.",
          totalLabel: "total",
          orderHint: "El orden final sigue el orden de las tarjetas.",
          page: "pagina",
          pages: "paginas",
          remove: "Quitar",
          dragHint: "Arrastra esta tarjeta para cambiar posicion.",
          previewAlt: (name: string) => `Vista previa de ${name}`,
          optional: "Opcional",
          normalizeTitle: "Igualar tamano de paginas",
          normalizeHint: "Normaliza paginas a A4 o Letter para impresion mas limpia y consistente.",
          outputSizeLabel: "Tamano de pagina de salida",
          keepOriginal: "Mantener tamanos originales",
          normalizeA4: "Normalizar a A4",
          normalizeLetter: "Normalizar a Letter",
          normalizedNotice: (size: "A4" | "Letter") => `Todas las paginas se normalizaran a ${size}.`,
          mergeBusy: "Uniendo PDFs...",
          mergeCta: (count: number) => `Unir ${count > 0 ? count : ""} PDF${count === 1 ? "" : "s"}`,
          footerHint: "El orden final respeta el orden de tarjetas.",
          invalidPdf: (names: string) => `Solo se permiten PDF. Invalidos: ${names}`,
          tooLarge: (names: string) => `Tamano maximo ${formatFileLimit()}. Muy grandes: ${names}`,
          previewError: "No se pudo generar vista previa de uno o mas PDF.",
          addBeforeMerge: "Agrega archivos PDF antes de unir.",
          mergeFailed: "La union fallo. Prueba con archivos validos o mas pequenos.",
          mergeDone: (count: number, size: string) => `Listo. Se unieron ${count} PDF${count > 1 ? "s" : ""} (${size}).`
        }
      : {
          uploadPromptEmpty: "Drag and drop PDF files here, or click to upload.",
          uploadPromptMore: "Add more PDF files",
          uploadHint: "You can drop files again at any time to append more PDFs.",
          processing: "Processing PDF previews...",
          clear: "Clear",
          filesTitle: (count: number) => `Files (${count})`,
          clearAll: "Clear all",
          emptyState: "Upload PDF files to start. You can drag cards to set the final merge order.",
          totalLabel: "total",
          orderHint: "Final merge order follows card order.",
          page: "page",
          pages: "pages",
          remove: "Remove",
          dragHint: "Drag this card to reorder merge position.",
          previewAlt: (name: string) => `Preview of ${name}`,
          optional: "Optional",
          normalizeTitle: "Make all pages the same size",
          normalizeHint: "Normalize merged pages to A4 or Letter for cleaner printing and consistent layout.",
          outputSizeLabel: "Output page size",
          keepOriginal: "Keep original page sizes",
          normalizeA4: "Normalize to A4",
          normalizeLetter: "Normalize to Letter",
          normalizedNotice: (size: "A4" | "Letter") => `All merged pages will be normalized to ${size}.`,
          mergeBusy: "Merging PDFs...",
          mergeCta: (count: number) => `Merge ${count > 0 ? count : ""} PDF${count === 1 ? "" : "s"}`,
          footerHint: "Final merge order follows the card order shown above.",
          invalidPdf: (names: string) => `Only PDF files are allowed. Invalid: ${names}`,
          tooLarge: (names: string) => `Max file size is ${formatFileLimit()}. Too large: ${names}`,
          previewError: "One or more PDF files could not be previewed. Please try different files.",
          addBeforeMerge: "Please add PDF files before merging.",
          mergeFailed: "Merge failed. Please try again with smaller or valid PDF files.",
          mergeDone: (count: number, size: string) => `Done. Merged ${count} PDF file${count > 1 ? "s" : ""} (${size}).`
        };

  const handleFiles = async (incomingFiles: File[]) => {
    const tooLargeFiles = incomingFiles.filter((file) => isFileTooLarge(file));
    const validFiles = incomingFiles.filter((file) => isPdfFile(file) && !isFileTooLarge(file));
    const invalidFiles = incomingFiles.filter((file) => !isPdfFile(file));

    if (invalidFiles.length > 0 || tooLargeFiles.length > 0) {
      const invalidNames = invalidFiles.map((file) => file.name);
      const tooLargeNames = tooLargeFiles.map((file) => file.name);
      const reasons: string[] = [];
      if (invalidNames.length > 0) {
        reasons.push(copy.invalidPdf(invalidNames.join(", ")));
      }
      if (tooLargeNames.length > 0) {
        reasons.push(copy.tooLarge(tooLargeNames.join(", ")));
      }
      setError(reasons.join(" "));
    } else {
      setError(null);
    }

    if (validFiles.length === 0) {
      return;
    }

    setIsProcessingFiles(true);
    setSuccessMessage(null);

    try {
      const preparedItems = await Promise.all(
        validFiles.map(async (file) => {
          const { previewDataUrl, pageCount } = await createPdfPreview(file);
          return {
            id: createItemId(),
            file,
            previewDataUrl,
            pageCount
          } satisfies UploadItem;
        })
      );

      setItems((currentItems) => [...currentItems, ...preparedItems]);
      trackFileUploaded("merge_pdf", preparedItems.length);
    } catch {
      setError(copy.previewError);
    } finally {
      setIsProcessingFiles(false);
    }
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    void handleFiles(selectedFiles);
    event.target.value = "";
  };

  const onDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    void handleFiles(droppedFiles);
  };

  const reorderByIds = (sourceId: string, targetId: string) => {
    setItems((currentItems) => {
      const sourceIndex = currentItems.findIndex((item) => item.id === sourceId);
      const targetIndex = currentItems.findIndex((item) => item.id === targetId);

      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
        return currentItems;
      }

      const updatedItems = [...currentItems];
      const [movedItem] = updatedItems.splice(sourceIndex, 1);
      updatedItems.splice(targetIndex, 0, movedItem);
      return updatedItems;
    });
  };

  const removeFile = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const onMerge = async () => {
    if (items.length === 0) {
      setError(copy.addBeforeMerge);
      return;
    }

    setIsMerging(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const files = items.map((item) => item.file);
      const mergedPdfBlob = await mergePdfFiles(files, {
        outputPageSize
      });
      const downloadUrl = URL.createObjectURL(mergedPdfBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "merged.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);

      setSuccessMessage(copy.mergeDone(items.length, formatMb(mergedPdfBlob.size)));
      trackToolUsed("merge_pdf");
      trackDownloadGenerated("merge_pdf", "pdf");
      trackEvent("merge_pdf_complete", {
        file_count: items.length,
        output_size: mergedPdfBlob.size,
        output_page_size: outputPageSize
      });
    } catch {
      setError(copy.mergeFailed);
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,application/pdf"
        onChange={onFileInputChange}
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
        onDrop={onDrop}
        className={`w-full rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
          isDragging
            ? "border-brand-600 bg-brand-50"
            : "border-slate-300 bg-slate-50 hover:border-brand-500 hover:bg-brand-50"
        }`}
      >
        <span className="block text-base font-medium text-slate-700">
          {items.length === 0 ? copy.uploadPromptEmpty : copy.uploadPromptMore}
        </span>
        <span className="mt-2 block text-xs text-slate-500">{copy.uploadHint}</span>
      </button>

      {isProcessingFiles ? (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {copy.processing}
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="shrink-0 rounded-md border border-red-300 px-2 py-1 text-xs font-medium hover:bg-red-100"
          >
            {copy.clear}
          </button>
        </div>
      ) : null}

      {successMessage ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div
        className={`mt-3 grid gap-3 ${
          items.length > 0
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] 2xl:grid-cols-[minmax(0,1fr)_320px]"
            : "grid-cols-1"
        }`}
      >
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">{copy.filesTitle(items.length)}</h2>
            {items.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setItems([]);
                  setSuccessMessage(null);
                }}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {copy.clearAll}
              </button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {copy.emptyState}
            </p>
          ) : (
            <>
              <div className="mb-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 sm:text-sm">
                <span className="font-medium">{items.length} PDF{items.length === 1 ? "" : "s"}</span>
                <span className="mx-2 text-slate-400">-</span>
                <span>{formatMb(items.reduce((sum, item) => sum + item.file.size, 0))} {copy.totalLabel}</span>
                <span className="mx-2 text-slate-400">-</span>
                <span>{copy.orderHint}</span>
              </div>
              <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 2xl:grid-cols-4">
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    draggable
                    onDragStart={(event) => {
                      setDraggingId(item.id);
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", item.id);
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragOverId(item.id);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const sourceId = draggingId ?? event.dataTransfer.getData("text/plain");
                      if (sourceId) {
                        reorderByIds(sourceId, item.id);
                      }
                      setDragOverId(null);
                      setDraggingId(null);
                    }}
                    onDragEnd={() => {
                      setDragOverId(null);
                      setDraggingId(null);
                    }}
                    className={`rounded-lg border bg-white p-2.5 transition ${
                      draggingId === item.id
                        ? "border-brand-600 bg-brand-50/70 shadow-sm opacity-90"
                        : dragOverId === item.id
                          ? "border-brand-500 bg-brand-50 ring-1 ring-brand-300"
                          : "border-slate-200"
                    } ${draggingId === item.id ? "cursor-grabbing" : "cursor-grab"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(item.id)}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-50"
                      >
                        {copy.remove}
                      </button>
                    </div>

                    <div className="mt-2 overflow-hidden rounded border border-slate-200 bg-slate-50 p-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.previewDataUrl}
                        alt={copy.previewAlt(item.file.name)}
                        className="mx-auto h-40 w-full object-contain"
                      />
                    </div>

                    <p className="mt-2 truncate text-sm font-medium text-slate-900">{item.file.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.pageCount} {item.pageCount === 1 ? copy.page : copy.pages} - {formatMb(item.file.size)}
                    </p>
                    <p className="mt-1.5 text-xs text-slate-500">{copy.dragHint}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-3 lg:sticky lg:top-20">
          <div className="mb-3 rounded-xl border border-brand-200 bg-brand-50/70 p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                {copy.optional}
              </span>
              <h3 className="text-sm font-semibold text-slate-900">{copy.normalizeTitle}</h3>
            </div>

            <p className="mb-3 text-xs text-slate-700 sm:text-sm">{copy.normalizeHint}</p>

            <label className="text-sm text-slate-700">
              <span className="mb-1 block font-medium">{copy.outputSizeLabel}</span>
              <select
                value={outputPageSize}
                onChange={(event) => setOutputPageSize(event.target.value as MergeOutputPageSize)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-brand-500"
              >
                <option value="original">{copy.keepOriginal}</option>
                <option value="a4">{copy.normalizeA4}</option>
                <option value="letter">{copy.normalizeLetter}</option>
              </select>
            </label>

            {outputPageSize !== "original" ? (
              <p className="mt-2 text-xs font-medium text-brand-800">
                {copy.normalizedNotice(outputPageSize === "a4" ? "A4" : "Letter")}
              </p>
            ) : null}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={onMerge}
              disabled={isMerging || items.length === 0 || isProcessingFiles}
              className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isMerging ? copy.mergeBusy : copy.mergeCta(items.length)}
            </button>
          </div>
          <p className="mt-2 text-center text-sm text-slate-600">{copy.footerHint}</p>
        </aside>
      </div>
    </section>
  );
}
