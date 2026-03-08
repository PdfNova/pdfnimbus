import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Combine PDF Pages";
const description =
  "A practical guide to combining PDF pages into one file using the PDFNimbus Merge PDF workflow.";

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
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: title,
  description,
  step: [
    { "@type": "HowToStep", text: "Open the matching PDFNimbus tool for this task." },
    { "@type": "HowToStep", text: "Upload your file(s) and review the preview/options." },
    { "@type": "HowToStep", text: "Run the action and verify output before download." },
    { "@type": "HowToStep", text: "Download the final file(s)." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/combine-pdf-pages"
});

export default function CombinePdfPagesGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/combine-pdf-pages"
        
        title={title}
        intro={[
          "Combining PDF pages is the right approach when content is spread across separate files but should be delivered as one final document. Instead of sending attachments one by one, you can package everything into a single ordered PDF that is easier to read and archive.",
          "PDFNimbus helps you combine PDF pages online with a visual, browser-first flow. You can inspect previews, reorder pages by moving file cards, and export one final file ready for upload, review, or signature workflows."
        ]}
        steps={[
          "Open the Merge PDF tool from PDFNimbus.",
          "Upload all source PDFs that contain the pages you want to combine.",
          "Reorder file cards until the page flow matches your target output.",
          "Select your preferred page size normalization option.",
          "Merge and download the combined PDF file."
        ]}
        ctaHref="/tools/merge-pdf"
        ctaLabel="Combine pages with Merge PDF"
        sections={[
          {
            title: "Tips for cleaner combined output",
            paragraphs: [
              "Before merging, check file naming and sequence so the visual card order is easy to validate. If pages come from mixed sources, A4 or Letter normalization can improve consistency when printing or sharing with teams.",
              "After combining pages, run a quick quality check: confirm orientation, verify page order, and ensure no page was unintentionally omitted. This takes seconds and helps avoid rework."
            ]
          }
        ]}
        benefits={[
          "Straightforward visual page flow",
          "Single final PDF for cleaner sharing",
          "Browser-first process for typical use",
          "No unnecessary workflow friction"
        ]}
        relatedTools={[
          { href: "/tools/split-pdf", label: "Split PDF" },
          { href: "/tools/compress-pdf", label: "Compress PDF" },
          { href: "/tools/rotate-pdf", label: "Rotate PDF" }
        ]}
      />
    </>
  );
}



