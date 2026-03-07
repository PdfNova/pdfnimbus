"use client";

import { useMemo, useState } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import {
  trackDownloadGenerated,
  trackFileUploaded,
  trackToolUsed,
  trackEvent
} from "@/lib/analytics";
import { formatFileLimit, isFileTooLarge } from "@/lib/upload-constraints";

type CompressionLevel = "low" | "recommended" | "extreme";

type ImageItem = {
  id: string;
  file: File;
  previewUrl: string;
  compressedBlob?: Blob;
  compressedName?: string;
};

const LEVEL_OPTIONS: Array<{
  value: CompressionLevel;
  label: string;
  hint: string;
  quality: number;
  maxWidthOrHeight: number;
}> = [
  {
    value: "low",
    label: "Low",
    hint: "Higher quality with lighter size reduction.",
    quality: 0.85,
    maxWidthOrHeight: 2400
  },
  {
    value: "recommended",
    label: "Recommended",
    hint: "Best balance for most images.",
    quality: 0.7,
    maxWidthOrHeight: 2000
  },
  {
    value: "extreme",
    label: "Extreme",
    hint: "Strongest reduction, lower quality.",
    quality: 0.5,
    maxWidthOrHeight: 1600
  }
];

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getCompressedName(file: File) {
  const dot = file.name.lastIndexOf(".");
  if (dot === -1) return `${file.name}-compressed.jpg`;
  return `${file.name.slice(0, dot)}-compressed${file.name.slice(dot)}`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function CompressImageTool() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<CompressionLevel>("recommended");

  const selectedLevel = useMemo(
    () => LEVEL_OPTIONS.find((option) => option.value === level) ?? LEVEL_OPTIONS[1],
    [level]
  );

  const handleFiles = (incoming: File[]) => {
    const tooLarge = incoming.filter((file) => isFileTooLarge(file));
    const valid = incoming.filter(
      (file) => file.type.startsWith("image/") && !isFileTooLarge(file)
    );
    const invalid = incoming.filter((file) => !file.type.startsWith("image/"));

    if (invalid.length > 0 || tooLarge.length > 0) {
      const messages: string[] = [];
      if (invalid.length > 0) {
        messages.push(`Only image files are allowed. Invalid: ${invalid.map((f) => f.name).join(", ")}`);
      }
      if (tooLarge.length > 0) {
        messages.push(`Max file size is ${formatFileLimit()}. Too large: ${tooLarge.map((f) => f.name).join(", ")}`);
      }
      setError(messages.join(" "));
    } else {
      setError(null);
    }

    if (valid.length > 0) {
      const nextItems = valid.map((file) => ({
        id: createId(),
        file,
        previewUrl: URL.createObjectURL(file)
      }));

      setItems((current) => [...current, ...nextItems]);
      trackFileUploaded("compress_image", nextItems.length);
    }
  };

  const onCompress = async () => {
    if (items.length === 0) {
      setError("Please upload images before compressing.");
      return;
    }

    setIsCompressing(true);
    setError(null);

    try {
      const compressedItems = await Promise.all(
        items.map(async (item) => {
          const compressed = await imageCompression(item.file, {
            maxSizeMB: 10,
            maxWidthOrHeight: selectedLevel.maxWidthOrHeight,
            initialQuality: selectedLevel.quality,
            useWebWorker: true
          });

          return {
            ...item,
            compressedBlob: compressed,
            compressedName: getCompressedName(item.file)
          };
        })
      );

      setItems(compressedItems);
      trackToolUsed("compress_image");
      trackEvent("compress_image_complete", {
        file_count: compressedItems.length,
        level
      });
    } catch {
      setError("Image compression failed. Try smaller files or another format.");
    } finally {
      setIsCompressing(false);
    }
  };

  const onDownload = async () => {
    const ready = items.filter((item) => item.compressedBlob && item.compressedName);
    if (ready.length === 0) {
      setError("Compress images first before downloading.");
      return;
    }

    if (ready.length === 1) {
      downloadBlob(ready[0].compressedBlob as Blob, ready[0].compressedName as string);
      trackDownloadGenerated("compress_image", "image");
      return;
    }

    const zip = new JSZip();
    ready.forEach((item) => {
      zip.file(item.compressedName as string, item.compressedBlob as Blob);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    downloadBlob(zipBlob, "pdfnova-compressed-images.zip");
    trackDownloadGenerated("compress_image", "zip");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      {error ? (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(Array.from(event.dataTransfer.files));
        }}
        className={`mb-4 block cursor-pointer rounded-xl border-2 border-dashed px-4 py-7 text-center transition ${
          isDragging
            ? "border-brand-600 bg-brand-50"
            : "border-slate-300 bg-slate-50 hover:border-brand-500 hover:bg-brand-50"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            handleFiles(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        <span className="block text-sm font-semibold text-slate-700">
          {items.length > 0 ? "Add more images" : "Select images or drop them here"}
        </span>
      </label>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <h2 className="text-sm font-semibold text-slate-900">Image preview</h2>
          {items.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No images uploaded yet.</p>
          ) : (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {items.map((item) => {
                const original = item.file.size;
                const compressed = item.compressedBlob?.size;
                const saved = compressed
                  ? Math.max(0, Math.round((1 - compressed / Math.max(original, 1)) * 100))
                  : null;

                return (
                  <li key={item.id} className="rounded-lg border border-slate-200 bg-white p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="h-28 w-full rounded border border-slate-200 object-cover"
                    />
                    <p className="mt-2 truncate text-xs font-semibold text-slate-900">{item.file.name}</p>
                    <p className="mt-1 text-[11px] text-slate-600">
                      Original: {formatSize(original)}
                      {compressed ? ` · Compressed: ${formatSize(compressed)}` : ""}
                    </p>
                    {saved !== null ? (
                      <p className="mt-1 text-[11px] font-semibold text-emerald-700">{saved}% saved</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-3">
          <h2 className="text-sm font-semibold text-slate-900">Compression options</h2>
          <div className="mt-3 space-y-2">
            {LEVEL_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLevel(option.value)}
                className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                  level === option.value
                    ? "border-brand-600 bg-brand-50"
                    : "border-slate-200 bg-slate-50 hover:border-brand-400"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                <p className="mt-1 text-xs text-slate-600">{option.hint}</p>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onCompress}
            disabled={isCompressing || items.length === 0}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCompressing ? "Compressing images..." : "Compress images"}
          </button>

          <button
            type="button"
            onClick={onDownload}
            disabled={items.filter((item) => item.compressedBlob).length === 0}
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Download compressed files
          </button>
        </aside>
      </div>
    </section>
  );
}
