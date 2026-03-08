"use client";

import { useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import { removePdfPages, RemovePdfPagesError } from "@/lib/pdf/remove-pdf-pages";
import { trackToolConversionCompleted, trackToolDownloadClicked, trackToolUploadStarted } from "@/lib/analytics";
import { formatFileLimit, isFileTooLarge } from "@/lib/upload-constraints";

GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

type PagePreview = { pageNumber: number; thumbnailDataUrl: string };

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

async function generatePdfPreviews(file: File): Promise<PagePreview[]> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const loadingTask = getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const previews: PagePreview[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 0.3 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Canvas unavailable");
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    await page.render({ canvasContext: context, viewport }).promise;
    previews.push({ pageNumber, thumbnailDataUrl: canvas.toDataURL("image/jpeg", 0.82) });
    canvas.width = 0; canvas.height = 0;
  }
  return previews;
}

export function RemovePdfPagesTool() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previews, setPreviews] = useState<PagePreview[]>([]);
  const [selectedToRemove, setSelectedToRemove] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFile = async (nextFile: File | undefined) => {
    if (!nextFile) return;
    if (!isPdfFile(nextFile)) return setError(`Only PDF files are allowed. Invalid file: ${nextFile.name}`);
    if (isFileTooLarge(nextFile)) return setError(`Max file size is ${formatFileLimit()}. Too large: ${nextFile.name}`);
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const nextPreviews = await generatePdfPreviews(nextFile);
      setFile(nextFile);
      setPreviews(nextPreviews);
      setSelectedToRemove([]);
      trackToolUploadStarted({ tool_slug: "remove-pdf-pages", page_path: "/tools/remove-pdf-pages", locale: "en", file_count: 1 });
    } catch {
      setError("Could not read this PDF file.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePage = (pageNumber: number) => {
    setSelectedToRemove((current) => current.includes(pageNumber) ? current.filter((p) => p !== pageNumber) : [...current, pageNumber].sort((a, b) => a - b));
  };

  const runRemove = async () => {
    if (!file) return setError("Please upload a PDF file first.");
    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    try {
      const blob = await removePdfPages(file, selectedToRemove.map((p) => p - 1));
      const name = `${file.name.replace(/\.pdf$/i, "")}-pages-removed.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      trackToolDownloadClicked({ tool_slug: "remove-pdf-pages", page_path: "/tools/remove-pdf-pages", locale: "en", output_format: "pdf" });
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      trackToolConversionCompleted({ tool_slug: "remove-pdf-pages", page_path: "/tools/remove-pdf-pages", locale: "en", output_format: "pdf" });
      setSuccess(`Done. Downloaded ${name}.`);
    } catch (error) {
      if (error instanceof RemovePdfPagesError) setError(error.message);
      else setError("Could not remove pages from this PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">Upload PDF and choose pages to remove</h2>
      <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); void handleFile(Array.from(e.dataTransfer.files)[0]); }} className={`mt-3 w-full rounded-xl border-2 border-dashed px-4 py-8 text-center text-sm transition ${isDragging ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-300 bg-slate-50 text-slate-600 hover:border-brand-500 hover:bg-brand-50"}`}>
        {file ? `Selected: ${file.name}` : "Upload PDF or drop it here"}
      </button>
      <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => { void handleFile(Array.from(e.target.files ?? [])[0]); e.target.value = ""; }} />
      <p className="mt-3 text-sm text-slate-700">Select the pages you want to remove. The output keeps the remaining pages in their original order.</p>
      {isLoading ? <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">Loading PDF preview...</div> : null}
      {error ? <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div> : null}
      {previews.length > 0 ? <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">{previews.map((preview) => { const selected = selectedToRemove.includes(preview.pageNumber); return <button key={preview.pageNumber} type="button" onClick={() => togglePage(preview.pageNumber)} className={`rounded-lg border p-2 text-left transition ${selected ? "border-red-400 bg-red-50" : "border-slate-200 bg-white hover:border-brand-400"}`}><div className="flex min-h-[140px] items-center justify-center overflow-hidden rounded border border-slate-200 bg-slate-50">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={preview.thumbnailDataUrl} alt={`PDF page ${preview.pageNumber}`} className="h-auto w-full object-contain" /></div><div className="mt-2 flex items-center justify-between"><span className="text-xs font-semibold text-slate-800">Page {preview.pageNumber}</span><span className={`text-[11px] font-medium ${selected ? "text-red-700" : "text-slate-500"}`}>{selected ? "Will be removed" : "Keep"}</span></div></button>; })}</div> : null}
      <button type="button" onClick={runRemove} disabled={!file || isProcessing || previews.length === 0} className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">{isProcessing ? "Processing..." : "Download updated PDF"}</button>
    </section>
  );
}
