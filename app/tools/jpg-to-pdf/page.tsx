import type { Metadata } from "next";
import { JpgToPdfTool } from "@/components/tools/jpg-to-pdf/jpg-to-pdf-tool";
import { PdfNovaToolsGrid } from "@/components/tools/shared/pdfnova-tools-grid";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "JPG to PDF Online Free";
const toolDescription =
  "Convert JPG or PNG images into one PDF instantly. Browser-first processing with no uploads required for typical use.";

const faqItems = [
  {
    question: "Can I combine multiple images into one PDF?",
    answer: "Yes. Upload multiple JPG or PNG images and convert them into one PDF."
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
  name: "PDFNova JPG to PDF",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/jpg-to-pdf"
});

export default function JpgToPdfPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">JPG to PDF</h1>
        <p className="mt-2 max-w-3xl text-base text-slate-600 sm:text-lg">
          Upload JPG or PNG images, set the order, and generate one clean PDF in seconds.
        </p>
      </header>

      <PdfNovaToolsGrid currentToolHref="/tools/jpg-to-pdf" />

      <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">How to convert JPG to PDF</h2>
        <p className="mt-1 text-sm text-slate-600">Upload images, set order, and convert them into one PDF file.</p>
      </section>

      <JpgToPdfTool />

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
