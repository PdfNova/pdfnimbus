import type { Metadata } from "next";
import { QrGeneratorTool } from "@/components/tools/qr-generator/qr-generator-tool";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "QR Generator Online Free";
const toolDescription =
  "Create QR codes for URLs, text, WiFi, and email with live preview and PNG/SVG download.";

const faqItems = [
  {
    question: "What QR input types are supported?",
    answer: "URL, text, WiFi credentials, and email format are supported."
  },
  {
    question: "Are my QR inputs uploaded to a server?",
    answer:
      "For typical use, generation runs directly in your browser. Inputs are not uploaded, stored, or tracked on our servers."
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
  name: "PDFNova QR Generator",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/qr-generator"
});

export default function QrGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />
      <ActiveToolPageFrame
        currentToolHref="/tools/qr-generator"
        title={{ en: "QR Generator", es: "Generador QR" }}
        subtitle={{
          en: "Generate custom QR codes with live preview and download as PNG or SVG.",
          es: "Genera codigos QR personalizados con vista previa en vivo y descarga PNG o SVG."
        }}
        howToTitle={{ en: "How to generate a QR code", es: "Como generar un codigo QR" }}
        howToText={{
          en: "Select input type, fill fields, tune size/colors, and download PNG or SVG.",
          es: "Selecciona tipo de entrada, completa campos, ajusta tamano/colores y descarga PNG o SVG."
        }}
        faqItems={[
          {
            question: {
              en: "What QR input types are supported?",
              es: "Que tipos de entrada QR son compatibles?"
            },
            answer: {
              en: "URL, text, WiFi credentials, and email format are supported.",
              es: "Se admiten URL, texto, credenciales WiFi y formato de email."
            }
          },
          {
            question: {
              en: "Are my QR inputs uploaded to a server?",
              es: "Mis datos QR se suben a un servidor?"
            },
            answer: {
              en: "For typical use, generation runs in your browser and inputs are not stored on our servers.",
              es: "Para uso normal, la generacion corre en tu navegador y no guardamos tus datos en servidores."
            }
          }
        ]}
      >
        <QrGeneratorTool />
      </ActiveToolPageFrame>
    </>
  );
}
