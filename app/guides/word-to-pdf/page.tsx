import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Convert Word to PDF with PDFNimbus";
const description =
  "Learn how to convert Word files into clean PDF documents with PDFNimbus for sharing, printing, and final review.";

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
    { "@type": "HowToStep", text: "Open Word to PDF in PDFNimbus." },
    { "@type": "HowToStep", text: "Upload the DOC or DOCX file you want to export." },
    { "@type": "HowToStep", text: "Run the conversion and create the PDF output." },
    { "@type": "HowToStep", text: "Download the PDF and review final formatting." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/word-to-pdf"
});

export default function WordToPdfGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/word-to-pdf"
        title={title}
        intro={[
          "Word to PDF is the right workflow when you want a stable final file that is easier to print, share, archive, or send for review. Typical examples include resumes, proposals, invoices, and client-ready reports.",
          "PDFNimbus gives this conversion its own tool page and guide set so users can move from editable office documents to final PDF output with clearer expectations."
        ]}
        steps={[
          "Open the Word to PDF tool.",
          "Upload your DOC or DOCX file.",
          "Run conversion to produce a PDF version of the document.",
          "Download the PDF and review spacing, page breaks, and images.",
          "Share, print, or archive the final file."
        ]}
        ctaHref="/tools/word-to-pdf"
        ctaLabel="Open Word to PDF"
        sections={[
          {
            title: "Why teams publish final documents as PDF",
            paragraphs: [
              "PDF is useful because it is harder to alter accidentally and it usually travels better across devices, operating systems, and email clients than a live Word file.",
              "This makes it a better format for final delivery, approvals, hiring submissions, and records that should preserve layout as consistently as possible."
            ]
          }
        ]}
        benefits={[
          "Useful for final review and sharing",
          "Better format for printing and archiving",
          "Pairs with PDF to Word for reverse editing",
          "Supported by a dedicated Office conversion cluster"
        ]}
        relatedTools={[
          { href: "/tools/word-to-pdf", label: "Word to PDF" },
          { href: "/tools/pdf-to-word", label: "PDF to Word" },
          { href: "/tools/merge-pdf", label: "Merge PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/convert-word-to-pdf", label: "Convert Word to PDF Online" },
          { href: "/guides/pdf-to-word", label: "How to Convert PDF to Word with PDFNimbus" },
          { href: "/guides/convert-pdf-to-word", label: "Convert PDF to Word Online" }
        ]}
        faqItems={[
          {
            question: "Why use PDF instead of sending Word directly?",
            answer: "PDF is usually better when you need layout stability and a document that is easier to print or review."
          },
          {
            question: "Should I check the file after export?",
            answer: "Yes. Review fonts, page breaks, headers, and image placement before sending the PDF."
          },
          {
            question: "Can I return to an editable file later?",
            answer: "Yes. Use PDF to Word if you need to reopen the content in an editable document workflow."
          }
        ]}
      />
    </>
  );
}
