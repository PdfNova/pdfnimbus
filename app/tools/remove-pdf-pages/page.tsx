import type { Metadata } from "next";
import Link from "next/link";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "Remove PDF Pages Online Free — PDFNimbus";
const toolDescription =
  "Remove pages from a PDF quickly with a browser-first workflow. Free PDF page remover with local processing for typical use.";

const faqItems = [
  {
    question: "Is this Remove PDF Pages tool free?",
    answer: "Yes. You can remove pages from PDFs for free in your browser."
  },
  {
    question: "Are files uploaded to a server?",
    answer: "For typical use, processing is browser-first and files are not stored on our servers."
  },
  {
    question: "Can I use this on mobile?",
    answer: "Yes, it works on modern mobile browsers, with desktop generally easier for larger PDFs."
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
  name: "PDFNimbus Remove PDF Pages",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  url: "https://pdfnimbus.vercel.app/tools/remove-pdf-pages",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/remove-pdf-pages"
});

export default function RemovePdfPagesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />
      <ActiveToolPageFrame
        currentToolHref="/tools/remove-pdf-pages"
        title={{ en: "Remove PDF Pages", es: "Eliminar paginas PDF" }}
        subtitle={{
          en: "Use this free browser-based tool to remove unwanted pages from a PDF before downloading the updated file.",
          es: "Usa esta herramienta browser-first gratuita para eliminar paginas no deseadas de un PDF y descargar el resultado."
        }}
        howToTitle={{ en: "How to remove pages from a PDF", es: "Como eliminar paginas de un PDF" }}
        howToText={{
          en: "Upload your PDF, choose the pages to remove, then export the updated document.",
          es: "Sube tu PDF, elige las paginas a eliminar y exporta el documento actualizado."
        }}
        introParagraphs={[
          {
            en: "This page is ready for the Remove PDF Pages workflow with product messaging, indexing, and navigation support.",
            es: "Esta pagina esta preparada para el flujo de Eliminar paginas PDF con soporte de mensaje, indexacion y navegacion."
          }
        ]}
        relatedToolsTitle={{ en: "Related PDF tools", es: "Herramientas PDF relacionadas" }}
        relatedTools={[
          { href: "/tools/split-pdf", label: { en: "Split PDF", es: "Dividir PDF" } },
          { href: "/tools/merge-pdf", label: { en: "Merge PDF", es: "Unir PDF" } },
          { href: "/tools/compress-pdf", label: { en: "Compress PDF", es: "Comprimir PDF" } }
        ]}
        relatedGuidesTitle={{ en: "Learn how to use this tool", es: "Aprende a usar esta herramienta" }}
        relatedGuides={[
          {
            href: "/guides/remove-pages-from-pdf",
            label: { en: "How to Remove Pages from PDF", es: "Como eliminar paginas de un PDF" }
          }
        ]}
        faqItems={faqItems.map((item) => ({
          question: { en: item.question, es: item.question },
          answer: { en: item.answer, es: item.answer }
        }))}
      >
        <section className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Upload area</h2>
          <div className="mt-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
            Upload placeholder: PDF page-removal UI will appear here.
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Remove selected pages from your PDF, then download the updated file. This placeholder keeps route, SEO,
            and internal-link coverage ready while tool UI is finalized.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/guides/remove-pages-from-pdf" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">
              Guide: Remove pages from PDF
            </Link>
            <Link href="/tools/split-pdf" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">
              Split PDF
            </Link>
            <Link href="/tools/merge-pdf" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">
              Merge PDF
            </Link>
          </div>
        </section>
      </ActiveToolPageFrame>
    </>
  );
}
