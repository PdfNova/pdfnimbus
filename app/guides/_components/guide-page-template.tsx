import Link from "next/link";

type GuideSection = {
  title: string;
  paragraphs: string[];
};

type RelatedTool = {
  href: string;
  label: string;
};

type RelatedGuide = {
  href: string;
  label: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type GuidePageTemplateProps = {
  title: string;
  intro: string[];
  steps: string[];
  ctaHref: string;
  ctaLabel: string;
  benefits: string[];
  relatedTools: RelatedTool[];
  relatedGuides?: RelatedGuide[];
  currentGuideHref?: string;
  faqItems?: FaqItem[];
  sections?: GuideSection[];
};

export function GuidePageTemplate({
  title,
  intro,
  steps,
  ctaHref,
  ctaLabel,
  benefits,
  relatedTools,
  relatedGuides,
  currentGuideHref,
  faqItems,
  sections
}: GuidePageTemplateProps) {
  const fallbackGuides: RelatedGuide[] = [
    { href: "/guides/merge-pdf-files", label: "How to Merge PDF Files Online" },
    { href: "/guides/compress-pdf-without-losing-quality", label: "How to Compress PDF Without Losing Quality" },
    { href: "/guides/split-pdf-by-range", label: "How to Split PDF by Page Range" },
    { href: "/guides/pdf-pages-to-jpg", label: "How to Convert PDF Pages to JPG Images" }
  ];

  const guidesToShow =
    relatedGuides && relatedGuides.length >= 2
      ? relatedGuides
      : fallbackGuides.filter((guide) => guide.href !== currentGuideHref).slice(0, 2);

  return (
    <main className="mx-auto w-full max-w-[1000px] px-4 py-5 sm:px-6 sm:py-7">
      <article className="space-y-4">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
          <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {intro.map((paragraph, index) => (
              <p key={`intro-${index}`}>{paragraph}</p>
            ))}
          </div>

          <Link
            href={ctaHref}
            className="mt-4 inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {ctaLabel}
          </Link>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Step-by-step</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
            {steps.map((step, index) => (
              <li key={`step-${index}`}>{step}</li>
            ))}
          </ol>
        </section>

        {sections?.map((section) => (
          <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {section.paragraphs.map((paragraph, index) => (
                <p key={`${section.title}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Why use PDFNimbus for this</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <li key={`benefit-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {benefit}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Related tools</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-400 hover:bg-white hover:text-brand-700"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </section>

        {guidesToShow && guidesToShow.length > 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Related guides</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {guidesToShow.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-400 hover:bg-white hover:text-brand-700"
                >
                  {guide.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {faqItems && faqItems.length > 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
            <div className="mt-3 space-y-3">
              {faqItems.map((item, index) => (
                <article key={`faq-${index}`}>
                  <h3 className="text-sm font-semibold text-slate-900">{item.question}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-brand-200 bg-brand-50 p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Use this tool</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Ready to complete this task? Open the tool and run it directly in your browser.
          </p>
          <Link
            href={ctaHref}
            className="mt-3 inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {ctaLabel}
          </Link>
        </section>
      </article>
    </main>
  );
}
