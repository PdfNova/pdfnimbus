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
  name: "PDFNimbus JPG to PDF",
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
        introParagraphs={[
          {
            en: "Convert JPG to PDF online by combining one or more images into a single document. This is ideal for scanned notes, receipts, forms, and photo-based reports.",
            es: "Convierte JPG a PDF online combinando una o varias imagenes en un solo documento. Es ideal para apuntes escaneados, recibos, formularios e informes con fotos."
          },
          {
            en: "You can review image cards, reorder pages visually, and export a clean PDF in a browser-first workflow for typical use.",
            es: "Puedes revisar tarjetas de imagen, reordenar paginas visualmente y exportar un PDF limpio con flujo browser-first para uso normal."
          }
        ]}
        benefitsTitle={{ en: "Why use this JPG to PDF tool", es: "Por que usar esta herramienta JPG a PDF" }}
        benefitsItems={[
          { en: "Supports multiple JPG or PNG images", es: "Soporta multiples imagenes JPG o PNG" },
          { en: "Visual card order before export", es: "Orden visual por tarjetas antes de exportar" },
          { en: "Single PDF output ready to share", es: "Salida en un solo PDF lista para compartir" },
          { en: "Browser-first local processing", es: "Procesamiento local browser-first" }
        ]}
        relatedToolsTitle={{ en: "Related conversion tools", es: "Herramientas de conversion relacionadas" }}
        relatedTools={[
          { href: "/tools/pdf-to-jpg", label: { en: "PDF to JPG", es: "PDF a JPG" } },
          { href: "/tools/merge-pdf", label: { en: "Merge PDF", es: "Unir PDF" } },
          { href: "/tools/compress-image", label: { en: "Compress Image", es: "Comprimir imagen" } }
        ]}
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
          },
          {
            question: {
              en: "Can I change image order before creating the PDF?",
              es: "Puedo cambiar el orden de imagenes antes de crear el PDF?"
            },
            answer: {
              en: "Yes. You can reorder image cards before generating the final PDF.",
              es: "Si. Puedes reordenar las tarjetas de imagen antes de generar el PDF final."
            }
          },
          {
            question: {
              en: "Does JPG to PDF work on mobile?",
              es: "JPG a PDF funciona en movil?"
            },
            answer: {
              en: "Yes, on modern mobile browsers, with smoother handling on desktop for bigger batches.",
              es: "Si, en navegadores moviles modernos, con manejo mas fluido en escritorio para lotes grandes."
            }
          }
        ]}
      >
        <JpgToPdfTool />
      </ActiveToolPageFrame>
    </>
  );
}

