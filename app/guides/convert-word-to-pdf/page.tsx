import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "Convert Word to PDF Online";
const description =
  "Convert Word to PDF online with PDFNimbus and follow a simple workflow for final-share documents, printing, and handoff.";

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
    { "@type": "HowToStep", text: "Open PDFNimbus Word to PDF in your browser." },
    { "@type": "HowToStep", text: "Upload the Word file you want to finalize." },
    { "@type": "HowToStep", text: "Convert the document into PDF format." },
    { "@type": "HowToStep", text: "Download the PDF and use it for review, sharing, or print." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/convert-word-to-pdf"
});

export default function ConvertWordToPdfGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/convert-word-to-pdf"
        title={title}
        intro={[
          "Online Word to PDF conversion is useful when you need a final copy of a document that should look stable across devices and inboxes. It is common for resumes, proposals, quotes, review copies, and client deliverables.",
          "This PDFNimbus guide outlines the simplest path: start with your Word file, export it to PDF, and check the result before you print it, attach it to an email, or store it as the final version."
        ]}
        steps={[
          "Open the Word to PDF tool page.",
          "Choose the DOC or DOCX file you want to convert.",
          "Run conversion to generate the PDF output.",
          "Download the file and review final formatting.",
          "Share, print, sign, or archive the PDF."
        ]}
        ctaHref="/tools/word-to-pdf"
        ctaLabel="Use Word to PDF"
        sections={[
          {
            title: "When online export is especially useful",
            paragraphs: [
              "This workflow is a good fit when you need a quick browser-first path from an editable draft to a final document. It helps when you are working across devices or preparing files for external recipients.",
              "If someone later requests changes inside the PDF version, the paired PDF to Word route gives you a way back into an editable format."
            ]
          }
        ]}
        benefits={[
          "Strong fit for resumes, proposals, and review copies",
          "Useful for printing and archiving",
          "Natural follow-up after editing in Word",
          "Connected to the reverse PDF to Word flow"
        ]}
        relatedTools={[
          { href: "/tools/word-to-pdf", label: "Word to PDF" },
          { href: "/tools/pdf-to-word", label: "PDF to Word" },
          { href: "/tools/compress-pdf", label: "Compress PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/word-to-pdf", label: "How to Convert Word to PDF with PDFNimbus" },
          { href: "/guides/pdf-to-word", label: "How to Convert PDF to Word with PDFNimbus" },
          { href: "/guides/convert-pdf-to-word", label: "Convert PDF to Word Online" }
        ]}
        faqItems={[
          {
            question: "Is Word to PDF good for resumes and client files?",
            answer: "Yes. It is a common way to preserve formatting before sending a file externally."
          },
          {
            question: "Do I still need to review the exported PDF?",
            answer: "Yes. Check pagination, fonts, and image alignment before publishing or sharing."
          },
          {
            question: "What if I need to edit the PDF later?",
            answer: "Use the PDF to Word workflow to move the content back into an editable document."
          }
        ]}
      />
    </>
  );
}
