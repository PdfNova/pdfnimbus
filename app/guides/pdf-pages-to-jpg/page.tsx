import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Convert PDF Pages to JPG Images";
const description =
  "Learn how to export PDF pages as JPG images for slides, previews, and sharing workflows using PDFNimbus.";

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
  canonicalPath: "/guides/pdf-pages-to-jpg"
});

export default function PdfPagesToJpgGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <GuidePageTemplate
        title={title}
        intro={[
          "Converting PDF pages to JPG is useful when you need image-based assets for design, social sharing, presentations, or quick previews. Instead of sharing an entire document, you can export only the visual pages you need.",
          "PDFNimbus offers a browser-first PDF to JPG workflow with clear preview and output handling. After conversion, you can download individual images or package multi-page output into one ZIP for easier transfer."
        ]}
        steps={[
          "Open the PDF to JPG tool and upload your PDF file.",
          "Check page count and preview to confirm the document is correct.",
          "Run conversion to generate JPG outputs for each page.",
          "Download one image directly or download all outputs together as ZIP when multiple pages exist.",
          "Review image quality and use the files in your target workflow."
        ]}
        ctaHref="/tools/pdf-to-jpg"
        ctaLabel="Open PDF to JPG tool"
        sections={[
          {
            title: "When image export makes sense",
            paragraphs: [
              "Image output is often easier to reuse in slide decks, design boards, and social content systems where PDF support is limited. It is also practical when recipients only need visual access without document editing.",
              "For reverse conversion, keep JPG pages and rebuild a single document with JPG to PDF. This round-trip path is useful for assembling visual drafts from mixed image sources."
            ]
          }
        ]}
        benefits={[
          "One-image-per-page conversion flow",
          "Clear handling for single and multi-page outputs",
          "ZIP option for faster bulk download",
          "Browser-first processing for typical tasks"
        ]}
        relatedTools={[
          { href: "/tools/jpg-to-pdf", label: "JPG to PDF" },
          { href: "/tools/compress-image", label: "Compress Image" },
          { href: "/tools/merge-pdf", label: "Merge PDF" }
        ]}
      />
    </>
  );
}
