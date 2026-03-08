import type { Metadata } from "next";
import { CompressPdfTool } from "@/components/tools/compress-pdf/compress-pdf-tool";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "Compress PDF Online Free — PDFNimbus";
const toolDescription =
  "Compress PDF files fast while keeping readable quality. Free browser-based compressor with local processing for typical use.";

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
  name: "PDFNimbus Compress PDF",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  url: "https://pdfnimbus.vercel.app/tools/compress-pdf",
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
        introParagraphs={[
          {
            en: "Compress PDF online to reduce file size for email, messaging, and uploads without switching apps. Upload one file, choose your compression level, and download the optimized result in seconds.",
            es: "Comprime PDF online para reducir peso y compartir por email, mensajeria o subidas sin cambiar de app. Sube un archivo, elige nivel de compresion y descarga el resultado optimizado en segundos."
          },
          {
            en: "For typical use, processing stays browser-first so you keep control of your documents while balancing quality and size.",
            es: "Para uso normal, el procesamiento es browser-first para mantener control de tus documentos mientras equilibras calidad y tamano."
          }
        ]}
        benefitsTitle={{ en: "Why use this Compress PDF tool", es: "Por que usar esta herramienta de comprimir PDF" }}
        benefitsItems={[
          { en: "Visible before/after size impact", es: "Impacto de tamano visible antes/despues" },
          { en: "Compression levels for different needs", es: "Niveles de compresion para diferentes necesidades" },
          { en: "Direct optimized PDF download", es: "Descarga directa del PDF optimizado" },
          { en: "Browser-first workflow for normal use", es: "Flujo browser-first para uso normal" }
        ]}
        relatedToolsTitle={{ en: "Related PDF tools", es: "Herramientas PDF relacionadas" }}
        relatedTools={[
          { href: "/tools/merge-pdf", label: { en: "Merge PDF", es: "Unir PDF" } },
          { href: "/tools/split-pdf", label: { en: "Split PDF", es: "Dividir PDF" } },
          { href: "/tools/pdf-to-jpg", label: { en: "PDF to JPG", es: "PDF a JPG" } }
        ]}
        relatedGuidesTitle={{ en: "Learn how to use this tool", es: "Aprende a usar esta herramienta" }}
        relatedGuides={[
          { href: "/guides/compress-pdf-without-losing-quality", label: { en: "How to Compress PDF Without Losing Quality", es: "Como comprimir PDF sin perder calidad" } }
        ]}
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
          },
          {
            question: {
              en: "Can I compress PDF files on mobile?",
              es: "Puedo comprimir PDF en movil?"
            },
            answer: {
              en: "Yes, the tool works on modern mobile browsers, with better performance on desktop for large files.",
              es: "Si, funciona en navegadores moviles modernos, con mejor rendimiento en escritorio para archivos grandes."
            }
          }
        ]}
      >
        <CompressPdfTool />
      </ActiveToolPageFrame>
    </>
  );
}

