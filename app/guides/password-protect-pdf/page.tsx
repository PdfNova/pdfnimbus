import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Password Protect PDF";
const description = "Add password protection to your PDF quickly with the browser-first PDFNimbus Protect PDF workflow.";

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
    { "@type": "HowToStep", text: "Upload the PDF file you want to protect." },
    { "@type": "HowToStep", text: "Set a strong password and apply protection." },
    { "@type": "HowToStep", text: "Download the protected PDF." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/password-protect-pdf"
});

export default function PasswordProtectPdfGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/password-protect-pdf"
        title={title}
        intro={[
          "Password protection helps control access when sharing PDFs that include private or restricted content.",
          "PDFNimbus provides a browser-first route for adding protection before distribution."
        ]}
        steps={[
          "Open the Protect PDF tool.",
          "Upload your source PDF.",
          "Set password options and apply protection.",
          "Download and test the protected file."
        ]}
        ctaHref="/tools/protect-pdf"
        ctaLabel="Use the Protect PDF tool"
        benefits={[
          "Safer sharing for sensitive documents",
          "Quick protection workflow",
          "Browser-based handling",
          "Simple export steps"
        ]}
        relatedTools={[
          { href: "/tools/remove-pdf-pages", label: "Remove PDF Pages" },
          { href: "/tools/merge-pdf", label: "Merge PDF" },
          { href: "/tools/compress-pdf", label: "Compress PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/protect-pdf-for-email", label: "How to Protect PDF for Email" },
          { href: "/guides/how-to-lock-a-pdf-file", label: "How to Lock a PDF File" }
        ]}
        faqItems={[
          { question: "Can I protect a PDF with password?", answer: "Yes, this workflow is designed for password-based PDF protection." },
          { question: "Should I use strong passwords?", answer: "Yes, use a strong unique password before sharing files." },
          { question: "Can protected PDFs still be emailed?", answer: "Yes, protection is commonly used before email sharing." }
        ]}
      />
    </>
  );
}
