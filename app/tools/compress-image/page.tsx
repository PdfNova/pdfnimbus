import type { Metadata } from "next";
import { CompressImageTool } from "@/components/tools/compress-image/compress-image-tool";
import { PdfNovaToolsGrid } from "@/components/tools/shared/pdfnova-tools-grid";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "Compress Image Online Free";
const toolDescription =
  "Compress multiple images in your browser with low, recommended, or extreme settings and download optimized files.";

const faqItems = [
  {
    question: "Can I compress multiple images at once?",
    answer: "Yes. Upload multiple images and compress them in a single batch."
  },
  {
    question: "How can I download results?",
    answer: "Single image downloads directly. Multiple images are downloaded as a ZIP file."
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
  name: "PDFNova Compress Image",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/compress-image"
});

export default function CompressImagePage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Compress Image</h1>
        <p className="mt-2 max-w-3xl text-base text-slate-600 sm:text-lg">
          Reduce image file size with browser-first compression and keep quality under control.
        </p>
      </header>

      <PdfNovaToolsGrid currentToolHref="/tools/compress-image" />

      <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">How to compress images</h2>
        <p className="mt-1 text-sm text-slate-600">Upload images, pick a compression level, then download optimized output.</p>
      </section>

      <CompressImageTool />

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
