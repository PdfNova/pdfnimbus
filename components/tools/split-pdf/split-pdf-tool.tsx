"use client";

import { useMemo, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import {
  getPdfPageCount,
  splitPdfFile,
  type OutputMode,
  type PageRange,
  type SplitMode,
  type SplitOptions
} from "@/lib/pdf/split-pdf-file";
import { formatFileLimit, isFileTooLarge } from "@/lib/upload-constraints";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

type PagePreview = {
  pageNumber: number;
  thumbnailDataUrl: string;
};

type EditableRange = {
  id: string;
  start: string;
  end: string;
};

function createStableId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createEditableRange(start = "1", end = "1"): EditableRange {
  return {
    id: createStableId("range"),
    start,
    end
  };
}

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function rangesOverlap(a: PageRange, b: PageRange) {
  return a.startPage <= b.endPage && b.startPage <= a.endPage;
}

function parseRanges(
  ranges: EditableRange[],
  pageCount: number
): { validRanges: PageRange[]; error: string | null } {
  if (ranges.length === 0) {
    return { validRanges: [], error: "Add at least one range." };
  }

  const parsed: PageRange[] = [];

  for (let index = 0; index < ranges.length; index += 1) {
    const range = ranges[index];
    const start = Number(range.start);
    const end = Number(range.end);

    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      return {
        validRanges: [],
        error: `Range ${index + 1} must contain valid integer pages.`
      };
    }

    if (start < 1 || end < 1) {
      return {
        validRanges: [],
        error: `Range ${index + 1} pages must be greater than or equal to 1.`
      };
    }

    if (start > end) {
      return {
        validRanges: [],
        error: `Range ${index + 1} start page cannot be greater than end page.`
      };
    }

    if (end > pageCount) {
      return {
        validRanges: [],
        error: `Range ${index + 1} exceeds total pages (${pageCount}).`
      };
    }

    parsed.push({ startPage: start, endPage: end });
  }

  for (let i = 0; i < parsed.length; i += 1) {
    for (let j = i + 1; j < parsed.length; j += 1) {
      if (rangesOverlap(parsed[i], parsed[j])) {
        return {
          validRanges: [],
          error: `Range ${i + 1} overlaps with range ${j + 1}. Adjust ranges to avoid overlap.`
        };
      }
    }
  }

  return { validRanges: parsed, error: null };
}

async function generateThumbnails(file: File): Promise<PagePreview[]> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const loadingTask = getDocument({ data: bytes });
  const pdf = await loadingTask.promise;

  const previews: PagePreview[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 0.35 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

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
  }

  return previews;
}

export function SplitPdfTool() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pagePreviews, setPagePreviews] = useState<PagePreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitMode, setSplitMode] = useState<SplitMode>("all-pages");
  const [everyNInput, setEveryNInput] = useState("2");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [outputMode, setOutputMode] = useState<OutputMode>("separate");
  const [ranges, setRanges] = useState<EditableRange[]>([createEditableRange()]);
  const [lastOutputMessage, setLastOutputMessage] = useState<string | null>(null);

  const parsedRangesState = useMemo(() => {
    if (!pageCount) {
      return { validRanges: [] as PageRange[], error: null as string | null };
    }

    return parseRanges(ranges, pageCount);
  }, [ranges, pageCount]);

  const rangePageSet = useMemo(() => {
    const pageSet = new Set<number>();

    if (parsedRangesState.error) {
      return pageSet;
    }

    for (const range of parsedRangesState.validRanges) {
      for (let page = range.startPage; page <= range.endPage; page += 1) {
        pageSet.add(page);
      }
    }

    return pageSet;
  }, [parsedRangesState]);

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
    setLastOutputMessage(null);

    try {
      const [loadedPageCount, thumbnails] = await Promise.all([
        getPdfPageCount(selectedFile),
        generateThumbnails(selectedFile)
      ]);

      setFile(selectedFile);
      setPageCount(loadedPageCount);
      setPagePreviews(thumbnails);
      setSelectedPages([]);
      setSplitMode("all-pages");
      setOutputMode("separate");
      setRanges([createEditableRange("1", String(Math.min(loadedPageCount, 1)))]);

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

  const toggleSelectedPage = (pageNumber: number) => {
    if (splitMode !== "selected-pages") {
      return;
    }

    setSelectedPages((current) => {
      if (current.includes(pageNumber)) {
        return current.filter((page) => page !== pageNumber);
      }

      return [...current, pageNumber];
    });
  };

  const updateRange = (id: string, field: "start" | "end", value: string) => {
    setRanges((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addRange = () => {
    setRanges((current) => [...current, createEditableRange()]);
  };

  const removeRange = (id: string) => {
    setRanges((current) => current.filter((item) => item.id !== id));
  };

  const buildSplitOptions = (): SplitOptions | null => {
    if (!pageCount) {
      setError("Please upload a valid PDF file first.");
      return null;
    }

    if (splitMode === "all-pages") {
      return { mode: "all-pages" };
    }

    if (splitMode === "every-n-pages") {
      const chunkSize = Number(everyNInput);

      if (!Number.isInteger(chunkSize) || chunkSize < 1) {
        setError("Split every N pages must be an integer greater than 0.");
        return null;
      }

      return { mode: "every-n-pages", chunkSize };
    }

    if (splitMode === "selected-pages") {
      if (selectedPages.length === 0) {
        setError("Select at least one page in the preview.");
        return null;
      }

      return {
        mode: "selected-pages",
        selectedPages,
        outputMode
      };
    }

    if (parsedRangesState.error) {
      setError(parsedRangesState.error);
      return null;
    }

    if (parsedRangesState.validRanges.length === 0) {
      setError("Add at least one valid range.");
      return null;
    }

    return {
      mode: "custom-ranges",
      ranges: parsedRangesState.validRanges,
      outputMode
    };
  };

  const onSplit = async () => {
    if (!file) {
      setError("Please upload a PDF file before splitting.");
      return;
    }

    const options = buildSplitOptions();
    if (!options) {
      return;
    }

    setIsSplitting(true);
    setError(null);
    setLastOutputMessage(null);

    try {
      const outputs = await splitPdfFile(file, options);

      outputs.forEach((output, index) => {
        window.setTimeout(() => {
          triggerDownload(output.blob, output.fileName);
        }, index * 120);
      });

      setLastOutputMessage(
        outputs.length === 1
          ? `Done. 1 file downloaded: ${outputs[0].fileName}`
          : `Done. ${outputs.length} files downloaded.`
      );
    } catch {
      setError("Split failed. Please try another PDF file.");
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={(event) => {
          void handleIncomingFiles(Array.from(event.target.files ?? []));
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

      {error ? (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {lastOutputMessage ? (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {lastOutputMessage}
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <h2 className="text-sm font-semibold text-slate-900">File preview</h2>
          <p className="mt-1 text-xs text-slate-600">
            {isLoadingPdf
              ? "Loading PDF details and thumbnails..."
              : file && pageCount
                ? `${file.name} · ${pageCount} page${pageCount === 1 ? "" : "s"}`
                : "No file added yet."}
          </p>

          {pagePreviews.length > 0 ? (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {pagePreviews.map((preview) => {
                const isSelected = selectedPages.includes(preview.pageNumber);
                const isInRange = rangePageSet.has(preview.pageNumber);
                const isInteractive = splitMode === "selected-pages";

                return (
                  <button
                    key={`${file?.name ?? "pdf"}-${file?.lastModified ?? 0}-${preview.pageNumber}`}
                    type="button"
                    onClick={() => toggleSelectedPage(preview.pageNumber)}
                    disabled={!isInteractive}
                    className={`rounded-lg border p-2 text-left transition ${
                      isSelected
                        ? "border-brand-600 bg-brand-50"
                        : isInRange && splitMode === "custom-ranges"
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 bg-white"
                    } ${isInteractive ? "hover:border-brand-500" : "cursor-default"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview.thumbnailDataUrl}
                      alt={`PDF page ${preview.pageNumber}`}
                      className="h-auto w-full rounded border border-slate-200"
                    />
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-700">Page {preview.pageNumber}</span>
                      {isSelected ? (
                        <span className="text-[10px] font-semibold text-brand-700">Selected</span>
                      ) : isInRange && splitMode === "custom-ranges" ? (
                        <span className="text-[10px] font-semibold text-emerald-700">In range</span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-3">
          <h2 className="text-sm font-semibold text-slate-900">Split settings</h2>

          <div className="mt-3 grid gap-2">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <input type="radio" name="split-mode" checked={splitMode === "all-pages"} onChange={() => setSplitMode("all-pages")} />
              Extract all pages separately
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <input type="radio" name="split-mode" checked={splitMode === "selected-pages"} onChange={() => setSplitMode("selected-pages")} />
              Extract selected pages visually
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <input type="radio" name="split-mode" checked={splitMode === "custom-ranges"} onChange={() => setSplitMode("custom-ranges")} />
              Extract custom ranges
            </label>
            <label className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <span className="flex items-center gap-2">
                <input type="radio" name="split-mode" checked={splitMode === "every-n-pages"} onChange={() => setSplitMode("every-n-pages")} />
                Split every N pages
              </span>
              <input
                type="number"
                min={1}
                step={1}
                value={everyNInput}
                onChange={(event) => setEveryNInput(event.target.value)}
                disabled={splitMode !== "every-n-pages"}
                className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm outline-none focus:border-brand-500 disabled:bg-slate-100"
              />
            </label>
          </div>

          {splitMode === "selected-pages" ? (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-900">Output for selected pages</p>
              <div className="mt-2 space-y-1.5 text-xs text-slate-700">
                <label className="flex items-center gap-2">
                  <input type="radio" name="output-mode-selected" checked={outputMode === "combined"} onChange={() => setOutputMode("combined")} />
                  Combine selected pages into one PDF
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="output-mode-selected" checked={outputMode === "separate"} onChange={() => setOutputMode("separate")} />
                  Download each selected page as separate PDF
                </label>
              </div>
              <p className="mt-2 text-xs text-slate-600">Selected: {selectedPages.length}{selectedPages.length ? ` (${selectedPages.join(", ")})` : ""}</p>
            </div>
          ) : null}

          {splitMode === "custom-ranges" ? (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-900">Custom ranges</p>
                <button type="button" onClick={addRange} className="rounded border border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-white">Add range</button>
              </div>

              <div className="mt-2 space-y-2">
                {ranges.map((range, index) => (
                  <div key={range.id} className="rounded border border-slate-200 bg-white p-2">
                    <p className="text-[11px] font-semibold text-slate-600">Range {index + 1}</p>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <input type="number" min={1} value={range.start} onChange={(event) => updateRange(range.id, "start", event.target.value)} placeholder="Start" className="rounded border border-slate-300 px-2 py-1 text-xs outline-none focus:border-brand-500" />
                      <input type="number" min={1} value={range.end} onChange={(event) => updateRange(range.id, "end", event.target.value)} placeholder="End" className="rounded border border-slate-300 px-2 py-1 text-xs outline-none focus:border-brand-500" />
                    </div>
                    <button type="button" onClick={() => removeRange(range.id)} disabled={ranges.length === 1} className="mt-2 rounded border border-red-300 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-50 disabled:opacity-50">Remove</button>
                  </div>
                ))}
              </div>

              <div className="mt-2 space-y-1.5 text-xs text-slate-700">
                <label className="flex items-center gap-2">
                  <input type="radio" name="output-mode-ranges" checked={outputMode === "separate"} onChange={() => setOutputMode("separate")} />
                  One PDF per range
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="output-mode-ranges" checked={outputMode === "combined"} onChange={() => setOutputMode("combined")} />
                  Combine all ranges
                </label>
              </div>

              <p className={`mt-2 text-xs ${parsedRangesState.error ? "text-red-700" : "text-slate-600"}`}>
                {parsedRangesState.error ?? `${parsedRangesState.validRanges.length} valid range(s) configured.`}
              </p>
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={onSplit}
              disabled={isSplitting || isLoadingPdf || !file}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSplitting ? "Splitting..." : "Split PDF"}
            </button>
            {file ? (
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPageCount(null);
                  setPagePreviews([]);
                  setLastOutputMessage(null);
                  setError(null);
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
