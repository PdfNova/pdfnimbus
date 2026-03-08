"use client";

import { useRef, useState } from "react";
import { spreadsheetToPdf, SpreadsheetToPdfError } from "@/lib/pdf/excel-to-pdf";
import { formatFileLimit, isFileTooLarge } from "@/lib/upload-constraints";

function isSupported(file: File) {
  const name = file.name.toLowerCase();
  return name.endsWith(".csv") || name.endsWith(".tsv") || name.endsWith(".txt") || name.endsWith(".xlsx");
}

export function ExcelToPdfTool() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFile = (nextFile: File | undefined) => {
    if (!nextFile) return;
    if (!isSupported(nextFile)) {
      setError(`Please upload a CSV, TSV, TXT, or XLSX spreadsheet file. Invalid file: ${nextFile.name}`);
      return;
    }
    if (isFileTooLarge(nextFile)) {
      setError(`Max file size is ${formatFileLimit()}. Too large: ${nextFile.name}`);
      return;
    }
    setFile(nextFile);
    setError(null);
    setSuccess(null);
  };

  const runExport = async () => {
    if (!file) {
      setError("Please upload a spreadsheet file first.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    try {
      const pdf = await spreadsheetToPdf(file);
      const name = `${file.name.replace(/\.(csv|tsv|txt|xlsx)$/i, "")}.pdf`;
      const url = URL.createObjectURL(pdf);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setSuccess(`Done. Downloaded ${name}.`);
    } catch (error) {
      if (error instanceof SpreadsheetToPdfError) {
        setError(error.message);
      } else {
        setError("Could not convert this spreadsheet in-browser.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">Upload spreadsheet</h2>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => { event.preventDefault(); setIsDragging(false); handleFile(Array.from(event.dataTransfer.files)[0]); }}
        className={`mt-3 w-full rounded-xl border-2 border-dashed px-4 py-8 text-center text-sm transition ${isDragging ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-300 bg-slate-50 text-slate-600 hover:border-brand-500 hover:bg-brand-50"}`}
      >
        {file ? `Selected: ${file.name}` : "Upload CSV/TSV/TXT or drop it here"}
      </button>
      <input ref={inputRef} type="file" accept=".csv,.tsv,.txt,.xlsx" className="hidden" onChange={(e) => { handleFile(Array.from(e.target.files ?? [])[0]); e.target.value = ""; }} />
      <p className="mt-3 text-sm text-slate-700">Best for simple spreadsheets and table-style documents. Advanced formatting may not be preserved.</p>
      <p className="mt-1 text-xs text-slate-600">Current browser-only support is strongest for CSV, TSV, and plain text tables. XLSX may need export to CSV first.</p>
      {error ? <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div> : null}
      <button type="button" onClick={runExport} disabled={!file || isProcessing} className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
        {isProcessing ? "Creating PDF..." : "Download PDF"}
      </button>
    </section>
  );
}
