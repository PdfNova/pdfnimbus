import type { Metadata } from "next";
import { CompressImageTool } from "@/components/tools/compress-image/compress-image-tool";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "Compress Image Online Free";
const toolDescription =
  "Compress multiple images in your browser with low, recommended, or extreme settings and download optimized files.";

const faqItems = [
  {
    question: "Can I compress multiple images at once?",
    answer: "Yes. Upload multiple images and compress them in a single batch."
  },
  {
    question: "How can I download results?",
    answer: "Single image downloads directly. Multiple images are downloaded as a ZIP file."
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
  name: "PDFNimbus Compress Image",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/compress-image"
});

export default function CompressImagePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />
      <ActiveToolPageFrame
        currentToolHref="/tools/compress-image"
        title={{ en: "Compress Image", es: "Comprimir imagen" }}
        subtitle={{
          en: "Reduce image file size with browser-first compression and keep quality under control.",
          es: "Reduce el tamano de imagenes en el navegador y controla la calidad final."
        }}
        howToTitle={{ en: "How to compress images", es: "Como comprimir imagenes" }}
        howToText={{
          en: "Upload images, pick a compression level, then download optimized output.",
          es: "Sube imagenes, elige nivel de compresion y descarga resultados optimizados."
        }}
        faqItems={[
          {
            question: {
              en: "Can I compress multiple images at once?",
              es: "Puedo comprimir varias imagenes a la vez?"
            },
            answer: {
              en: "Yes. Upload multiple images and compress them in a single batch.",
              es: "Si. Sube varias imagenes y comprime todo en un solo lote."
            }
          },
          {
            question: {
              en: "How can I download results?",
              es: "Como puedo descargar resultados?"
            },
            answer: {
              en: "Single image downloads directly. Multiple images are downloaded as a ZIP file.",
              es: "Una sola imagen se descarga directa. Varias imagenes se descargan en ZIP."
            }
          }
        ]}
      >
        <CompressImageTool />
      </ActiveToolPageFrame>
    </>
  );
}

