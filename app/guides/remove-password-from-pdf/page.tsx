import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Remove Password from PDF";
const description = "Remove PDF password restrictions in a browser-first workflow for authorized use cases.";

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
    { "@type": "HowToStep", text: "Upload the password-protected PDF." },
    { "@type": "HowToStep", text: "Enter valid password and remove restrictions." },
    { "@type": "HowToStep", text: "Download the updated file." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/remove-password-from-pdf"
});

export default function RemovePasswordFromPdfGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/remove-password-from-pdf"
        title={title}
        intro={[
          "When you have legal permission and valid credentials, removing PDF passwords can simplify reuse and workflow automation.",
          "PDFNimbus offers a browser-first path to process this task cleanly."
        ]}
        steps={[
          "Open the Unlock PDF tool.",
          "Upload the protected file.",
          "Enter password and remove restrictions.",
          "Download the unlocked PDF."
        ]}
        ctaHref="/tools/unlock-pdf"
        ctaLabel="Remove password with Unlock PDF"
        benefits={[
          "Practical for authorized workflows",
          "Clean unlock-and-download flow",
          "Browser-first handling",
          "Fast execution for routine tasks"
        ]}
        relatedTools={[
          { href: "/tools/protect-pdf", label: "Protect PDF" },
          { href: "/tools/compress-pdf", label: "Compress PDF" },
          { href: "/tools/merge-pdf", label: "Merge PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/unlock-pdf", label: "How to Unlock PDF" },
          { href: "/guides/unlock-pdf-for-printing", label: "How to Unlock PDF for Printing" }
        ]}
        faqItems={[
          { question: "Is this for authorized use only?", answer: "Yes, remove protection only when you are allowed to do so." },
          { question: "Do I need the original password?", answer: "Typically yes, valid credentials are required." },
          { question: "Can I add security again later?", answer: "Yes, reapply protection using the Protect PDF tool." }
        ]}
      />
    </>
  );
}
