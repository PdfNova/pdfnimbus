import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Merge PDF on Windows";
const description = "Merge PDF files on Windows quickly using the browser-based PDFNimbus Merge PDF workflow.";

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
    { "@type": "HowToStep", text: "Open PDFNimbus Merge PDF in your Windows browser." },
    { "@type": "HowToStep", text: "Upload PDF files and verify card previews." },
    { "@type": "HowToStep", text: "Set order and run merge." },
    { "@type": "HowToStep", text: "Download the final merged PDF." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/merge-pdf-on-windows"
});

export default function MergePdfOnWindowsGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/merge-pdf-on-windows"
        title={title}
        intro={[
          "Windows users can merge PDF files quickly in-browser without installing another utility.",
          "PDFNimbus gives you visual file ordering and quick export so document packaging is straightforward."
        ]}
        steps={[
          "Open Merge PDF in your Windows browser.",
          "Upload files that belong in the final document.",
          "Arrange order and run merge.",
          "Download and verify the result."
        ]}
        ctaHref="/tools/merge-pdf"
        ctaLabel="Merge PDF on Windows"
        benefits={[
          "No extra desktop setup",
          "Fast day-to-day merge workflow",
          "Visual reorder controls",
          "Simple final export"
        ]}
        relatedTools={[
          { href: "/tools/split-pdf", label: "Split PDF" },
          { href: "/tools/compress-pdf", label: "Compress PDF" },
          { href: "/tools/rotate-pdf", label: "Rotate PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/merge-pdf-on-mac", label: "How to Merge PDF on Mac" },
          { href: "/guides/merge-pdf-without-software", label: "How to Merge PDF Without Software" }
        ]}
        faqItems={[
          { question: "Do I need a Windows app for this?", answer: "No, the workflow runs in-browser." },
          { question: "Can I choose output page size?", answer: "Yes, merge supports original, A4, and Letter options." },
          { question: "Can I merge scanned PDFs too?", answer: "Yes, scanned PDFs can be merged like standard PDF files." }
        ]}
      />
    </>
  );
}
