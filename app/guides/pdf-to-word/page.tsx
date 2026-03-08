import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Convert PDF to Word with PDFNimbus";
const description =
  "Learn how to turn PDF files into editable Word documents with a clean PDF to Word workflow in PDFNimbus.";

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  author: { "@type": "Organization", name: "PDFNimbus" }
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: title,
  description,
  step: [
    { "@type": "HowToStep", text: "Open PDF to Word in PDFNimbus." },
    { "@type": "HowToStep", text: "Add the PDF you want to make editable." },
    { "@type": "HowToStep", text: "Run the conversion workflow and export Word output." },
    { "@type": "HowToStep", text: "Review the editable document in Word-compatible software." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/pdf-to-word"
});

export default function PdfToWordGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/pdf-to-word"
        title={title}
        intro={[
          "PDF to Word is useful when you need to edit content that currently lives inside a PDF. Typical examples include contracts, reports, proposals, and forms that need revisions without recreating the document from scratch.",
          "PDFNimbus gives this workflow a dedicated route, related help content, and a clear conversion path so users can move from fixed PDF pages into an editable document format."
        ]}
        steps={[
          "Open the PDF to Word tool.",
          "Upload the PDF file you want to edit later in Word.",
          "Run the conversion workflow and wait for the Word export to finish.",
          "Download the file and review headings, spacing, tables, and page breaks.",
          "Make final edits in Word-compatible software before sharing."
        ]}
        ctaHref="/tools/pdf-to-word"
        ctaLabel="Open PDF to Word"
        sections={[
          {
            title: "What to check after conversion",
            paragraphs: [
              "Text-based PDFs usually convert more cleanly than scanned documents. If your source file contains flattened scans, low-resolution pages, or unusual fonts, expect some cleanup after export.",
              "Always review paragraphs, numbered lists, tables, and legal formatting before sending the final file to clients or colleagues."
            ]
          }
        ]}
        benefits={[
          "Useful for contracts, reports, and forms",
          "Built around editable document output",
          "Helps you reuse text instead of retyping it",
          "Connected directly to PDFNimbus Office conversion pages"
        ]}
        relatedTools={[
          { href: "/tools/pdf-to-word", label: "PDF to Word" },
          { href: "/tools/word-to-pdf", label: "Word to PDF" },
          { href: "/tools/merge-pdf", label: "Merge PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/convert-pdf-to-word", label: "Convert PDF to Word Online" },
          { href: "/guides/word-to-pdf", label: "How to Convert Word to PDF with PDFNimbus" },
          { href: "/guides/convert-word-to-pdf", label: "Convert Word to PDF Online" }
        ]}
        faqItems={[
          {
            question: "Which PDFs convert best to Word?",
            answer: "Text-based PDFs usually perform best. Scanned pages may need extra editing after export."
          },
          {
            question: "Can I keep editing the result?",
            answer: "Yes. The purpose of this workflow is to produce an editable Word document."
          },
          {
            question: "Should I review layout after conversion?",
            answer: "Yes. Check fonts, spacing, tables, and page breaks before sending the file onward."
          }
        ]}
      />
    </>
  );
}
