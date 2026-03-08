import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Unlock PDF";
const description = "Unlock PDF files in a browser-based workflow when you have permission to remove restrictions.";

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
    { "@type": "HowToStep", text: "Open Unlock PDF in PDFNimbus." },
    { "@type": "HowToStep", text: "Upload the protected PDF." },
    { "@type": "HowToStep", text: "Provide required password/credentials and unlock." },
    { "@type": "HowToStep", text: "Download the unlocked output." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/unlock-pdf"
});

export default function UnlockPdfGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/unlock-pdf"
        title={title}
        intro={[
          "Unlocking a PDF can be necessary when a file is restricted and you are authorized to remove access controls.",
          "PDFNimbus provides a browser-first unlock route for this workflow."
        ]}
        steps={[
          "Open the Unlock PDF tool.",
          "Upload your locked PDF.",
          "Provide required credentials and run unlock.",
          "Download and verify the unlocked file."
        ]}
        ctaHref="/tools/unlock-pdf"
        ctaLabel="Use the Unlock PDF tool"
        benefits={[
          "Fast restriction-removal flow",
          "Useful for permitted document recovery",
          "Browser-based operation",
          "Simple step-by-step process"
        ]}
        relatedTools={[
          { href: "/tools/protect-pdf", label: "Protect PDF" },
          { href: "/tools/remove-pdf-pages", label: "Remove PDF Pages" },
          { href: "/tools/merge-pdf", label: "Merge PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/remove-password-from-pdf", label: "How to Remove Password from PDF" },
          { href: "/guides/unlock-pdf-for-printing", label: "How to Unlock PDF for Printing" }
        ]}
        faqItems={[
          { question: "Can I unlock any PDF?", answer: "Only unlock files when you have the right to remove restrictions." },
          { question: "Do I need the password?", answer: "Most protected files require valid credentials before unlocking." },
          { question: "Can I re-protect afterward?", answer: "Yes, you can lock the output again using Protect PDF." }
        ]}
      />
    </>
  );
}
