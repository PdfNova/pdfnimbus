"use client";

import { useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { pdfToJpgFiles } from "@/lib/pdf/pdf-to-jpg";
import { formatFileLimit, isFileTooLarge } from "@/lib/upload-constraints";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

type PdfPreview = {
  thumbnailDataUrl: string;
  pageCount: number;
};

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

function formatMb(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PdfPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isPreparingFile, setIsPreparingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const loadSelectedFile = async (selected: File) => {
    setIsPreparingFile(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const nextPreview = await generatePdfPreview(selected);
      setFile(selected);
      setPreview(nextPreview);
    } catch {
      setFile(null);
      setPreview(null);
      setError("Could not read this PDF file. Please try another valid PDF.");
    } finally {
      setIsPreparingFile(false);
    }
  };

  const onConvert = async () => {
    if (!file) {
      setError("Please upload a PDF file before converting.");
      return;
    }

    setIsConverting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const jpgBlobs = await pdfToJpgFiles(file);

      if (jpgBlobs.length === 0) {
        setError("No pages were found in this PDF.");
        return;
      }

      const baseName = file.name.replace(/\.pdf$/i, "");

      for (let index = 0; index < jpgBlobs.length; index += 1) {
        const blob = jpgBlobs[index];
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${baseName}-page-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        await wait(120);
      }

      const totalOutputBytes = jpgBlobs.reduce((sum, blob) => sum + blob.size, 0);
      setSuccessMessage(
        `Done. ${jpgBlobs.length} JPG file${
          jpgBlobs.length > 1 ? "s" : ""
        } downloaded (${formatMb(totalOutputBytes)} total).`
      );
    } catch {
      setError("Conversion failed. Please try another PDF file.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(event) => {
          const selected = Array.from(event.target.files ?? [])[0];
          event.target.value = "";

          if (!selected) return;
          if (!isPdfFile(selected)) {
            setError(`Only PDF files are allowed. Invalid file: ${selected.name}`);
            return;
          }
          if (isFileTooLarge(selected)) {
            setError(`Max file size is ${formatFileLimit()}. Too large: ${selected.name}`);
            return;
          }

          void loadSelectedFile(selected);
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

          if (!selected) return;
          if (!isPdfFile(selected)) {
            setError(`Only PDF files are allowed. Invalid file: ${selected.name}`);
            return;
          }
          if (isFileTooLarge(selected)) {
            setError(`Max file size is ${formatFileLimit()}. Too large: ${selected.name}`);
            return;
          }

          void loadSelectedFile(selected);
        }}
        className={`w-full rounded-xl border-2 border-dashed px-4 py-7 text-center transition ${
          isDragging
            ? "border-brand-600 bg-brand-50"
            : "border-slate-300 bg-slate-50 hover:border-brand-500 hover:bg-brand-50"
        }`}
      >
        <span className="block text-sm font-semibold text-slate-700">
          {file ? "Replace PDF file" : "Select PDF or drop it here"}
        </span>
      </button>

      {isPreparingFile ? (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          Loading PDF preview...
        </div>
      ) : null}

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

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <h2 className="text-sm font-semibold text-slate-900">File preview</h2>
          {!file ? (
            <p className="mt-2 text-sm text-slate-600">No file added yet.</p>
          ) : (
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
              <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
              <p className="mt-1 text-xs text-slate-500">
                {preview ? `${preview.pageCount} page${preview.pageCount === 1 ? "" : "s"} · ` : ""}
                {formatMb(file.size)}
              </p>

              {preview ? (
                <div className="mt-3 overflow-hidden rounded border border-slate-200 bg-slate-50 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.thumbnailDataUrl}
                    alt={`Preview of ${file.name}`}
                    className="mx-auto h-auto w-full max-w-[260px] object-contain"
                  />
                </div>
              ) : null}
            </div>
          )}
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-3">
          <h2 className="text-sm font-semibold text-slate-900">Convert options</h2>
          <p className="mt-1 text-xs text-slate-600">All pages are exported as JPG images.</p>

          <div className="mt-4 flex items-center gap-2">
            {file ? (
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Clear
              </button>
            ) : null}
            <button
              type="button"
              onClick={onConvert}
              disabled={isConverting || !file || isPreparingFile}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isConverting ? "Converting..." : "Convert to JPG"}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
