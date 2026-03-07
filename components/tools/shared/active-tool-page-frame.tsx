"use client";

import { PdfNovaToolsGrid } from "@/components/tools/shared/pdfnova-tools-grid";
import { useTranslation } from "@/components/i18n-provider";
import type { Language } from "@/lib/i18n";

type LocalizedText = Record<Language, string>;

type FaqItem = {
  question: LocalizedText;
  answer: LocalizedText;
};

type ActiveToolPageFrameProps = {
  currentToolHref: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  howToTitle: LocalizedText;
  howToText: LocalizedText;
  faqItems: FaqItem[];
  children: React.ReactNode;
};

function pick(language: Language, text: LocalizedText) {
  return text[language] ?? text.en;
}

export function ActiveToolPageFrame({
  currentToolHref,
  title,
  subtitle,
  howToTitle,
  howToText,
  faqItems,
  children
}: ActiveToolPageFrameProps) {
  const { language } = useTranslation();
  const faqHeading = language === "es" ? "Preguntas frecuentes" : "FAQ";

  return (
    <main className="mx-auto w-full max-w-[1620px] px-3 py-4 sm:px-4 sm:py-5 lg:px-5">
      <header className="mb-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[30px]">
          {pick(language, title)}
        </h1>
        <p className="mt-1.5 max-w-5xl text-sm text-slate-600 sm:text-base">{pick(language, subtitle)}</p>
      </header>

      <PdfNovaToolsGrid currentToolHref={currentToolHref} />

      <section className="mb-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-5">
        <h2 className="text-base font-semibold text-slate-900">{pick(language, howToTitle)}</h2>
        <p className="mt-1 text-sm text-slate-600">{pick(language, howToText)}</p>
      </section>

      {children}

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-xl font-semibold text-slate-900">{faqHeading}</h2>
        <div className="mt-3 space-y-4">
          {faqItems.map((item, index) => (
            <article key={`${item.question.en}-${index}`}>
              <h3 className="text-sm font-semibold text-slate-900">{pick(language, item.question)}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{pick(language, item.answer)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
