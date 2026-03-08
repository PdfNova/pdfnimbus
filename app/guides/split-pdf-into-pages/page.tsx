import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Split PDF into Pages";
const description = "Split a PDF into individual pages or selected groups using the PDFNimbus Split PDF tool.";

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
    { "@type": "HowToStep", text: "Open Split PDF and upload your file." },
    { "@type": "HowToStep", text: "Choose all-pages, selected pages, or range mode." },
    { "@type": "HowToStep", text: "Confirm selection with page previews." },
    { "@type": "HowToStep", text: "Export and download the split files." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/split-pdf-into-pages"
});

export default function SplitPdfIntoPagesGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/split-pdf-into-pages"
        
        title={title}
        intro={[
          "Splitting a PDF into pages is useful when each page needs separate handling, sharing, or filing.",
          "PDFNimbus supports multiple split modes so you can export individual pages, specific ranges, or grouped chunks quickly."
        ]}
        steps={[
          "Open Split PDF in PDFNimbus.",
          "Upload your source document.",
          "Select split mode and confirm pages in preview.",
          "Run split and download output files."
        ]}
        ctaHref="/tools/split-pdf"
        ctaLabel="Use the Split PDF tool"
        benefits={[
          "Flexible page/range/chunk split modes",
          "Visual page validation",
          "Quick extraction for sharing",
          "Browser-first workflow"
        ]}
        relatedTools={[
          { href: "/tools/merge-pdf", label: "Merge PDF" },
          { href: "/tools/rotate-pdf", label: "Rotate PDF" },
          { href: "/tools/compress-pdf", label: "Compress PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/split-pdf-by-range", label: "How to Split PDF by Page Range" },
          { href: "/guides/merge-pdf-files", label: "How to Merge PDF Files Online" }
        ]}
        faqItems={[
          { question: "Can I split into single pages?", answer: "Yes, use all-pages mode to export one file per page." },
          { question: "Can I export only selected pages?", answer: "Yes, choose selected pages or range mode." },
          { question: "Can I combine outputs later?", answer: "Yes, you can merge selected outputs in the Merge PDF tool." }
        ]}
      />
    </>
  );
}

