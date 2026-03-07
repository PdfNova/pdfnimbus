"use client";

import { useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import {
  compressPdfFile,
  type CompressionLevel
} from "@/lib/pdf/compress-pdf-file";
import {
  trackDownloadGenerated,
  trackFileUploaded,
  trackToolUsed,
  trackEvent
} from "@/lib/analytics";
import {
  formatFileLimit,
  isFileTooLarge
} from "@/lib/upload-constraints";
import Link from "next/link";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

const compressionOptions: Array<{
  value: CompressionLevel;
  label: string;
  hint: string;
}> = [
  {
    value: "extreme",
    label: "Extreme compression",
    hint: "Maximum size reduction, lower visual quality."
  },
  {
    value: "recommended",
    label: "Recommended compression",
    hint: "Best balance of quality and file size."
  },
  {
    value: "low",
    label: "Low compression",
    hint: "Higher quality with lighter reduction."
  }
];

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
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PdfPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreparingFile, setIsPreparingFile] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionLevel, setCompressionLevel] =
    useState<CompressionLevel>("recommended");
  const [result, setResult] = useState<CompressionResult | null>(null);

  const handleIncomingFiles = async (incomingFiles: File[]) => {
    if (incomingFiles.length === 0) {
      return;
    }

    const [selectedFile] = incomingFiles;

    if (!isPdfFile(selectedFile)) {
      setError(`Only PDF files are allowed. Invalid file: ${selectedFile.name}`);
      return;
    }

    if (isFileTooLarge(selectedFile)) {
      setError(`Max file size is ${formatFileLimit()}. Too large: ${selectedFile.name}`);
      return;
    }

    setIsPreparingFile(true);
    setError(incomingFiles.length > 1 ? "Please upload one PDF file at a time." : null);
    setResult(null);

    try {
      const nextPreview = await generatePdfPreview(selectedFile);
      setFile(selectedFile);
      setPreview(nextPreview);
      trackFileUploaded("compress_pdf", 1);
    } catch {
      setFile(null);
      setPreview(null);
      setError("Could not read this PDF file. Please try another valid PDF.");
    } finally {
      setIsPreparingFile(false);
    }
  };

  const onCompress = async () => {
    if (!file) {
      setError("Please upload a PDF file before compressing.");
      return;
    }

    setIsCompressing(true);
    setError(null);

    try {
      const outputBlob = await compressPdfFile(file, compressionLevel);
      const outputFileName = getDownloadName(file.name);
      const savedPercent = Math.max(
        0,
        Math.round((1 - outputBlob.size / Math.max(file.size, 1)) * 100)
      );

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
      setError(
        "Compression failed. Please try again with a different or smaller PDF file."
      );
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
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

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <h2 className="text-sm font-semibold text-slate-900">File preview</h2>

          {!file ? (
            <p className="mt-3 text-sm text-slate-600">No file selected yet.</p>
          ) : (
            <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {preview ? `${preview.pageCount} page${preview.pageCount === 1 ? "" : "s"} · ` : ""}
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
                  Remove
                </button>
              </div>

              {preview ? (
                <div className="mt-3 overflow-hidden rounded border border-slate-200 bg-slate-50 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.thumbnailDataUrl}
                    alt={`Preview of ${file.name}`}
                    className="mx-auto h-auto w-full max-w-[300px] object-contain"
                  />
                </div>
              ) : null}
            </div>
          )}
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-3">
          <h2 className="text-sm font-semibold text-slate-900">Compression settings</h2>
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
            {isCompressing ? "Compressing PDF..." : "Compress PDF"}
          </button>
        </aside>
      </div>

      {result ? (
        <section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <h2 className="text-lg font-bold text-emerald-800">Your PDF has been compressed</h2>
          <p className="mt-1 text-sm text-emerald-700">
            <span className="font-semibold">{result.savedPercent}% saved</span> · {formatSize(result.originalSize)} → {formatSize(result.compressedSize)}
          </p>

          <button
            type="button"
            onClick={() => downloadBlob(result.outputBlob, result.outputFileName)}
            className="mt-4 inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            Download optimized PDF
          </button>

          <div className="mt-5">
            <h3 className="text-sm font-semibold text-slate-900">Continue with</h3>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/tools/merge-pdf" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand-400 hover:text-brand-700">Merge PDF</Link>
              <Link href="/tools/split-pdf" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand-400 hover:text-brand-700">Split PDF</Link>
              <Link href="/tools/rotate-pdf" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand-400 hover:text-brand-700">Rotate PDF</Link>
              <Link href="/tools/protect-pdf" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand-400 hover:text-brand-700">Protect PDF</Link>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3">
            <h3 className="text-sm font-semibold text-slate-900">Secure. Private. Under your control.</h3>
            <div className="mt-2 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
              <p>🔒 SSL encryption</p>
              <p>✅ GDPR compliant</p>
              <p>🧠 Browser-first processing</p>
              <p>🚫 No file storage</p>
            </div>
          </div>
        </section>
      ) : null}
    </section>
  );
}
