"use client";

import { useTranslation } from "@/components/i18n-provider";
import type { Language } from "@/lib/i18n";

type LanguageSelectorProps = {
  compact?: boolean;
};

const LANGUAGE_OPTIONS: Language[] = ["en", "es"];

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useTranslation();

  if (compact) {
    return (
      <div
        className="inline-flex items-center rounded-lg border border-slate-300 bg-white p-0.5"
        aria-label={t("languageShort")}
        title={t("languageShort")}
      >
        {LANGUAGE_OPTIONS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setLanguage(value)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition ${
              language === value
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            aria-pressed={language === value}
          >
            {value}
          </button>
        ))}
      </div>
    );
  }

  return (
    <label className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
      <span>{t("languageShort")}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as "en" | "es")}
        className="bg-transparent text-xs font-semibold text-slate-700 outline-none"
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </label>
  );
}
