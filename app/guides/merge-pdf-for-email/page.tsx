import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Merge PDF for Email";
const description = "Create one clean PDF attachment for email by merging files quickly in PDFNimbus.";

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
    { "@type": "HowToStep", text: "Open Merge PDF in PDFNimbus." },
    { "@type": "HowToStep", text: "Upload all files that should go in one email attachment." },
    { "@type": "HowToStep", text: "Set order and run merge." },
    { "@type": "HowToStep", text: "Download and attach the final PDF to your email." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/merge-pdf-for-email"
});

export default function MergePdfForEmailGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/merge-pdf-for-email"
        title={title}
        intro={[
          "If you need to send multiple PDFs in one email, merging them into a single attachment is often cleaner and easier for recipients.",
          "PDFNimbus lets you merge files in-browser and produce one final PDF ready to send."
        ]}
        steps={[
          "Open the Merge PDF tool.",
          "Upload all PDF files for the email packet.",
          "Arrange order and merge.",
          "Download and attach the merged file."
        ]}
        ctaHref="/tools/merge-pdf"
        ctaLabel="Use the Merge PDF tool"
        benefits={[
          "One attachment instead of many",
          "Clear page order control",
          "Fast browser-based flow",
          "Cleaner recipient experience"
        ]}
        relatedTools={[
          { href: "/tools/compress-pdf", label: "Compress PDF" },
          { href: "/tools/split-pdf", label: "Split PDF" },
          { href: "/tools/rotate-pdf", label: "Rotate PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/compress-pdf-for-email", label: "How to Compress PDF for Email" },
          { href: "/guides/merge-pdf-online-free", label: "How to Merge PDF Online Free" }
        ]}
        faqItems={[
          { question: "Can I merge many files for one email?", answer: "Yes, upload multiple PDFs and export one combined file." },
          { question: "Should I compress after merging?", answer: "If size is high, run Compress PDF after merge." },
          { question: "Can this work on mobile?", answer: "Yes, though desktop is easier for larger batches." }
        ]}
      />
    </>
  );
}
