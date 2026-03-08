import type { Metadata } from "next";
import { WordToPdfTool } from "@/components/tools/word-to-pdf/word-to-pdf-tool";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "Word to PDF Online - PDFNimbus";
const toolDescription =
  "Convert Word files into polished PDF documents with PDFNimbus and review the workflow, FAQs, and related guides before export.";

const faqItems = [
  {
    question: "Why convert Word to PDF?",
    answer: "PDF is easier to share when you want stable formatting for resumes, contracts, proposals, invoices, or final review copies."
  },
  {
    question: "What files are typically used with Word to PDF?",
    answer: "DOC and DOCX files are the standard inputs for this workflow."
  },
  {
    question: "Will fonts and layout stay consistent in the PDF?",
    answer: "That is the goal of Word to PDF, but it is still worth checking page breaks, embedded fonts, and image placement before sending the file."
  },
  {
    question: "How does PDFNimbus approach privacy here?",
    answer: "PDFNimbus keeps a privacy-conscious, browser-first posture across typical file workflows while the Office conversion cluster is expanded."
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
  name: "PDFNimbus Word to PDF",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  url: "https://pdfnimbus.vercel.app/tools/word-to-pdf",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/word-to-pdf"
});

export default function WordToPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />
      <ActiveToolPageFrame
        currentToolHref="/tools/word-to-pdf"
        title={{ en: "Word to PDF", es: "Word a PDF" }}
        subtitle={{
          en: "Convert DOC or DOCX files into shareable PDFs with a workflow built for clean final output.",
          es: "Convierte archivos DOC o DOCX en PDFs listos para compartir con un flujo pensado para salida final limpia."
        }}
        howToTitle={{ en: "How Word to PDF works", es: "Como funciona Word a PDF" }}
        howToText={{
          en: "Upload a Word file, prepare it for final formatting, and export a PDF version for sharing or signing.",
          es: "Sube un archivo Word, preparalo para formato final y exporta una version PDF para compartir o firmar."
        }}
        introParagraphs={[
          {
            en: "Word to PDF is the standard workflow when you need a stable final document for clients, hiring managers, legal review, or any handoff where layout should not shift from one device to another.",
            es: "Word a PDF es el flujo estandar cuando necesitas un documento final estable para clientes, seleccion de personal, revision legal o cualquier entrega donde el formato no debe cambiar entre dispositivos."
          },
          {
            en: "The process starts with a DOC or DOCX file, preserves as much structure as possible, and produces a PDF that is easier to print, archive, review, or attach to email.",
            es: "El proceso empieza con un archivo DOC o DOCX, conserva la mayor parte de la estructura posible y produce un PDF mas facil de imprimir, archivar, revisar o adjuntar por correo."
          }
        ]}
        benefitsTitle={{ en: "Why use this Word to PDF page", es: "Por que usar esta pagina Word a PDF" }}
        benefitsItems={[
          { en: "Designed for final-share document output", es: "Disenado para salida final de documentos compartibles" },
          { en: "Clear use cases for resumes, proposals, and forms", es: "Casos claros para CV, propuestas y formularios" },
          { en: "Pairs directly with the reverse PDF to Word workflow", es: "Se complementa directamente con el flujo inverso PDF a Word" },
          { en: "Connected to Office conversion guides and FAQs", es: "Conectado con guias Office y preguntas frecuentes" }
        ]}
        relatedToolsTitle={{ en: "Related document tools", es: "Herramientas de documentos relacionadas" }}
        relatedTools={[
          { href: "/tools/pdf-to-word", label: { en: "PDF to Word", es: "PDF a Word" } },
          { href: "/tools/merge-pdf", label: { en: "Merge PDF", es: "Unir PDF" } },
          { href: "/tools/compress-pdf", label: { en: "Compress PDF", es: "Comprimir PDF" } }
        ]}
        relatedGuidesTitle={{ en: "Related guides", es: "Guias relacionadas" }}
        relatedGuides={[
          { href: "/guides/word-to-pdf", label: { en: "How to Convert Word to PDF with PDFNimbus", es: "Como convertir Word a PDF con PDFNimbus" } },
          { href: "/guides/convert-word-to-pdf", label: { en: "Convert Word to PDF Online", es: "Convertir Word a PDF online" } }
        ]}
        faqItems={faqItems.map((item) => ({
          question: { en: item.question, es: item.question },
          answer: { en: item.answer, es: item.answer }
        }))}
      >
        <WordToPdfTool />
      </ActiveToolPageFrame>
    </>
  );
}
