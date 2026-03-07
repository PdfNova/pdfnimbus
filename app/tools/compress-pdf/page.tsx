import type { Metadata } from "next";
import { CompressPdfTool } from "@/components/tools/compress-pdf/compress-pdf-tool";
import { PdfNovaToolsGrid } from "@/components/tools/shared/pdfnova-tools-grid";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "Compress PDF Files Online Free";
const toolDescription =
  "Reduce PDF file size instantly. Browser-first compression with no uploads required for typical use.";

const faqItems = [
  {
    question: "Is this Compress PDF tool free to use?",
    answer:
      "Yes. You can compress PDF files for free directly in your browser without creating an account."
  },
  {
    question: "Are my PDF files uploaded to a server?",
    answer:
      "For typical use, all processing happens directly in your browser. Your files are not uploaded, stored, or tracked on our servers."
  },
  {
    question: "Will file quality change after compression?",
    answer:
      "Quality impact depends on the selected compression level. Recommended mode balances quality and size reduction."
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
  name: "PDFNova Compress PDF",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/compress-pdf"
});

export default function CompressPdfPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Compress PDF</h1>
        <p className="mt-2 max-w-3xl text-base text-slate-600 sm:text-lg">
          Reduce PDF file size quickly and download an optimized version instantly.
        </p>
      </header>

      <PdfNovaToolsGrid currentToolHref="/tools/compress-pdf" />

      <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">How to compress PDFs</h2>
        <p className="mt-1 text-sm text-slate-600">Upload one PDF, choose a compression level, then download the optimized file.</p>
      </section>

      <CompressPdfTool />

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
