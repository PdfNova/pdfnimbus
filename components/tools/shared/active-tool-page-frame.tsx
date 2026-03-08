"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "@/components/i18n-provider";
import { trackToolPageViewed } from "@/lib/analytics";
import type { Language } from "@/lib/i18n";

type LocalizedText = Record<Language, string>;

type FaqItem = {
  question: LocalizedText;
  answer: LocalizedText;
};

type RelatedToolLink = {
  href: string;
  label: LocalizedText;
};

type RelatedGuideLink = {
  href: string;
  label: LocalizedText;
};

type ActiveToolPageFrameProps = {
  currentToolHref: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  howToTitle: LocalizedText;
  howToText: LocalizedText;
  introParagraphs?: LocalizedText[];
  benefitsTitle?: LocalizedText;
  benefitsItems?: LocalizedText[];
  relatedToolsTitle?: LocalizedText;
  relatedTools?: RelatedToolLink[];
  relatedGuidesTitle?: LocalizedText;
  relatedGuides?: RelatedGuideLink[];
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
  introParagraphs,
  benefitsTitle,
  benefitsItems,
  relatedToolsTitle,
  relatedTools,
  relatedGuidesTitle,
  relatedGuides,
  faqItems,
  children
}: ActiveToolPageFrameProps) {
  const { language, t } = useTranslation();

  useEffect(() => {
    trackToolPageViewed({
      tool_slug: currentToolHref.replace("/tools/", ""),
      page_path: currentToolHref,
      locale: language
    });
  }, [currentToolHref, language]);

  return (
    <main className="mx-auto w-full max-w-[1620px] px-2 py-3 sm:px-3 sm:py-4 lg:px-4">
      <header className="mb-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[30px]">
              {pick(language, title)}
            </h1>
            <p className="mt-1.5 max-w-5xl text-sm text-slate-600 sm:text-base">{pick(language, subtitle)}</p>
          </div>
          <Link
            href="/tools"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-brand-400 hover:text-brand-700"
          >
            {t("allTools")}
          </Link>
        </div>
      </header>

      <section
        className="mb-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm sm:px-5"
        data-current-tool={currentToolHref}
      >
        <h2 className="text-sm font-semibold text-slate-900">{pick(language, howToTitle)}</h2>
        <p className="mt-1 text-sm text-slate-600">{pick(language, howToText)}</p>
      </section>

      {children}

      {introParagraphs && introParagraphs.length > 0 ? (
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="space-y-2.5 text-sm leading-6 text-slate-700">
            {introParagraphs.map((paragraph, index) => (
              <p key={`intro-${index}`}>{pick(language, paragraph)}</p>
            ))}
          </div>
        </section>
      ) : null}

      {benefitsItems && benefitsItems.length > 0 ? (
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          {benefitsTitle ? (
            <h2 className="text-lg font-semibold text-slate-900">{pick(language, benefitsTitle)}</h2>
          ) : null}
          <ul className="mt-2.5 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            {benefitsItems.map((benefit, index) => (
              <li key={`benefit-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                {pick(language, benefit)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {relatedTools && relatedTools.length > 0 ? (
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            {relatedToolsTitle ? pick(language, relatedToolsTitle) : t("allTools")}
          </h2>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-400 hover:bg-white hover:text-brand-700"
              >
                {pick(language, tool.label)}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {relatedGuides && relatedGuides.length > 0 ? (
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            {relatedGuidesTitle ? pick(language, relatedGuidesTitle) : "Learn how to use this tool"}
          </h2>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {relatedGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-400 hover:bg-white hover:text-brand-700"
              >
                {pick(language, guide.label)}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900">{t("faqHeading")}</h2>
        <div className="mt-2.5 space-y-3">
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
