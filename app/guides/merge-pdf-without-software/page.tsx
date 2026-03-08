import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Merge PDF Without Software";
const description = "Combine PDF files without installing software using the PDFNimbus browser-first Merge PDF tool.";

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
    { "@type": "HowToStep", text: "Open PDFNimbus Merge PDF in your browser." },
    { "@type": "HowToStep", text: "Upload PDFs and reorder files visually." },
    { "@type": "HowToStep", text: "Run merge with your preferred page-size option." },
    { "@type": "HowToStep", text: "Download the merged output." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/merge-pdf-without-software"
});

export default function MergePdfWithoutSoftwareGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/merge-pdf-without-software"
        
        title={title}
        intro={[
          "If you want to merge PDFs without installing apps, a browser-first workflow is usually the fastest option.",
          "PDFNimbus lets you upload, order, and merge documents directly in-browser for common daily tasks."
        ]}
        steps={[
          "Go to Merge PDF on PDFNimbus.",
          "Add all PDFs that should be in the final file.",
          "Arrange order and choose output sizing mode.",
          "Merge and download the resulting PDF."
        ]}
        ctaHref="/tools/merge-pdf"
        ctaLabel="Merge PDF without software"
        benefits={[
          "No installation needed",
          "Simple visual order control",
          "Quick export flow",
          "Works on modern browsers"
        ]}
        relatedTools={[
          { href: "/tools/split-pdf", label: "Split PDF" },
          { href: "/tools/compress-pdf", label: "Compress PDF" },
          { href: "/tools/pdf-to-jpg", label: "PDF to JPG" }
        ]}
        relatedGuides={[
          { href: "/guides/merge-pdf-online-free", label: "How to Merge PDF Online Free" },
          { href: "/guides/merge-pdf-files", label: "How to Merge PDF Files Online" }
        ]}
        faqItems={[
          { question: "Do I need to install anything?", answer: "No. You can run this merge flow entirely in your browser." },
          { question: "Can I reorder files before merge?", answer: "Yes, set order with drag-and-drop cards before exporting." },
          { question: "Is this useful for quick admin tasks?", answer: "Yes, it is designed for fast day-to-day document packaging." }
        ]}
      />
    </>
  );
}

