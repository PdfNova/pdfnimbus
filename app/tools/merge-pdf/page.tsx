import type { Metadata } from "next";
import { MergePdfTool } from "@/components/tools/merge-pdf/merge-pdf-tool";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "Merge PDF Files Online Free";
const toolDescription =
  "Combine multiple PDF files into one document instantly. Browser-first PDF merging with no uploads required.";

const faqItems = [
  {
    question: "Is this Merge PDF tool free to use?",
    answer: "Yes. You can merge PDF files in your browser without creating an account."
  },
  {
    question: "Are my files uploaded to a server?",
    answer:
      "For typical use, all processing happens directly in your browser. Your files are not uploaded, stored, or tracked on our servers."
  },
  {
    question: "Can I choose the order before merging?",
    answer:
      "Yes. Drag the PDF cards into the desired order before merging. The final merged document follows the visual order shown above."
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
  name: "PDFNimbus Merge PDF",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/merge-pdf"
});

export default function MergePdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />
      <ActiveToolPageFrame
        currentToolHref="/tools/merge-pdf"
        title={{ en: "Merge PDF", es: "Unir PDF" }}
        subtitle={{
          en: "Upload PDFs, set order visually, and merge everything into one clean document in seconds.",
          es: "Sube PDFs, ajusta el orden visualmente y une todo en un documento limpio en segundos."
        }}
        howToTitle={{ en: "How to merge PDFs", es: "Como unir PDFs" }}
        howToText={{
          en: "Upload files, drag cards to set order, then merge and download the final PDF.",
          es: "Sube archivos, arrastra tarjetas para definir orden y descarga el PDF final."
        }}
        introParagraphs={[
          {
            en: "Merge PDF files online in a browser-first workflow designed for quick, clean output. Upload multiple files, review real previews, and export one final document in your preferred order.",
            es: "Une archivos PDF online con un flujo browser-first pensado para obtener un resultado limpio y rapido. Sube varios archivos, revisa vistas previas reales y exporta un documento final en el orden que elijas."
          },
          {
            en: "This tool is built for practical tasks like combining invoices, reports, or signed pages without sending files to external processing services for normal usage.",
            es: "Esta herramienta esta pensada para tareas practicas como juntar facturas, informes o paginas firmadas sin enviar archivos a servicios externos de procesamiento en uso normal."
          }
        ]}
        benefitsTitle={{ en: "Why use this Merge PDF tool", es: "Por que usar esta herramienta de unir PDF" }}
        benefitsItems={[
          { en: "Real page previews before merge", es: "Vistas previas reales antes de unir" },
          { en: "Drag-and-drop order control", es: "Control de orden con arrastrar y soltar" },
          { en: "A4, Letter, or original page sizing", es: "Tamano de pagina A4, Letter u original" },
          { en: "Browser-first processing for typical use", es: "Procesamiento browser-first para uso normal" }
        ]}
        relatedToolsTitle={{ en: "Related PDF tools", es: "Herramientas PDF relacionadas" }}
        relatedTools={[
          { href: "/tools/split-pdf", label: { en: "Split PDF", es: "Dividir PDF" } },
          { href: "/tools/compress-pdf", label: { en: "Compress PDF", es: "Comprimir PDF" } },
          { href: "/tools/rotate-pdf", label: { en: "Rotate PDF", es: "Rotar PDF" } }
        ]}
        faqItems={[
          {
            question: {
              en: "Is this Merge PDF tool free to use?",
              es: "Esta herramienta de unir PDF es gratis?"
            },
            answer: {
              en: "Yes. You can merge PDF files in your browser without creating an account.",
              es: "Si. Puedes unir PDFs en tu navegador sin crear cuenta."
            }
          },
          {
            question: {
              en: "Are my files uploaded to a server?",
              es: "Mis archivos se suben a un servidor?"
            },
            answer: {
              en: "For typical use, all processing happens directly in your browser and files are not stored on our servers.",
              es: "Para uso normal, todo se procesa en tu navegador y los archivos no se guardan en nuestros servidores."
            }
          },
          {
            question: {
              en: "Can I choose the order before merging?",
              es: "Puedo elegir el orden antes de unir?"
            },
            answer: {
              en: "Yes. Drag each PDF card into the desired order before running merge.",
              es: "Si. Arrastra cada tarjeta PDF al orden deseado antes de unir."
            }
          },
          {
            question: {
              en: "Can I use Merge PDF on mobile?",
              es: "Puedo usar unir PDF en movil?"
            },
            answer: {
              en: "Yes, it works on modern mobile browsers, though larger files are easier to manage on desktop.",
              es: "Si, funciona en navegadores moviles modernos, aunque archivos grandes se gestionan mejor en escritorio."
            }
          }
        ]}
      >
        <MergePdfTool />
      </ActiveToolPageFrame>
    </>
  );
}

