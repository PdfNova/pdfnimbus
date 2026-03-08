"use client";

import { useRef, useState } from "react";
import { protectPdfFile, ProtectPdfError } from "@/lib/pdf/protect-pdf-file";
import { trackToolConversionCompleted, trackToolDownloadClicked, trackToolUploadStarted } from "@/lib/analytics";
import { formatFileLimit, isFileTooLarge } from "@/lib/upload-constraints";

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function ProtectPdfTool() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFile = (nextFile: File | undefined) => {
    if (!nextFile) return;
    if (!isPdfFile(nextFile)) return setError(`Only PDF files are allowed. Invalid file: ${nextFile.name}`);
    if (isFileTooLarge(nextFile)) return setError(`Max file size is ${formatFileLimit()}. Too large: ${nextFile.name}`);
    setFile(nextFile);
    setError(null);
    setSuccess(null);
    trackToolUploadStarted({ tool_slug: "protect-pdf", page_path: "/tools/protect-pdf", locale: "en", file_count: 1 });
  };

  const runProtect = async () => {
    if (!file) return setError("Please upload a PDF file first.");
    if (!password.trim()) return setError("Please enter a password.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    try {
      const blob = await protectPdfFile(file, password);
      const name = `${file.name.replace(/\.pdf$/i, "")}-protected.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      trackToolDownloadClicked({ tool_slug: "protect-pdf", page_path: "/tools/protect-pdf", locale: "en", output_format: "pdf" });
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      trackToolConversionCompleted({ tool_slug: "protect-pdf", page_path: "/tools/protect-pdf", locale: "en", output_format: "pdf" });
      setSuccess(`Done. Downloaded ${name}.`);
    } catch (error) {
      if (error instanceof ProtectPdfError) setError(error.message);
      else setError("Could not protect this PDF in-browser.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">Upload and password settings</h2>
      <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(Array.from(e.dataTransfer.files)[0]); }} className={`mt-3 w-full rounded-xl border-2 border-dashed px-4 py-8 text-center text-sm transition ${isDragging ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-300 bg-slate-50 text-slate-600 hover:border-brand-500 hover:bg-brand-50"}`}>
        {file ? `Selected: ${file.name}` : "Upload PDF or drop it here"}
      </button>
      <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => { handleFile(Array.from(e.target.files ?? [])[0]); e.target.value = ""; }} />

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500" placeholder="Enter password" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">Confirm password</span>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500" placeholder="Confirm password" />
        </label>
      </div>

      <p className="mt-3 text-sm text-slate-700">Adds a basic password-protected PDF output in-browser. Keep the password safe. Advanced enterprise permission models are not exposed in this UI.</p>
      {error ? <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div> : null}
      <button type="button" onClick={runProtect} disabled={!file || !password || !confirmPassword || isProcessing} className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">{isProcessing ? "Protecting..." : "Download protected PDF"}</button>
    </section>
  );
}
