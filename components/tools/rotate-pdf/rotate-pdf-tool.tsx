"use client";

import { useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import {
  getPdfPageCount,
  rotatePdfFile,
  type RotationAngle,
  type RotationStep
} from "@/lib/pdf/rotate-pdf-file";
import { formatFileLimit, isFileTooLarge } from "@/lib/upload-constraints";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

type PagePreview = {
  pageNumber: number;
  thumbnailDataUrl: string;
};

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
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

  const handleIncomingFiles = async (incomingFiles: File[]) => {
    if (incomingFiles.length === 0) {
      return;
    }

    const selectedFile = incomingFiles[0];

    if (!isPdfFile(selectedFile)) {
      setError(`Only PDF files are allowed. Invalid file: ${selectedFile.name}`);
      return;
    }

    if (isFileTooLarge(selectedFile)) {
      setError(`Max file size is ${formatFileLimit()}. Too large: ${selectedFile.name}`);
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
        setError("Please upload one PDF file at a time.");
      }
    } catch {
      setFile(null);
      setPageCount(null);
      setPagePreviews([]);
      setError("Could not read this PDF file. Please try a valid PDF.");
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const onRotate = async () => {
    if (!file) {
      setError("Please upload a PDF file before rotating.");
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

      setSuccessMessage(
        `Done. Rotated ${pageCount ?? "all"} page${
          pageCount === 1 ? "" : "s"
        } by ${currentRotation}° and downloaded ${outputName}.`
      );
    } catch {
      setError("Rotation failed. Please try another PDF file.");
    } finally {
      setIsRotating(false);
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
          <p className="mt-1 text-xs text-slate-600">
            {isLoadingPdf
              ? "Loading PDF details and preview..."
              : file
                ? `${file.name} · ${pageCount ?? "-"} page${pageCount === 1 ? "" : "s"} · ${formatMb(file.size)}`
                : "No file added yet."}
          </p>

          {pagePreviews.length > 0 ? (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {pagePreviews.map((preview) => (
                <div
                  key={`${file?.name ?? "pdf"}-${file?.lastModified ?? 0}-${preview.pageNumber}-${currentRotation}`}
                  className="rounded-lg border border-slate-200 bg-white p-2"
                >
                  <div className="flex min-h-[120px] items-center justify-center overflow-hidden rounded border border-slate-200 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview.thumbnailDataUrl}
                      alt={`PDF page ${preview.pageNumber}`}
                      style={{
                        transform: `rotate(${currentRotation}deg)`,
                        transformOrigin: "center center"
                      }}
                      className="h-auto w-full object-contain transition-transform duration-200"
                    />
                  </div>
                  <p className="mt-1.5 text-center text-[11px] font-medium text-slate-700">
                    Page {preview.pageNumber}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-3">
          <h2 className="text-sm font-semibold text-slate-900">Rotate options</h2>
          <p className="mt-1 text-xs text-slate-600">Current rotation: {currentRotation}°</p>

          <div className="mt-3 space-y-2">
            {ROTATION_OPTIONS.map((angle) => (
              <button
                key={angle}
                type="button"
                onClick={() => {
                  setCurrentRotation(
                    (previous) => (((previous + angle) % 360) as RotationAngle)
                  );
                }}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:bg-white"
              >
                +{angle}° clockwise
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
              {isRotating ? "Rotating..." : "Rotate PDF"}
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
                Clear
              </button>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
