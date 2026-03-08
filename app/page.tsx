"use client";

import Link from "next/link";
import { toolRegistry } from "@/lib/tools-registry";
import { useTranslation } from "@/components/i18n-provider";

const activeTools = toolRegistry.filter((tool) => tool.active);

const whyIcons = ["LOCAL", "NO-UPLOAD", "FAST", "PRIVATE"] as const;

export default function HomePage() {
  const { t, language } = useTranslation();

  const whyCards =
    language === "es"
      ? [
          { title: t("browserFirst"), description: "Tus archivos se procesan localmente en el navegador." },
          { title: t("noUploads"), description: "No hay subida obligatoria al servidor para tareas normales." },
          { title: t("fastProcessing"), description: "Flujos optimizados para resultados rapidos." },
          { title: t("privacyFirst"), description: "Tus datos permanecen bajo tu control." }
        ]
      : [
          { title: t("browserFirst"), description: "Your files are processed locally in the browser." },
          { title: t("noUploads"), description: "No mandatory server upload for standard tasks." },
          { title: t("fastProcessing"), description: "Optimized flows keep processing quick." },
          { title: t("privacyFirst"), description: "Your data stays under your control." }
        ];

  return (
    <main className="mx-auto w-full max-w-[1620px] px-3 py-4 sm:px-4 sm:py-5 lg:px-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("heroTitle")}</h1>
        <p className="mt-2 max-w-4xl text-sm text-slate-600 sm:text-base">{t("heroSubtitle")}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/tools"
            className="inline-flex rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {t("chooseTool")}
          </Link>
        </div>
      </section>

      <section id="tools" className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900">{t("allActiveTools")}</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
          {activeTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm transition hover:border-brand-500 hover:bg-brand-50"
            >
              <p className="font-semibold text-slate-900">{t(tool.labelKey)}</p>
              <p className="mt-1 text-xs text-slate-600">{t(tool.descriptionKey)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900">{t("whyPDFNimbus")}</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
          {whyCards.map((card, index) => (
            <article key={card.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{whyIcons[index]}</p>
              <h3 className="mt-1.5 text-sm font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-1 text-xs text-slate-600">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900">{t("securePrivate")}</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">SSL</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">GDPR</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Browser processing</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">No storage</div>
        </div>
      </section>
    </main>
  );
}

