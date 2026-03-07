import type { Metadata } from "next";
import { QrGeneratorTool } from "@/components/tools/qr-generator/qr-generator-tool";
import { PdfNovaToolsGrid } from "@/components/tools/shared/pdfnova-tools-grid";
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
    <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([softwareJsonLd, faqJsonLd]) }}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">QR Generator</h1>
        <p className="mt-2 max-w-3xl text-base text-slate-600 sm:text-lg">
          Generate custom QR codes with live preview and download as PNG or SVG.
        </p>
      </header>

      <PdfNovaToolsGrid currentToolHref="/tools/qr-generator" />

      <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">How to generate a QR code</h2>
        <p className="mt-1 text-sm text-slate-600">Select input type, fill fields, tune size/colors, then download PNG or SVG.</p>
      </section>

      <QrGeneratorTool />

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">FAQ</h2>
        <div className="mt-5 space-y-5">
          {faqItems.map((item) => (
            <article key={item.question}>
              <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
