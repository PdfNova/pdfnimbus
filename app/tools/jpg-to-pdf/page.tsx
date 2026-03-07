import type { Metadata } from "next";
import { JpgToPdfTool } from "@/components/tools/jpg-to-pdf/jpg-to-pdf-tool";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "JPG to PDF Online Free";
const toolDescription =
  "Convert JPG or PNG images into one PDF instantly. Browser-first processing with no uploads required for typical use.";

const faqItems = [
  {
    question: "Can I combine multiple images into one PDF?",
    answer: "Yes. Upload multiple JPG or PNG images and convert them into one PDF."
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
  name: "PDFNova JPG to PDF",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/jpg-to-pdf"
});

export default function JpgToPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />
      <ActiveToolPageFrame
        currentToolHref="/tools/jpg-to-pdf"
        title={{ en: "JPG to PDF", es: "JPG a PDF" }}
        subtitle={{
          en: "Upload JPG or PNG images, set order, and generate one clean PDF in seconds.",
          es: "Sube imagenes JPG o PNG, define el orden y genera un PDF limpio en segundos."
        }}
        howToTitle={{ en: "How to convert JPG to PDF", es: "Como convertir JPG a PDF" }}
        howToText={{
          en: "Upload images, set order, and convert them into one PDF file.",
          es: "Sube imagenes, ajusta el orden y conviertelas en un solo PDF."
        }}
        faqItems={[
          {
            question: {
              en: "Can I combine multiple images into one PDF?",
              es: "Puedo combinar varias imagenes en un PDF?"
            },
            answer: {
              en: "Yes. Upload multiple JPG or PNG images and convert them into one PDF.",
              es: "Si. Sube varias imagenes JPG o PNG y conviertelas en un PDF."
            }
          },
          {
            question: {
              en: "Are my files uploaded to a server?",
              es: "Mis archivos se suben a un servidor?"
            },
            answer: {
              en: "For typical use, processing happens in your browser and files are not stored on our servers.",
              es: "Para uso normal, el procesamiento ocurre en tu navegador y no guardamos archivos en servidores."
            }
          }
        ]}
      >
        <JpgToPdfTool />
      </ActiveToolPageFrame>
    </>
  );
}
