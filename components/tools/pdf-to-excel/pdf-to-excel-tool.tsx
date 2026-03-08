"use client";

import { useRef, useState } from "react";
import { extractPdfRows, pdfToCsv } from "@/lib/pdf/pdf-to-excel";
import { trackToolConversionCompleted, trackToolDownloadClicked, trackToolUploadStarted } from "@/lib/analytics";
import { formatFileLimit, isFileTooLarge } from "@/lib/upload-constraints";

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function PdfToExcelTool() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFile = (nextFile: File | undefined) => {
    if (!nextFile) return;
    if (!isPdfFile(nextFile)) {
      setError(`Only PDF files are allowed. Invalid file: ${nextFile.name}`);
      return;
    }
    if (isFileTooLarge(nextFile)) {
      setError(`Max file size is ${formatFileLimit()}. Too large: ${nextFile.name}`);
      return;
    }
    setFile(nextFile);
    setError(null);
    setSuccess(null);
    trackToolUploadStarted({ tool_slug: "pdf-to-excel", page_path: "/tools/pdf-to-excel", locale: "en", file_count: 1 });
  };

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const runCsvExport = async () => {
    if (!file) return setError("Please upload a PDF file first.");
    setIsProcessing(true); setError(null); setSuccess(null);
    try {
      const csv = await pdfToCsv(file);
      const name = `${file.name.replace(/\.pdf$/i, "")}.csv`;
      trackToolDownloadClicked({ tool_slug: "pdf-to-excel", page_path: "/tools/pdf-to-excel", locale: "en", output_format: "csv" });
      downloadBlob(csv, name);
      trackToolConversionCompleted({ tool_slug: "pdf-to-excel", page_path: "/tools/pdf-to-excel", locale: "en", output_format: "csv" });
      setSuccess(`Done. Downloaded ${name}.`);
    } catch {
      setError("Could not extract table-like text from this PDF in-browser.");
    } finally {
      setIsProcessing(false);
    }
  };

  const runXlsxExport = async () => {
    if (!file) return setError("Please upload a PDF file first.");
    setIsProcessing(true); setError(null); setSuccess(null);
    try {
      const rows = await extractPdfRows(file);
      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "ExtractedRows");
      const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const name = `${file.name.replace(/\.pdf$/i, "")}.xlsx`;
      trackToolDownloadClicked({ tool_slug: "pdf-to-excel", page_path: "/tools/pdf-to-excel", locale: "en", output_format: "xlsx" });
      downloadBlob(blob, name);
      trackToolConversionCompleted({ tool_slug: "pdf-to-excel", page_path: "/tools/pdf-to-excel", locale: "en", output_format: "xlsx" });
      setSuccess(`Done. Downloaded ${name}.`);
    } catch {
      setError("Could not generate XLSX from this PDF in-browser.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">Upload PDF</h2>
      <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); handleFile(Array.from(event.dataTransfer.files)[0]); }} className={`mt-3 w-full rounded-xl border-2 border-dashed px-4 py-8 text-center text-sm transition ${isDragging ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-300 bg-slate-50 text-slate-600 hover:border-brand-500 hover:bg-brand-50"}`}>
        {file ? `Selected: ${file.name}` : "Upload PDF or drop it here"}
      </button>
      <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => { handleFile(Array.from(e.target.files ?? [])[0]); e.target.value = ""; }} />
      <p className="mt-3 text-sm text-slate-700">Downloads as CSV format, compatible with Excel and Google Sheets.</p>
      <p className="mt-1 text-xs text-slate-600">Best for table-like PDFs. Complex layouts may need manual cleanup after CSV or XLSX export.</p>
      {error ? <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={runCsvExport} disabled={!file || isProcessing} className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">{isProcessing ? "Extracting..." : "Download CSV"}</button>
        <button type="button" onClick={runXlsxExport} disabled={!file || isProcessing} className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60">{isProcessing ? "Extracting..." : "Download XLSX"}</button>
      </div>
    </section>
  );
}
