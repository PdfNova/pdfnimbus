import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Merge PDF on Mac";
const description = "Merge PDF files on Mac quickly with the browser-first PDFNimbus Merge PDF workflow.";

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
    { "@type": "HowToStep", text: "Open Merge PDF on your Mac browser." },
    { "@type": "HowToStep", text: "Upload PDFs and verify preview cards." },
    { "@type": "HowToStep", text: "Reorder files and run merge." },
    { "@type": "HowToStep", text: "Download the merged file on Mac." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/merge-pdf-on-mac"
});

export default function MergePdfOnMacGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/merge-pdf-on-mac"
        
        title={title}
        intro={[
          "Mac users can merge PDF files quickly with a browser workflow instead of switching desktop apps.",
          "PDFNimbus works in modern Safari/Chromium browsers and keeps the merge process simple: upload, order, merge, download."
        ]}
        steps={[
          "Open Merge PDF from your Mac browser.",
          "Upload all target PDF files.",
          "Arrange order and run merge.",
          "Download and review the output file."
        ]}
        ctaHref="/tools/merge-pdf"
        ctaLabel="Use Merge PDF on Mac"
        benefits={[
          "Mac-friendly browser workflow",
          "Visual order check before export",
          "Fast output for submissions",
          "No extra app install"
        ]}
        relatedTools={[
          { href: "/tools/rotate-pdf", label: "Rotate PDF" },
          { href: "/tools/split-pdf", label: "Split PDF" },
          { href: "/tools/compress-pdf", label: "Compress PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/merge-pdf-online-free", label: "How to Merge PDF Online Free" },
          { href: "/guides/combine-pdf-pages", label: "How to Combine PDF Pages" }
        ]}
        faqItems={[
          { question: "Does this work on Safari?", answer: "Yes, it works on modern browsers on macOS." },
          { question: "Can I merge multiple PDFs in one run?", answer: "Yes, upload several files and export one output." },
          { question: "Can I choose A4 or Letter output?", answer: "Yes, the merge tool supports output page-size options." }
        ]}
      />
    </>
  );
}

