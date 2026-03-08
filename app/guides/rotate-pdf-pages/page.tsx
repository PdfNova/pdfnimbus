import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Rotate PDF Pages Online";
const description =
  "A concise guide to rotating PDF pages online with live preview and page-level controls using PDFNimbus.";

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
  canonicalPath: "/guides/rotate-pdf-pages"
});

export default function RotatePdfPagesGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/rotate-pdf-pages"
        
        title={title}
        intro={[
          "If PDF pages appear sideways or upside down, rotation is the quickest fix before sharing or printing. This is common with scans from mobile cameras, mixed-source reports, and exported documents with inconsistent page orientation.",
          "PDFNimbus lets you rotate PDF pages online with visual preview, so you can confirm changes before download. You can apply adjustments page by page or rotate all pages when the same orientation fix is needed across the whole file."
        ]}
        steps={[
          "Open Rotate PDF and upload your file.",
          "Use page controls to rotate individual pages, or apply a global rotate-all step.",
          "Review previews to confirm final orientation.",
          "Reset any page or all pages if needed before export.",
          "Download the rotated PDF file once orientation looks correct."
        ]}
        ctaHref="/tools/rotate-pdf"
        ctaLabel="Open Rotate PDF tool"
        sections={[
          {
            title: "Best practices before export",
            paragraphs: [
              "Check pages that include tables, signatures, or diagrams because orientation issues are easier to miss in content-heavy files. A fast preview pass helps ensure every page is comfortable to read.",
              "When working with long documents, fix obvious page groups first and then spot-check the rest. This keeps the workflow efficient while maintaining output quality and usability."
            ]
          }
        ]}
        benefits={[
          "Per-page and global rotation controls",
          "Live visual confirmation before download",
          "Quick fixes for scan orientation issues",
          "Browser-first flow for typical use"
        ]}
        relatedTools={[
          { href: "/tools/split-pdf", label: "Split PDF" },
          { href: "/tools/merge-pdf", label: "Merge PDF" },
          { href: "/tools/compress-pdf", label: "Compress PDF" }
        ]}
      />
    </>
  );
}



