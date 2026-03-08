import type { Metadata } from "next";
import { PdfToWordTool } from "@/components/tools/pdf-to-word/pdf-to-word-tool";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "PDF to Word Online - PDFNimbus";
const toolDescription =
  "Convert PDF documents into editable Word files with PDFNimbus and review the workflow, FAQs, and related guides before you start.";

const faqItems = [
  {
    question: "What kind of PDF works best for PDF to Word?",
    answer: "Text-based PDFs usually give the cleanest editable output. Scanned pages may need extra cleanup after conversion."
  },
  {
    question: "Can I edit the exported file after conversion?",
    answer: "Yes. The goal of PDF to Word is to produce a document you can continue editing in Word-compatible software."
  },
  {
    question: "Will the layout stay identical?",
    answer: "Headings, paragraphs, tables, and basic layout can usually be carried over, but you should still review spacing, fonts, and page breaks."
  },
  {
    question: "How does PDFNimbus handle privacy for this workflow?",
    answer: "PDFNimbus is designed around privacy-conscious browser workflows for typical tasks, with Office conversion guidance published as part of this Phase 1 rollout."
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
  name: "PDFNimbus PDF to Word",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  url: "https://pdfnimbus.vercel.app/tools/pdf-to-word",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/pdf-to-word"
});

export default function PdfToWordPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />
      <ActiveToolPageFrame
        currentToolHref="/tools/pdf-to-word"
        title={{ en: "PDF to Word", es: "PDF a Word" }}
        subtitle={{
          en: "Turn PDF files into editable Word documents and review the workflow before you convert.",
          es: "Convierte archivos PDF en documentos Word editables y revisa el flujo antes de convertir."
        }}
        howToTitle={{ en: "How PDF to Word works", es: "Como funciona PDF a Word" }}
        howToText={{
          en: "Start with a PDF, prepare it for editable output, and export a Word file that you can keep refining.",
          es: "Comienza con un PDF, preparalo para salida editable y exporta un archivo Word para seguir ajustandolo."
        }}
        introParagraphs={[
          {
            en: "PDF to Word is useful when you need to revise contracts, update proposals, extract copy from reports, or reuse content from a document that is currently locked into PDF format.",
            es: "PDF a Word es util cuando necesitas revisar contratos, actualizar propuestas, extraer texto de informes o reutilizar contenido que hoy esta bloqueado en formato PDF."
          },
          {
            en: "The typical workflow starts with a text-based PDF, maps the document structure into an editable format, and then exports a Word file so you can continue editing headings, paragraphs, and tables.",
            es: "El flujo habitual empieza con un PDF basado en texto, adapta la estructura del documento a un formato editable y despues exporta un archivo Word para seguir editando titulos, parrafos y tablas."
          }
        ]}
        benefitsTitle={{ en: "Why use this PDF to Word page", es: "Por que usar esta pagina PDF a Word" }}
        benefitsItems={[
          { en: "Focused on editable document workflows", es: "Enfoque en flujos de documento editable" },
          { en: "Clear expectations before conversion starts", es: "Expectativas claras antes de iniciar la conversion" },
          { en: "Useful for contracts, forms, and reports", es: "Util para contratos, formularios e informes" },
          { en: "Linked directly to Office conversion guides", es: "Enlazada directamente con guias de conversion Office" }
        ]}
        relatedToolsTitle={{ en: "Related document tools", es: "Herramientas de documentos relacionadas" }}
        relatedTools={[
          { href: "/tools/word-to-pdf", label: { en: "Word to PDF", es: "Word a PDF" } },
          { href: "/tools/merge-pdf", label: { en: "Merge PDF", es: "Unir PDF" } },
          { href: "/tools/compress-pdf", label: { en: "Compress PDF", es: "Comprimir PDF" } }
        ]}
        relatedGuidesTitle={{ en: "Related guides", es: "Guias relacionadas" }}
        relatedGuides={[
          { href: "/guides/pdf-to-word", label: { en: "How to Convert PDF to Word with PDFNimbus", es: "Como convertir PDF a Word con PDFNimbus" } },
          { href: "/guides/convert-pdf-to-word", label: { en: "Convert PDF to Word Online", es: "Convertir PDF a Word online" } }
        ]}
        faqItems={faqItems.map((item) => ({
          question: { en: item.question, es: item.question },
          answer: { en: item.answer, es: item.answer }
        }))}
      >
        <PdfToWordTool />
      </ActiveToolPageFrame>
    </>
  );
}
