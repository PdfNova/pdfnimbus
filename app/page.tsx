import Link from "next/link";
import { toolRegistry } from "@/lib/tools-registry";

const activeTools = toolRegistry.filter((tool) => tool.active);

const popularOrder = [
  "/tools/merge-pdf",
  "/tools/compress-pdf",
  "/tools/split-pdf",
  "/tools/pdf-to-jpg",
  "/tools/jpg-to-pdf"
] as const;

const popularTools = popularOrder
  .map((href) => activeTools.find((tool) => tool.href === href))
  .filter((tool): tool is (typeof activeTools)[number] => Boolean(tool));

const whyCards = [
  {
    title: "Browser-first processing",
    description: "Your files are handled locally in your browser for typical workflows.",
    icon: "🧠"
  },
  {
    title: "No uploads",
    description: "No mandatory server upload step for standard operations.",
    icon: "🚫"
  },
  {
    title: "Fast processing",
    description: "Compact interfaces and optimized browser pipelines keep actions quick.",
    icon: "⚡"
  },
  {
    title: "Privacy-first",
    description: "Your documents stay under your control during processing and download.",
    icon: "🔒"
  }
] as const;

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-[1300px] px-4 py-6 sm:px-6 sm:py-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          All your PDF tools in one place
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
          Merge, compress, split, and convert PDFs directly in your browser.
        </p>

        <div className="mt-5">
          <Link
            href="/tools"
            className="inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Choose a tool
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">Popular tools</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {popularTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800"
            >
              <span className="mr-1.5">{tool.icon}</span>
              {tool.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">Why PDFNova</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {whyCards.map((card) => (
            <article key={card.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-lg">{card.icon}</p>
              <h3 className="mt-2 text-sm font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-1 text-xs text-slate-600">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="tools" className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">All tools</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800"
            >
              <span className="mr-1.5">{tool.icon}</span>
              {tool.label}
              <p className="mt-1 text-xs font-normal text-slate-600">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">Secure. Private. Under your control.</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">🔒 SSL encryption</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">✅ GDPR compliant</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">🧠 Browser processing</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">🚫 No storage</div>
        </div>
      </section>
    </main>
  );
}
