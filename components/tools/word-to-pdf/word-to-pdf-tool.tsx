"use client";

import { useRef, useState } from "react";
import { wordToPdf, WordToPdfError } from "@/lib/pdf/word-to-pdf";
import { trackToolConversionCompleted, trackToolDownloadClicked, trackToolUploadStarted } from "@/lib/analytics";
import { formatFileLimit, isFileTooLarge } from "@/lib/upload-constraints";

function isSupported(file: File) {
  const lower = file.name.toLowerCase();
  return lower.endsWith(".docx") || lower.endsWith(".txt");
}

export function WordToPdfTool() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFile = (nextFile: File | undefined) => {
    if (!nextFile) return;
    if (!isSupported(nextFile)) return setError(`Please upload a DOCX or TXT file. Invalid file: ${nextFile.name}`);
    if (isFileTooLarge(nextFile)) return setError(`Max file size is ${formatFileLimit()}. Too large: ${nextFile.name}`);
    setFile(nextFile); setError(null); setSuccess(null);
    trackToolUploadStarted({ tool_slug: "word-to-pdf", page_path: "/tools/word-to-pdf", locale: "en", file_count: 1 });
  };

  const runConversion = async () => {
    if (!file) return setError("Please upload a document first.");
    setIsProcessing(true); setError(null); setSuccess(null);
    try {
      const blob = await wordToPdf(file);
      const name = `${file.name.replace(/\.(docx|txt)$/i, "")}.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); trackToolDownloadClicked({ tool_slug: "word-to-pdf", page_path: "/tools/word-to-pdf", locale: "en", output_format: "pdf" }); a.click(); a.remove(); URL.revokeObjectURL(url);
      trackToolConversionCompleted({ tool_slug: "word-to-pdf", page_path: "/tools/word-to-pdf", locale: "en", output_format: "pdf" });
      setSuccess(`Done. Downloaded ${name}.`);
    } catch (error) {
      if (error instanceof WordToPdfError) setError(error.message);
      else setError("Could not convert this document in-browser.");
    } finally { setIsProcessing(false); }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">Upload DOCX or TXT</h2>
      <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(Array.from(e.dataTransfer.files)[0]); }} className={`mt-3 w-full rounded-xl border-2 border-dashed px-4 py-8 text-center text-sm transition ${isDragging ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-300 bg-slate-50 text-slate-600 hover:border-brand-500 hover:bg-brand-50"}`}>
        {file ? `Selected: ${file.name}` : "Upload DOCX/TXT or drop it here"}
      </button>
      <input ref={inputRef} type="file" accept=".docx,.txt" className="hidden" onChange={(e) => { handleFile(Array.from(e.target.files ?? [])[0]); e.target.value = ""; }} />
      <p className="mt-3 text-sm text-slate-700">Best for text-based DOCX or TXT files. Complex layouts, images, and advanced Word formatting may not be preserved.</p>
      {error ? <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div> : null}
      <button type="button" onClick={runConversion} disabled={!file || isProcessing} className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">{isProcessing ? "Creating PDF..." : "Download PDF"}</button>
    </section>
  );
}
