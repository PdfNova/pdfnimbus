"use client";

import { useTranslation } from "@/components/i18n-provider";

export function LanguageSelector() {
  const { language, setLanguage, t } = useTranslation();

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
