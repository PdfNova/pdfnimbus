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
  name: "PDFNimbus Split PDF",
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
        introParagraphs={[
          {
            en: "Split PDF pages online when you only need part of a document. Choose all pages, selected pages, custom ranges, or every-N mode depending on your workflow.",
            es: "Divide paginas PDF online cuando solo necesitas una parte del documento. Elige todas las paginas, paginas seleccionadas, rangos personalizados o modo cada-N segun tu flujo."
          },
          {
            en: "Visual thumbnails and range controls help you confirm output before download, with browser-first processing for typical tasks.",
            es: "Las miniaturas visuales y controles de rango te ayudan a confirmar la salida antes de descargar, con procesamiento browser-first para tareas normales."
          }
        ]}
        benefitsTitle={{ en: "Why use this Split PDF tool", es: "Por que usar esta herramienta de dividir PDF" }}
        benefitsItems={[
          { en: "Multiple split modes in one tool", es: "Varios modos de division en una sola herramienta" },
          { en: "Page thumbnail selection for precision", es: "Seleccion por miniaturas para mayor precision" },
          { en: "Custom ranges with validation", es: "Rangos personalizados con validacion" },
          { en: "Fast browser-first output", es: "Salida rapida browser-first" }
        ]}
        relatedToolsTitle={{ en: "Related PDF tools", es: "Herramientas PDF relacionadas" }}
        relatedTools={[
          { href: "/tools/merge-pdf", label: { en: "Merge PDF", es: "Unir PDF" } },
          { href: "/tools/rotate-pdf", label: { en: "Rotate PDF", es: "Rotar PDF" } },
          { href: "/tools/compress-pdf", label: { en: "Compress PDF", es: "Comprimir PDF" } }
        ]}
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
          },
          {
            question: {
              en: "Can I split by custom page ranges?",
              es: "Puedo dividir por rangos de pagina personalizados?"
            },
            answer: {
              en: "Yes. You can define one or more ranges and export them separately or combined.",
              es: "Si. Puedes definir uno o varios rangos y exportarlos por separado o combinados."
            }
          },
          {
            question: {
              en: "Does it work on mobile browsers?",
              es: "Funciona en navegadores moviles?"
            },
            answer: {
              en: "Yes, though page-heavy files are generally easier to handle on desktop.",
              es: "Si, aunque archivos con muchas paginas suelen manejarse mejor en escritorio."
            }
          }
        ]}
      >
        <SplitPdfTool />
      </ActiveToolPageFrame>
    </>
  );
}

