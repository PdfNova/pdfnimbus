import type { Metadata } from "next";
import { PdfToJpgTool } from "@/components/tools/pdf-to-jpg/pdf-to-jpg-tool";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "PDF to JPG Online Free";
const toolDescription =
  "Convert PDF pages to JPG images instantly. Browser-first conversion with no uploads required for typical use.";

const faqItems = [
  {
    question: "Can I convert every page of my PDF to JPG?",
    answer: "Yes. Each PDF page is converted to a separate JPG file."
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
  name: "PDFNova PDF to JPG",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/pdf-to-jpg"
});

export default function PdfToJpgPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />
      <ActiveToolPageFrame
        currentToolHref="/tools/pdf-to-jpg"
        title={{ en: "PDF to JPG", es: "PDF a JPG" }}
        subtitle={{
          en: "Upload a PDF, convert each page to JPG in your browser, and download all images instantly.",
          es: "Sube un PDF, convierte cada pagina a JPG en tu navegador y descarga todas las imagenes."
        }}
        howToTitle={{ en: "How to convert PDF to JPG", es: "Como convertir PDF a JPG" }}
        howToText={{
          en: "Upload your PDF and export all pages as JPG files with one click.",
          es: "Sube tu PDF y exporta todas las paginas como archivos JPG con un clic."
        }}
        faqItems={[
          {
            question: {
              en: "Can I convert every page of my PDF to JPG?",
              es: "Puedo convertir cada pagina del PDF a JPG?"
            },
            answer: {
              en: "Yes. Each PDF page is exported as its own JPG file.",
              es: "Si. Cada pagina PDF se exporta como un archivo JPG separado."
            }
          },
          {
            question: {
              en: "Are my files uploaded to a server?",
              es: "Mis archivos se suben a un servidor?"
            },
            answer: {
              en: "For typical use, processing happens in your browser and files are not stored on our servers.",
              es: "Para uso normal, el procesamiento ocurre en tu navegador y no guardamos tus archivos."
            }
          }
        ]}
      >
        <PdfToJpgTool />
      </ActiveToolPageFrame>
    </>
  );
}
