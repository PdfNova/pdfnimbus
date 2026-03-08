import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Split PDF by Page Range";
const description =
  "Follow a simple workflow to split PDF files by custom page range using PDFNimbus split modes and visual previews.";

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  author: {
    "@type": "Organization",
    name: "PDFNimbus"
  }
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/split-pdf-by-range"
});

export default function SplitPdfByRangeGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <GuidePageTemplate
        title={title}
        intro={[
          "Splitting a PDF by range is useful when only part of a document is needed, such as extracting specific chapters, invoice batches, or legal sections. It helps reduce file size and keeps recipients focused on the relevant pages.",
          "PDFNimbus gives you flexible split modes, including custom ranges, selected pages, all pages, and every-N grouping. Visual thumbnails help confirm what will be exported before download, so your output is accurate on the first attempt."
        ]}
        steps={[
          "Open Split PDF and upload your source file.",
          "Choose Custom Ranges mode (or another mode if it better fits your task).",
          "Enter valid page start/end ranges and review highlighted pages in preview.",
          "Pick output style: separate files per range or one combined result.",
          "Run split and download the generated file(s)."
        ]}
        ctaHref="/tools/split-pdf"
        ctaLabel="Open Split PDF tool"
        sections={[
          {
            title: "Range planning tips",
            paragraphs: [
              "Use non-overlapping ranges to avoid duplicates and confusion in output. If you are preparing documents for multiple recipients, separate outputs per range usually make distribution easier.",
              "If you need to reorganize content after extraction, you can split first and then merge selected outputs into a custom final package. This two-step flow is often faster than editing one large source file manually."
            ]
          }
        ]}
        benefits={[
          "Flexible split modes for real workflows",
          "Thumbnail-backed page confidence",
          "Range validation that helps prevent mistakes",
          "Browser-first handling for normal usage"
        ]}
        relatedTools={[
          { href: "/tools/merge-pdf", label: "Merge PDF" },
          { href: "/tools/rotate-pdf", label: "Rotate PDF" },
          { href: "/tools/compress-pdf", label: "Compress PDF" }
        ]}
      />
    </>
  );
}
