import type { Metadata } from "next";
import { RotatePdfTool } from "@/components/tools/rotate-pdf/rotate-pdf-tool";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "Rotate PDF Online Free";
const toolDescription =
  "Rotate PDF pages online with live preview and download the updated file instantly.";

const faqItems = [
  {
    question: "Is this Rotate PDF tool free to use?",
    answer: "Yes. This tool follows the same browser-first architecture as the other PDF tools."
  },
  {
    question: "Are my files uploaded to a server?",
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
  name: "PDFNova Rotate PDF",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/rotate-pdf"
});

export default function RotatePdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />
      <ActiveToolPageFrame
        currentToolHref="/tools/rotate-pdf"
        title={{ en: "Rotate PDF", es: "Rotar PDF" }}
        subtitle={{
          en: "Rotate PDF pages clockwise, preview changes live, and download the updated file instantly.",
          es: "Rota paginas PDF, revisa la vista previa en vivo y descarga el archivo actualizado."
        }}
        howToTitle={{ en: "How to rotate PDFs", es: "Como rotar PDFs" }}
        howToText={{
          en: "Upload a PDF, choose rotation angle, preview updates, then download.",
          es: "Sube un PDF, elige el angulo, revisa cambios y descarga."
        }}
        faqItems={[
          {
            question: {
              en: "Is this Rotate PDF tool free to use?",
              es: "Esta herramienta de rotar PDF es gratis?"
            },
            answer: {
              en: "Yes. It uses the same browser-first architecture as the other PDF tools.",
              es: "Si. Usa la misma arquitectura en navegador que el resto de herramientas PDF."
            }
          },
          {
            question: {
              en: "Are my files uploaded to a server?",
              es: "Mis archivos se suben a un servidor?"
            },
            answer: {
              en: "For typical use, processing stays in your browser and files are not stored on our servers.",
              es: "Para uso normal, el procesamiento queda en tu navegador y no guardamos archivos en servidores."
            }
          }
        ]}
      >
        <RotatePdfTool />
      </ActiveToolPageFrame>
    </>
  );
}
