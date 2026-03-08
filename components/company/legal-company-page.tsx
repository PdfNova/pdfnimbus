"use client";

import Link from "next/link";
import { useTranslation } from "@/components/i18n-provider";
import type { Language } from "@/lib/i18n";

type LocalizedText = Partial<Record<Language, string>> | string;

type Section = {
  title: LocalizedText;
  paragraphs?: LocalizedText[];
  bullets?: LocalizedText[];
};

type LegalCompanyPageProps = {
  title: LocalizedText;
  intro: LocalizedText[];
  sections: Section[];
  quickLinks?: { href: string; label: LocalizedText }[];
};

function pick(language: Language, text: LocalizedText) {
  if (typeof text === "string") {
    return text;
  }

  return text[language] ?? text.en ?? text.es ?? "";
}

export function LegalCompanyPage({
  title,
  intro = [],
  sections = [],
  quickLinks = []
}: LegalCompanyPageProps) {
  const { language } = useTranslation();

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 sm:py-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{pick(language, title)}</h1>
        <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          {intro.map((paragraph, index) => (
            <p key={`intro-${index}`}>{pick(language, paragraph)}</p>
          ))}
        </div>

        {quickLinks && quickLinks.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-700"
              >
                {pick(language, item.label)}
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      {Array.isArray(sections) && sections.length > 0 ? (
        <div className="mt-4 space-y-3">
          {sections.map((section, sectionIndex) => {
            const sectionTitle = pick(language, section.title);

            return (
              <section key={`section-${sectionIndex}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">{sectionTitle}</h2>

                {Array.isArray(section.paragraphs) && section.paragraphs.length > 0 ? (
                  <div className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <p key={`section-${sectionIndex}-p-${paragraphIndex}`}>{pick(language, paragraph)}</p>
                    ))}
                  </div>
                ) : null}

                {Array.isArray(section.bullets) && section.bullets.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-700">
                    {section.bullets.map((bullet, bulletIndex) => (
                      <li key={`section-${sectionIndex}-b-${bulletIndex}`}>{pick(language, bullet)}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            );
          })}
        </div>
      ) : null}
    </main>
  );
}
