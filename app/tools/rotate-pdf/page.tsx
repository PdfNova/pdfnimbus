import type { Metadata } from "next";
import { RotatePdfTool } from "@/components/tools/rotate-pdf/rotate-pdf-tool";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "Rotate PDF Online Free — PDFNimbus";
const toolDescription =
  "Rotate PDF pages with live visual preview and download instantly. Free browser-based rotation with local processing for typical use.";

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
  name: "PDFNimbus Rotate PDF",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  url: "https://pdfnimbus.vercel.app/tools/rotate-pdf",
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
        introParagraphs={[
          {
            en: "Rotate PDF pages online with visual control before export. You can adjust orientation per page or apply a global rotation step to all pages quickly.",
            es: "Rota paginas PDF online con control visual antes de exportar. Puedes ajustar la orientacion por pagina o aplicar un giro global a todas las paginas rapidamente."
          },
          {
            en: "This browser-first workflow is useful for scanned documents, sideways pages, and mixed-orientation files where readability matters.",
            es: "Este flujo browser-first es util para documentos escaneados, paginas laterales y archivos con orientaciones mixtas donde la legibilidad importa."
          }
        ]}
        benefitsTitle={{ en: "Why use this Rotate PDF tool", es: "Por que usar esta herramienta de rotar PDF" }}
        benefitsItems={[
          { en: "Per-page visual rotation controls", es: "Controles visuales de rotacion por pagina" },
          { en: "Global rotate-all and reset actions", es: "Acciones globales de rotar todo y restablecer" },
          { en: "Preview-first workflow before download", es: "Flujo con vista previa antes de descargar" },
          { en: "Browser-first document handling", es: "Gestion de documentos browser-first" }
        ]}
        relatedToolsTitle={{ en: "Related PDF tools", es: "Herramientas PDF relacionadas" }}
        relatedTools={[
          { href: "/tools/split-pdf", label: { en: "Split PDF", es: "Dividir PDF" } },
          { href: "/tools/merge-pdf", label: { en: "Merge PDF", es: "Unir PDF" } },
          { href: "/tools/compress-pdf", label: { en: "Compress PDF", es: "Comprimir PDF" } }
        ]}
        relatedGuidesTitle={{ en: "Learn how to use this tool", es: "Aprende a usar esta herramienta" }}
        relatedGuides={[
          { href: "/guides/rotate-pdf-pages", label: { en: "How to Rotate PDF Pages Online", es: "Como rotar paginas PDF online" } }
        ]}
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
          },
          {
            question: {
              en: "Can I rotate only specific pages?",
              es: "Puedo rotar solo paginas especificas?"
            },
            answer: {
              en: "Yes. You can apply rotation controls per page before downloading the final file.",
              es: "Si. Puedes aplicar controles de rotacion por pagina antes de descargar el archivo final."
            }
          },
          {
            question: {
              en: "Does this work on mobile devices?",
              es: "Funciona en dispositivos moviles?"
            },
            answer: {
              en: "Yes, on modern mobile browsers, with the best handling experience on desktop for larger PDFs.",
              es: "Si, en navegadores moviles modernos, con mejor experiencia en escritorio para PDFs grandes."
            }
          }
        ]}
      >
        <RotatePdfTool />
      </ActiveToolPageFrame>
    </>
  );
}

