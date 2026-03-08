import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Protect PDF for Email";
const description = "Protect PDF attachments for email by adding password security with PDFNimbus.";

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
    { "@type": "HowToStep", text: "Open Protect PDF in PDFNimbus." },
    { "@type": "HowToStep", text: "Upload the PDF you plan to email." },
    { "@type": "HowToStep", text: "Set a password and export protected PDF." },
    { "@type": "HowToStep", text: "Send file and share password securely via separate channel." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/protect-pdf-for-email"
});

export default function ProtectPdfForEmailGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/protect-pdf-for-email"
        title={title}
        intro={[
          "If you share PDFs by email, password protection can reduce access risk if an attachment is forwarded.",
          "PDFNimbus gives you a browser-first flow to lock a file before sending it."
        ]}
        steps={[
          "Open Protect PDF and upload your document.",
          "Set and confirm the password.",
          "Export the protected PDF.",
          "Email the file and send password separately."
        ]}
        ctaHref="/tools/protect-pdf"
        ctaLabel="Protect PDF for email"
        benefits={[
          "Safer attachment sharing",
          "Simple pre-send protection step",
          "Quick browser workflow",
          "Works with standard email habits"
        ]}
        relatedTools={[
          { href: "/tools/compress-pdf", label: "Compress PDF" },
          { href: "/tools/remove-pdf-pages", label: "Remove PDF Pages" },
          { href: "/tools/merge-pdf", label: "Merge PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/password-protect-pdf", label: "How to Password Protect PDF" },
          { href: "/guides/how-to-lock-a-pdf-file", label: "How to Lock a PDF File" }
        ]}
        faqItems={[
          { question: "Should I send password in the same email?", answer: "Safer practice is sharing password through a different channel." },
          { question: "Can I still compress protected PDFs?", answer: "It is usually easier to compress before applying password protection." },
          { question: "Is this useful for client documents?", answer: "Yes, password protection is common for controlled document sharing." }
        ]}
      />
    </>
  );
}
