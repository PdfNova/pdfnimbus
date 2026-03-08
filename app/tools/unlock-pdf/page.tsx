import type { Metadata } from "next";
import { ActiveToolPageFrame } from "@/components/tools/shared/active-tool-page-frame";
import { UnlockPdfTool } from "@/components/tools/unlock-pdf/unlock-pdf-tool";
import { buildToolMetadata } from "@/lib/seo";

const toolName = "Unlock PDF Online Free — PDFNimbus";
const toolDescription =
  "Unlock PDF files by removing password restrictions when permitted. Free browser-first unlock workflow for typical use.";

const faqItems = [
  {
    question: "Is this Unlock PDF tool free?",
    answer: "Yes. You can use this browser-based unlock workflow for free."
  },
  {
    question: "Are files uploaded to a server?",
    answer: "For typical use, processing is browser-first and files are not stored on our servers."
  },
  {
    question: "Can this tool crack unknown passwords?",
    answer: "No. This tool does not crack unknown passwords. It only removes known passwords entered by the user or owner restrictions when permitted."
  },
  {
    question: "Any legal limitations before unlocking?",
    answer: "Only use this tool on PDFs you own or have explicit permission to unlock."
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
  name: "PDFNimbus Unlock PDF",
  description: toolDescription,
  applicationCategory: "BusinessApplication",
  url: "https://pdfnimbus.vercel.app/tools/unlock-pdf",
  operatingSystem: "Web"
};

export const metadata: Metadata = buildToolMetadata({
  title: toolName,
  description: toolDescription,
  canonicalPath: "/tools/unlock-pdf"
});

export default function UnlockPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />
      <ActiveToolPageFrame
        currentToolHref="/tools/unlock-pdf"
        title={{ en: "Unlock PDF", es: "Desbloquear PDF" }}
        subtitle={{
          en: "Use this free browser-based tool to remove PDF password restrictions when you have permission.",
          es: "Usa esta herramienta browser-first gratuita para quitar restricciones de contrasena en PDF cuando tienes permiso."
        }}
        howToTitle={{ en: "How to unlock a PDF", es: "Como desbloquear un PDF" }}
        howToText={{
          en: "Upload your PDF, provide required credentials, and export an unlocked version.",
          es: "Sube tu PDF, aporta credenciales necesarias y exporta una version desbloqueada."
        }}
        introParagraphs={[
          {
            en: "This page provides an indexable unlock workflow surface, internal-link integration, and schema support while feature UI is finalized.",
            es: "Esta pagina aporta una superficie indexable de desbloqueo, interlinking y esquema mientras se finaliza la UI funcional."
          }
        ]}
        relatedToolsTitle={{ en: "Related PDF tools", es: "Herramientas PDF relacionadas" }}
        relatedTools={[
          { href: "/tools/protect-pdf", label: { en: "Protect PDF", es: "Proteger PDF" } },
          { href: "/tools/remove-pdf-pages", label: { en: "Remove PDF Pages", es: "Eliminar paginas PDF" } },
          { href: "/tools/merge-pdf", label: { en: "Merge PDF", es: "Unir PDF" } },
          { href: "/tools/compress-pdf", label: { en: "Compress PDF", es: "Comprimir PDF" } }
        ]}
        relatedGuidesTitle={{ en: "Learn how to use this tool", es: "Aprende a usar esta herramienta" }}
        relatedGuides={[
          { href: "/guides/unlock-pdf", label: { en: "How to Unlock PDF", es: "Como desbloquear PDF" } },
          {
            href: "/guides/remove-password-from-pdf",
            label: { en: "How to Remove Password from PDF", es: "Como quitar contrasena de PDF" }
          },
          {
            href: "/guides/unlock-pdf-for-printing",
            label: { en: "How to Unlock PDF for Printing", es: "Como desbloquear PDF para imprimir" }
          }
        ]}
        faqItems={faqItems.map((item) => ({
          question: { en: item.question, es: item.question },
          answer: { en: item.answer, es: item.answer }
        }))}
      >
        <UnlockPdfTool />
      </ActiveToolPageFrame>
    </>
  );
}
