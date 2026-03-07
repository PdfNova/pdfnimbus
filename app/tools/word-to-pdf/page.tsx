import type { Metadata } from "next";
import Link from "next/link";
import { WordToPdfTool } from "@/components/tools/word-to-pdf/word-to-pdf-tool";

const faqItems = [
  {
    question: "Is this Word to PDF tool free to use?",
    answer: "Yes. This tool follows the same browser-first architecture as the other PDF tools."
  },
  {
    question: "Are my files uploaded to a server?",
    answer: "For typical usage, files are handled in your browser for privacy."
  }
];

export const metadata: Metadata = {
  title: "Word to PDF Online",
  description: "Convert Word files to PDF format."
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Word to PDF Online</h1>
        <p className="mt-3 max-w-3xl text-base text-slate-600 sm:text-lg">
          Convert Word files to PDF format.
        </p>
      </header>

      <WordToPdfTool />

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">FAQ</h2>
        <div className="mt-5 space-y-5">
          {faqItems.map((item) => (
            <article key={item.question}>
              <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Related tools</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link href="/tools/merge-pdf" className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">Merge PDF</Link>
          <Link href="/tools/compress-pdf" className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">Compress PDF</Link>
          <Link href="/tools/split-pdf" className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">Split PDF</Link>
          <Link href="/tools/pdf-to-jpg" className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">PDF to JPG</Link>
        </div>
      </section>
    </main>
  );
}

