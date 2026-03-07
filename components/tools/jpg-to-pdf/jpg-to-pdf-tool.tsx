"use client";

import { useEffect, useRef, useState } from "react";
import { imagesToPdf } from "@/lib/pdf/jpg-to-pdf";
import { formatFileLimit, isFileTooLarge } from "@/lib/upload-constraints";
import { useTranslation } from "@/components/i18n-provider";

type UploadItem = {
  id: string;
  file: File;
  previewUrl: string;
};

function isImageFile(file: File) {
  return ["image/jpeg", "image/jpg", "image/png"].includes(file.type) || /\.(jpe?g|png)$/i.test(file.name);
}

function createItemId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatMb(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function JpgToPdfTool() {
  const { language } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const itemsRef = useRef<UploadItem[]>([]);

  const copy =
    language === "es"
      ? {
          uploadMore: "Agregar mas imagenes",
          uploadFirst: "Selecciona imagenes o sueltalas aqui",
          filePreview: "Vista del archivo",
          clearAll: "Limpiar todo",
          noFiles: "Aun no hay archivos agregados.",
          remove: "Quitar",
          options: "Opciones de conversion",
          optionsHint: "El orden final del PDF sigue el orden de la lista de la izquierda.",
          up: "Subir",
          down: "Bajar",
          convertBusy: "Convirtiendo...",
          convertCta: "Convertir a PDF",
          invalidFiles: (names: string) => `Solo se permiten imagenes JPG y PNG. Invalidos: ${names}`,
          tooLarge: (names: string) => `Tamano maximo ${formatFileLimit()}. Muy grandes: ${names}`,
          uploadBefore: "Sube archivos JPG o PNG antes de convertir.",
          convertFailed: "La conversion fallo. Prueba con archivos mas pequenos o validos.",
          done: (count: number, size: string) => `Listo. PDF creado con ${count} imagen(es) (${size}).`
        }
      : {
          uploadMore: "Add more images",
          uploadFirst: "Select images or drop them here",
          filePreview: "File preview",
          clearAll: "Clear all",
          noFiles: "No files added yet.",
          remove: "Remove",
          options: "Convert options",
          optionsHint: "Final PDF order follows the file order on the left.",
          up: "Up",
          down: "Down",
          convertBusy: "Converting...",
          convertCta: "Convert to PDF",
          invalidFiles: (names: string) => `Only JPG and PNG images are allowed. Invalid: ${names}`,
          tooLarge: (names: string) => `Max file size is ${formatFileLimit()}. Too large: ${names}`,
          uploadBefore: "Please upload JPG or PNG files before converting.",
          convertFailed: "Conversion failed. Please try smaller or valid image files.",
          done: (count: number, size: string) => `Done. Created PDF from ${count} image(s) (${size}).`
        };

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const handleFiles = (incoming: File[]) => {
    const tooLarge = incoming.filter((file) => isFileTooLarge(file));
    const valid = incoming.filter((file) => isImageFile(file) && !isFileTooLarge(file));
    const invalid = incoming.filter((file) => !isImageFile(file));

    if (invalid.length > 0 || tooLarge.length > 0) {
      const messages: string[] = [];
      if (invalid.length > 0) {
        messages.push(copy.invalidFiles(invalid.map((item) => item.name).join(", ")));
      }
      if (tooLarge.length > 0) {
        messages.push(copy.tooLarge(tooLarge.map((item) => item.name).join(", ")));
      }
      setError(messages.join(" "));
    } else {
      setError(null);
    }

    if (valid.length > 0) {
      const newItems = valid.map((file) => ({
        id: createItemId(),
        file,
        previewUrl: URL.createObjectURL(file)
      }));

      setItems((current) => [...current, ...newItems]);
      setSuccessMessage(null);
    }
  };

  const removeItem = (id: string) => {
    setItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }

      return current.filter((item) => item.id !== id);
    });
  };

  const clearAll = () => {
    setItems((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
    setSuccessMessage(null);
  };

  const moveItem = (id: string, direction: "up" | "down") => {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === id);
      if (index < 0) return current;

      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const updated = [...current];
      const [moved] = updated.splice(index, 1);
      updated.splice(nextIndex, 0, moved);
      return updated;
    });
  };

  const onConvert = async () => {
    if (items.length === 0) {
      setError(copy.uploadBefore);
      return;
    }

    setIsConverting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const orderedFiles = items.map((item) => item.file);
      const outputBlob = await imagesToPdf(orderedFiles);

      const url = URL.createObjectURL(outputBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "images-to-pdf.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setSuccessMessage(copy.done(items.length, formatMb(outputBlob.size)));
    } catch {
      setError(copy.convertFailed);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        className="hidden"
        onChange={(event) => {
          handleFiles(Array.from(event.target.files ?? []));
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
          handleFiles(Array.from(event.dataTransfer.files));
        }}
        className={`w-full rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
          isDragging
            ? "border-brand-600 bg-brand-50"
            : "border-slate-300 bg-slate-50 hover:border-brand-500 hover:bg-brand-50"
        }`}
      >
        <span className="block text-sm font-semibold text-slate-700">
          {items.length > 0 ? copy.uploadMore : copy.uploadFirst}
        </span>
      </button>

      {error ? (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}

      {successMessage ? (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">{copy.filePreview}</h2>
            {items.length > 0 ? (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                {copy.clearAll}
              </button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-slate-600">{copy.noFiles}</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="h-12 w-10 rounded border border-slate-200 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-900">
                        {index + 1}. {item.file.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{formatMb(item.file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded border border-red-300 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-50"
                  >
                    {copy.remove}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-3">
          <h2 className="text-sm font-semibold text-slate-900">{copy.options}</h2>
          <p className="mt-1 text-xs text-slate-600">{copy.optionsHint}</p>

          {items.length > 0 ? (
            <div className="mt-3 space-y-2">
              {items.map((item, index) => (
                <div key={`order-${item.id}`} className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs font-semibold text-slate-500">{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => moveItem(item.id, "up")}
                    disabled={index === 0}
                    className="rounded border border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-700 enabled:hover:bg-slate-100 disabled:opacity-50"
                  >
                    {copy.up}
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(item.id, "down")}
                    disabled={index === items.length - 1}
                    className="rounded border border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-700 enabled:hover:bg-slate-100 disabled:opacity-50"
                  >
                    {copy.down}
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onConvert}
            disabled={isConverting || items.length === 0}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConverting ? copy.convertBusy : copy.convertCta}
          </button>
        </aside>
      </div>
    </section>
  );
}
