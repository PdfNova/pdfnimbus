import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "Convert PDF to Word Online";
const description =
  "Convert PDF to Word online with PDFNimbus and follow a simple workflow for editable output, review, and handoff.";

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
    { "@type": "HowToStep", text: "Open PDFNimbus PDF to Word in your browser." },
    { "@type": "HowToStep", text: "Upload the PDF you want to turn into a Word file." },
    { "@type": "HowToStep", text: "Convert the document and download the editable file." },
    { "@type": "HowToStep", text: "Review formatting and continue editing in Word." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/convert-pdf-to-word"
});

export default function ConvertPdfToWordGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/convert-pdf-to-word"
        title={title}
        intro={[
          "Online PDF to Word conversion is helpful when you need a faster path from a locked document into an editable workspace. It is especially practical for reports, internal drafts, proposals, and reused text sections.",
          "This PDFNimbus guide keeps the process simple: open the tool page, start from your PDF, export the editable file, and then review the output before using it in a broader workflow."
        ]}
        steps={[
          "Go to the PDF to Word tool page.",
          "Select the PDF file that needs to become editable.",
          "Start the conversion and wait for Word output.",
          "Download the file and open it in Word-compatible software.",
          "Adjust layout or formatting details if needed."
        ]}
        ctaHref="/tools/pdf-to-word"
        ctaLabel="Use PDF to Word"
        sections={[
          {
            title: "When online conversion is a good fit",
            paragraphs: [
              "This path works well for everyday office documents where you need editable text more than pixel-perfect archival fidelity. It is a practical choice for internal revisions, negotiation drafts, and collaborative review.",
              "If you need the reverse flow after editing, use Word to PDF to publish a final version that is easier to share without layout drift."
            ]
          }
        ]}
        benefits={[
          "Fast path from PDF to editable text",
          "Useful for browser-first office workflows",
          "Pairs naturally with Word to PDF",
          "Supported by dedicated PDFNimbus FAQs and related pages"
        ]}
        relatedTools={[
          { href: "/tools/pdf-to-word", label: "PDF to Word" },
          { href: "/tools/word-to-pdf", label: "Word to PDF" },
          { href: "/tools/compress-pdf", label: "Compress PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/pdf-to-word", label: "How to Convert PDF to Word with PDFNimbus" },
          { href: "/guides/word-to-pdf", label: "How to Convert Word to PDF with PDFNimbus" },
          { href: "/guides/convert-word-to-pdf", label: "Convert Word to PDF Online" }
        ]}
        faqItems={[
          {
            question: "Is PDF to Word useful for contracts and forms?",
            answer: "Yes. It is useful when you need to update clauses, names, dates, or structured sections without rebuilding the file from zero."
          },
          {
            question: "Do I still need to proofread after conversion?",
            answer: "Yes. Proofreading is important because spacing, tables, and page breaks may need small edits."
          },
          {
            question: "What should I do after editing the Word file?",
            answer: "If you need a final shareable version, convert the updated document back to PDF."
          }
        ]}
      />
    </>
  );
}
