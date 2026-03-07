import type { Metadata } from "next";
import { SplitPdfTool } from "@/components/tools/split-pdf/split-pdf-tool";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "Split PDF Pages Online Free";
const toolDescription =
  "Split a PDF by pages, ranges, or groups and download exactly what you need in seconds.";

const faqItems = [
  {
    question: "Is this Split PDF tool free to use?",
    answer: "Yes. You can split PDF files in your browser without creating an account."
  },
  {
    question: "Are files uploaded to a server?",
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
  name: "PDFNova Split PDF",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/split-pdf"
});

export default function SplitPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />
      <ActiveToolPageFrame
        currentToolHref="/tools/split-pdf"
        title={{ en: "Split PDF", es: "Dividir PDF" }}
        subtitle={{
          en: "Upload one PDF, split by pages or ranges, and download the exact output you need.",
          es: "Sube un PDF, divide por paginas o rangos, y descarga solo lo que necesitas."
        }}
        howToTitle={{ en: "How to split PDFs", es: "Como dividir PDFs" }}
        howToText={{
          en: "Upload a PDF, choose split mode, then download one or multiple output files.",
          es: "Sube un PDF, elige el modo de division y descarga uno o varios archivos."
        }}
        faqItems={[
          {
            question: {
              en: "Is this Split PDF tool free to use?",
              es: "Esta herramienta de dividir PDF es gratis?"
            },
            answer: {
              en: "Yes. You can split PDF files in your browser without creating an account.",
              es: "Si. Puedes dividir PDFs en tu navegador sin crear cuenta."
            }
          },
          {
            question: {
              en: "Are files uploaded to a server?",
              es: "Los archivos se suben a un servidor?"
            },
            answer: {
              en: "For typical use, processing happens directly in your browser and files are not stored on our servers.",
              es: "Para uso normal, el procesamiento ocurre en tu navegador y no guardamos archivos en servidores."
            }
          }
        ]}
      >
        <SplitPdfTool />
      </ActiveToolPageFrame>
    </>
  );
}
