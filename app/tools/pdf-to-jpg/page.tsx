import type { Metadata } from "next";
import { PdfToJpgTool } from "@/components/tools/pdf-to-jpg/pdf-to-jpg-tool";
import { PdfNovaToolsGrid } from "@/components/tools/shared/pdfnova-tools-grid";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "PDF to JPG Online Free";
const toolDescription =
  "Convert PDF pages to JPG images instantly. Browser-first conversion with no uploads required for typical use.";

const faqItems = [
  {
    question: "Can I convert every page of my PDF to JPG?",
    answer: "Yes. Each PDF page is converted to a separate JPG file."
  },
  {
    question: "Are my files uploaded to a server?",
    answer:
      "For typical use, all processing happens directly in your browser. Your files are not uploaded, stored, or tracked on our servers."
  }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  }))
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PDFNova PDF to JPG",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/pdf-to-jpg"
});

export default function PdfToJpgPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">PDF to JPG</h1>
        <p className="mt-2 max-w-3xl text-base text-slate-600 sm:text-lg">
          Upload a PDF, convert each page to JPG in your browser, and download all images instantly.
        </p>
      </header>

      <PdfNovaToolsGrid currentToolHref="/tools/pdf-to-jpg" />

      <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">How to convert PDF to JPG</h2>
        <p className="mt-1 text-sm text-slate-600">Upload your PDF and export all pages as JPG files with one click.</p>
      </section>

      <PdfToJpgTool />

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
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
    </main>
  );
}
