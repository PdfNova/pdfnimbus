import type { Metadata } from "next";
import { RotatePdfTool } from "@/components/tools/rotate-pdf/rotate-pdf-tool";
import { PdfNovaToolsGrid } from "@/components/tools/shared/pdfnova-tools-grid";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "Rotate PDF Online Free";
const toolDescription =
  "Rotate PDF pages online with live preview and download the updated file instantly.";

const faqItems = [
  {
    question: "Is this Rotate PDF tool free to use?",
    answer: "Yes. This tool follows the same browser-first architecture as the other PDF tools."
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
  name: "PDFNova Rotate PDF",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/rotate-pdf"
});

export default function RotatePdfPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Rotate PDF</h1>
        <p className="mt-2 max-w-3xl text-base text-slate-600 sm:text-lg">
          Rotate PDF pages clockwise, preview the result live, and download the updated file instantly.
        </p>
      </header>

      <PdfNovaToolsGrid currentToolHref="/tools/rotate-pdf" />

      <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">How to rotate PDFs</h2>
        <p className="mt-1 text-sm text-slate-600">Upload your PDF, set the rotation angle, preview changes live, then download.</p>
      </section>

      <RotatePdfTool />

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
