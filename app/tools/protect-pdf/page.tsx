import type { Metadata } from "next";
import Link from "next/link";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "Protect PDF Online Free — PDFNimbus";
const toolDescription =
  "Protect PDF files with a password in a browser-first workflow. Free PDF protection tool with local processing for typical use.";

const faqItems = [
  {
    question: "Is this Protect PDF tool free?",
    answer: "Yes. You can use this browser-based protection workflow for free."
  },
  {
    question: "Are my files uploaded to a server?",
    answer: "For typical use, processing is browser-first and files are not stored on our servers."
  },
  {
    question: "Can I protect PDFs on mobile?",
    answer: "Yes, it works on modern mobile browsers, with desktop generally easier for larger files."
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
  name: "PDFNimbus Protect PDF",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  url: "https://pdfnimbus.vercel.app/tools/protect-pdf",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/protect-pdf"
});

export default function ProtectPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />
      <ActiveToolPageFrame
        currentToolHref="/tools/protect-pdf"
        title={{ en: "Protect PDF", es: "Proteger PDF" }}
        subtitle={{
          en: "Use this free browser-based tool to add password protection to PDF files before sharing.",
          es: "Usa esta herramienta browser-first gratuita para agregar contrasena a PDFs antes de compartirlos."
        }}
        howToTitle={{ en: "How to protect a PDF", es: "Como proteger un PDF" }}
        howToText={{
          en: "Upload your PDF, choose a password, and export a protected file.",
          es: "Sube tu PDF, define una contrasena y exporta un archivo protegido."
        }}
        introParagraphs={[
          {
            en: "This page is ready for password-protection workflow rollout with production-safe SEO architecture and internal linking.",
            es: "Esta pagina queda lista para el despliegue del flujo de proteccion por contrasena con arquitectura SEO e interlinking consistentes."
          }
        ]}
        relatedToolsTitle={{ en: "Related PDF tools", es: "Herramientas PDF relacionadas" }}
        relatedTools={[
          { href: "/tools/remove-pdf-pages", label: { en: "Remove PDF Pages", es: "Eliminar paginas PDF" } },
          { href: "/tools/merge-pdf", label: { en: "Merge PDF", es: "Unir PDF" } },
          { href: "/tools/compress-pdf", label: { en: "Compress PDF", es: "Comprimir PDF" } },
          { href: "/tools/split-pdf", label: { en: "Split PDF", es: "Dividir PDF" } }
        ]}
        relatedGuidesTitle={{ en: "Learn how to use this tool", es: "Aprende a usar esta herramienta" }}
        relatedGuides={[
          { href: "/guides/password-protect-pdf", label: { en: "How to Password Protect PDF", es: "Como proteger PDF con contrasena" } },
          { href: "/guides/protect-pdf-for-email", label: { en: "How to Protect PDF for Email", es: "Como proteger PDF para email" } },
          { href: "/guides/how-to-lock-a-pdf-file", label: { en: "How to Lock a PDF File", es: "Como bloquear un archivo PDF" } }
        ]}
        faqItems={faqItems.map((item) => ({
          question: { en: item.question, es: item.question },
          answer: { en: item.answer, es: item.answer }
        }))}
      >
        <section className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Upload and protection settings</h2>
          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
              Upload area placeholder: Protect PDF UI will appear here.
            </div>
            <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Password settings</h3>
              <p className="mt-2 text-sm text-slate-600">
                Settings placeholder: password input, confirm password, and protection options.
              </p>
            </aside>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Add a password layer before sharing sensitive PDFs via email or cloud links. This placeholder route provides
            indexable product coverage while tool UI logic is finalized.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/guides/password-protect-pdf" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">
              Guide: Password protect PDF
            </Link>
            <Link href="/guides/protect-pdf-for-email" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">
              Guide: Protect PDF for email
            </Link>
            <Link href="/guides/how-to-lock-a-pdf-file" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">
              Guide: How to lock a PDF file
            </Link>
          </div>
        </section>
      </ActiveToolPageFrame>
    </>
  );
}
