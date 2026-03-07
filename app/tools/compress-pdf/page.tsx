import type { Metadata } from "next";
import { CompressPdfTool } from "@/components/tools/compress-pdf/compress-pdf-tool";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />
      <ActiveToolPageFrame
        currentToolHref="/tools/compress-pdf"
        title={{ en: "Compress PDF", es: "Comprimir PDF" }}
        subtitle={{
          en: "Reduce PDF file size fast and download an optimized version instantly.",
          es: "Reduce el tamano de tu PDF rapido y descarga una version optimizada al instante."
        }}
        howToTitle={{ en: "How to compress PDFs", es: "Como comprimir PDFs" }}
        howToText={{
          en: "Upload one PDF, pick a compression level, then download the optimized output.",
          es: "Sube un PDF, elige un nivel de compresion y descarga el resultado optimizado."
        }}
        faqItems={[
          {
            question: {
              en: "Is this Compress PDF tool free to use?",
              es: "Esta herramienta de comprimir PDF es gratis?"
            },
            answer: {
              en: "Yes. You can compress PDF files directly in your browser without an account.",
              es: "Si. Puedes comprimir PDFs en tu navegador sin cuenta."
            }
          },
          {
            question: {
              en: "Are my PDF files uploaded to a server?",
              es: "Mis PDFs se suben a un servidor?"
            },
            answer: {
              en: "For typical use, processing stays in your browser and files are not stored on our servers.",
              es: "Para uso normal, el procesamiento queda en tu navegador y no guardamos tus archivos."
            }
          },
          {
            question: {
              en: "Will file quality change after compression?",
              es: "La calidad cambia despues de comprimir?"
            },
            answer: {
              en: "It depends on the selected level. Recommended mode balances quality and size reduction.",
              es: "Depende del nivel elegido. El modo recomendado equilibra calidad y reduccion."
            }
          }
        ]}
      >
        <CompressPdfTool />
      </ActiveToolPageFrame>
    </>
  );
}
