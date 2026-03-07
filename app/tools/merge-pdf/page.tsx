import type { Metadata } from "next";
import { MergePdfTool } from "@/components/tools/merge-pdf/merge-pdf-tool";
import { PdfNovaToolsGrid } from "@/components/tools/shared/pdfnova-tools-grid";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "Merge PDF Files Online Free";
const toolDescription =
  "Combine multiple PDF files into one document instantly. Browser-first PDF merging with no uploads required.";

const faqItems = [
  {
    question: "Is this Merge PDF tool free to use?",
    answer: "Yes. You can merge PDF files in your browser without creating an account."
  },
  {
    question: "Are my files uploaded to a server?",
    answer:
      "For typical use, all processing happens directly in your browser. Your files are not uploaded, stored, or tracked on our servers."
  },
  {
    question: "Can I choose the order before merging?",
    answer:
      "Yes. Drag the PDF cards into the desired order before merging. The final merged document follows the visual order shown above."
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
  name: "PDFNova Merge PDF",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/merge-pdf"
});

export default function MergePdfPage() {
  return (
    <main className="mx-auto w-full max-w-[1300px] px-4 py-6 sm:px-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Merge PDF</h1>
        <p className="mt-2 max-w-3xl text-base text-slate-600 sm:text-lg">
          Upload PDFs, reorder files visually, and merge everything into one clean document in seconds.
        </p>
      </header>

      <PdfNovaToolsGrid currentToolHref="/tools/merge-pdf" />

      <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">How to merge PDFs</h2>
        <p className="mt-1 text-sm text-slate-600">Upload files, drag cards to set order, then merge and download the final PDF.</p>
      </section>

      <MergePdfTool />

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
