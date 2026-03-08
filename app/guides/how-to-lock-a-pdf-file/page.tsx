import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Lock a PDF File";
const description = "Lock a PDF file with password protection in a simple browser-based PDFNimbus workflow.";

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
    { "@type": "HowToStep", text: "Open PDFNimbus Protect PDF." },
    { "@type": "HowToStep", text: "Upload the PDF you want to lock." },
    { "@type": "HowToStep", text: "Choose a password and lock the file." },
    { "@type": "HowToStep", text: "Download the locked PDF and verify access control." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/how-to-lock-a-pdf-file"
});

export default function HowToLockPdfFileGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/how-to-lock-a-pdf-file"
        title={title}
        intro={[
          "Locking a PDF is useful when files contain information that should only be opened by authorized recipients.",
          "PDFNimbus provides a fast way to apply password protection before sharing documents."
        ]}
        steps={[
          "Open the Protect PDF tool.",
          "Upload the target PDF.",
          "Set password protection and apply lock.",
          "Download and test the locked file."
        ]}
        ctaHref="/tools/protect-pdf"
        ctaLabel="Lock your PDF now"
        benefits={[
          "Quick file-locking workflow",
          "Better document access control",
          "Simple browser-based process",
          "Practical for share-ready PDFs"
        ]}
        relatedTools={[
          { href: "/tools/remove-pdf-pages", label: "Remove PDF Pages" },
          { href: "/tools/split-pdf", label: "Split PDF" },
          { href: "/tools/merge-pdf", label: "Merge PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/password-protect-pdf", label: "How to Password Protect PDF" },
          { href: "/guides/protect-pdf-for-email", label: "How to Protect PDF for Email" }
        ]}
        faqItems={[
          { question: "Is locking a PDF the same as password protection?", answer: "For this workflow, yes: locking means requiring a password to open the file." },
          { question: "Can I lock PDFs before sharing publicly?", answer: "Yes, this is a common use case for controlled access." },
          { question: "Can I still merge locked PDFs later?", answer: "Usually you should merge/compress first, then lock the final output." }
        ]}
      />
    </>
  );
}
