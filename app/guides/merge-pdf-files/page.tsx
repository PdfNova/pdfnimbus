import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Merge PDF Files Online";
const description =
  "Learn how to merge multiple PDF files online in a clean browser-first workflow using PDFNimbus.";

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
  name: "How to merge PDF files online",
  description,
  step: [
    { "@type": "HowToStep", text: "Upload all PDF files you want to combine." },
    { "@type": "HowToStep", text: "Reorder file cards to match the final document order." },
    { "@type": "HowToStep", text: "Choose output page sizing and run merge." },
    { "@type": "HowToStep", text: "Download the merged PDF file." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/merge-pdf-files"
});

export default function MergePdfFilesGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }}
      />
      <GuidePageTemplate
        currentGuideHref="/guides/merge-pdf-files"
        
        title={title}
        intro={[
          "If you need to combine invoices, signed pages, project exports, or form packets, merging PDFs is usually the fastest way to produce one shareable file. A clean merged document also makes uploads easier when a portal accepts only a single PDF.",
          "With PDFNimbus, you can merge PDF files online in a browser-first flow. You upload your files, preview them, set the final order visually, and export the merged document in a few clicks. For normal usage, you keep control of files locally while working through a clear, practical interface."
        ]}
        steps={[
          "Open the Merge PDF tool and upload all PDF files you want to combine.",
          "Review file cards, then drag and drop to set the final page order.",
          "Choose page sizing behavior: keep original sizes, normalize to A4, or normalize to Letter.",
          "Run merge and wait for the merged file to be generated.",
          "Download the final PDF and verify page sequence before sharing."
        ]}
        ctaHref="/tools/merge-pdf"
        ctaLabel="Open Merge PDF tool"
        sections={[
          {
            title: "When this workflow is most useful",
            paragraphs: [
              "Merging is especially useful when your pages are already final and you only need to package them. Typical examples are combining a cover sheet with appendices, joining multiple reports into one submission, or unifying separate scans into one document.",
              "If your files also need optimization, merge first for structure, then run compression if needed for size. If you need extraction instead, use split before or after merge depending on your process."
            ]
          }
        ]}
        benefits={[
          "Visual file ordering before export",
          "Fast browser-first workflow for normal tasks",
          "No mandatory account to complete basic merges",
          "Flexible output sizing for cleaner print consistency"
        ]}
        relatedTools={[
          { href: "/tools/compress-pdf", label: "Compress PDF" },
          { href: "/tools/split-pdf", label: "Split PDF" },
          { href: "/tools/rotate-pdf", label: "Rotate PDF" }
        ]}
      />
    </>
  );
}

