import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Compress PDF Without Losing Quality";
const description =
  "Learn a practical browser-first method to compress PDF files while keeping readable output quality with PDFNimbus.";

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
  canonicalPath: "/guides/compress-pdf-without-losing-quality"
});

export default function CompressPdfWithoutLosingQualityGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <GuidePageTemplate
        title={title}
        intro={[
          "When a PDF is too heavy for email, portals, or messaging apps, compression is the fastest fix. The challenge is reducing size while keeping text and visuals clear enough for real use.",
          "PDFNimbus provides a browser-first compress PDF workflow with selectable compression levels, file preview, and immediate result feedback. You can compare original and optimized size, then choose whether the output quality meets your needs before sending the file."
        ]}
        steps={[
          "Open Compress PDF and upload one PDF file.",
          "Review file details and choose a compression level based on your goal.",
          "Run compression and wait for the optimized version.",
          "Check the saved percentage plus original vs compressed size metrics.",
          "Download the optimized PDF and do a quick visual quality check."
        ]}
        ctaHref="/tools/compress-pdf"
        ctaLabel="Open Compress PDF tool"
        sections={[
          {
            title: "How to keep quality while reducing size",
            paragraphs: [
              "Start with the recommended mode first. It is usually the best balance for reports, forms, and mixed text-image documents. If the result is still too large, move to a stronger level only when necessary.",
              "Always review pages that contain small text, logos, or signatures before sharing. A short final check keeps output quality aligned with the destination requirements while still benefiting from a smaller file."
            ]
          }
        ]}
        benefits={[
          "Clear before/after size visibility",
          "Practical compression levels for different use cases",
          "Browser-first workflow for typical processing",
          "Fast export ready for upload or email"
        ]}
        relatedTools={[
          { href: "/tools/merge-pdf", label: "Merge PDF" },
          { href: "/tools/split-pdf", label: "Split PDF" },
          { href: "/tools/pdf-to-jpg", label: "PDF to JPG" }
        ]}
      />
    </>
  );
}
