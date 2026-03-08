import type { Metadata } from "next";
import { PdfToJpgTool } from "@/components/tools/pdf-to-jpg/pdf-to-jpg-tool";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "PDF to JPG Online Free — PDFNimbus";
const toolDescription =
  "Convert PDF pages to high-quality JPG images in seconds. Free browser-based converter with local processing for typical use.";

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
  name: "PDFNimbus PDF to JPG",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  url: "https://pdfnimbus.vercel.app/tools/pdf-to-jpg",
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
        introParagraphs={[
          {
            en: "Convert PDF to JPG online when you need image files for slides, social media, previews, or design workflows. Each page can be exported as a separate JPG for flexible reuse.",
            es: "Convierte PDF a JPG online cuando necesites imagenes para presentaciones, redes, previsualizaciones o flujos de diseno. Cada pagina puede exportarse como JPG separado para mayor flexibilidad."
          },
          {
            en: "The tool runs in a browser-first flow for typical use, with clear download options for single files or multi-page outputs.",
            es: "La herramienta funciona con flujo browser-first para uso normal, con opciones claras de descarga para salida unica o multipagina."
          }
        ]}
        benefitsTitle={{ en: "Why use this PDF to JPG converter", es: "Por que usar este convertidor PDF a JPG" }}
        benefitsItems={[
          { en: "One JPG per PDF page", es: "Un JPG por cada pagina PDF" },
          { en: "Clear single or ZIP download flow", es: "Flujo claro de descarga individual o ZIP" },
          { en: "Preview and page count before conversion", es: "Vista previa y total de paginas antes de convertir" },
          { en: "Browser-first processing for typical use", es: "Procesamiento browser-first para uso normal" }
        ]}
        relatedToolsTitle={{ en: "Related conversion tools", es: "Herramientas de conversion relacionadas" }}
        relatedTools={[
          { href: "/tools/jpg-to-pdf", label: { en: "JPG to PDF", es: "JPG a PDF" } },
          { href: "/tools/compress-image", label: { en: "Compress Image", es: "Comprimir imagen" } },
          { href: "/tools/merge-pdf", label: { en: "Merge PDF", es: "Unir PDF" } }
        ]}
        relatedGuidesTitle={{ en: "Learn how to use this tool", es: "Aprende a usar esta herramienta" }}
        relatedGuides={[
          { href: "/guides/pdf-pages-to-jpg", label: { en: "How to Convert PDF Pages to JPG Images", es: "Como convertir paginas PDF a JPG" } }
        ]}
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
          },
          {
            question: {
              en: "Can I download all pages at once?",
              es: "Puedo descargar todas las paginas a la vez?"
            },
            answer: {
              en: "Yes. When multiple JPG files are generated, you can download them together as a ZIP.",
              es: "Si. Cuando se generan varios JPG, puedes descargarlos juntos como ZIP."
            }
          },
          {
            question: {
              en: "Does it work on mobile browsers?",
              es: "Funciona en navegadores moviles?"
            },
            answer: {
              en: "Yes, on modern mobile browsers, with faster handling on desktop for larger files.",
              es: "Si, en navegadores moviles modernos, con procesamiento mas comodo en escritorio para archivos grandes."
            }
          }
        ]}
      >
        <PdfToJpgTool />
      </ActiveToolPageFrame>
    </>
  );
}

