"use client";

import { useRef, useState } from "react";
import { unlockPdfFile, UnlockPdfError } from "@/lib/pdf/unlock-pdf-file";
import { formatFileLimit, isFileTooLarge } from "@/lib/upload-constraints";

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function buildOutputName(fileName: string) {
  const base = fileName.replace(/\.pdf$/i, "");
  return `${base}-unlocked.pdf`;
}

export function UnlockPdfTool() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
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
  };

  const processUnlock = async () => {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }

    if (!consentChecked) {
      setError("You must confirm legal authorization before unlocking.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const unlocked = await unlockPdfFile(file, password);
      const outputName = buildOutputName(file.name);
      const url = URL.createObjectURL(unlocked);
      const a = document.createElement("a");
      a.href = url;
      a.download = outputName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setSuccess(`Done. Generated and downloaded ${outputName}.`);
    } catch (err) {
      if (err instanceof UnlockPdfError) {
        setError(err.message);
      } else {
        setError("Unlock failed. This file may be unsupported or the password is incorrect.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">Upload and unlock settings</h2>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFile(Array.from(event.dataTransfer.files)[0]);
        }}
        className={`mt-3 w-full rounded-xl border-2 border-dashed px-4 py-8 text-center text-sm transition ${
          isDragging
            ? "border-brand-600 bg-brand-50 text-brand-700"
            : "border-slate-300 bg-slate-50 text-slate-600 hover:border-brand-500 hover:bg-brand-50"
        }`}
      >
        {file ? `Selected: ${file.name}` : "Upload PDF or drop it here"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(event) => {
          handleFile(Array.from(event.target.files ?? [])[0]);
          event.target.value = "";
        }}
      />

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-900">PDF password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
          <p className="mt-1 text-xs text-slate-600">Enter the PDF password to remove it permanently.</p>
        </label>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm leading-6 text-slate-700">
            Only use this tool on PDFs you own or have explicit permission to unlock.
          </p>
          <label className="mt-3 flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(event) => setConsentChecked(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300"
            />
            <span>I confirm I have the right to remove the password from this document</span>
          </label>
        </div>
      </div>

      {error ? (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}
      {success ? (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <button
        type="button"
        onClick={processUnlock}
        disabled={!file || !consentChecked || isProcessing}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isProcessing ? "Unlocking..." : "Unlock PDF"}
      </button>
    </section>
  );
}
