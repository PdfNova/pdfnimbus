"use client";

import Link from "next/link";
import { toolRegistry } from "@/lib/tools-registry";
import { useTranslation } from "@/components/i18n-provider";

const TOOL_LINKS = toolRegistry.filter((tool) => tool.active);

type PdfNovaToolsGridProps = {
  currentToolHref?: string;
};

export function PdfNovaToolsGrid({ currentToolHref }: PdfNovaToolsGridProps) {
  const { t } = useTranslation();

  return (
    <section className="mb-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900">{t("pdfnovaTools")}</h2>
        <Link href="/tools" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
          {t("viewAll")}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
        {TOOL_LINKS.map((tool) => {
          const isCurrent = tool.href === currentToolHref;

          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={`rounded-xl border px-3 py-2 transition ${
                isCurrent
                  ? "border-brand-500 bg-brand-50"
                  : "border-slate-200 bg-slate-50 hover:border-brand-400 hover:bg-white"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                  {tool.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t(tool.labelKey)}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{t(tool.descriptionKey)}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
