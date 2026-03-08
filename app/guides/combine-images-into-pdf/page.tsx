import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Combine Images into PDF";
const description = "Turn multiple JPG or PNG images into one PDF quickly using PDFNimbus JPG to PDF.";

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
    { "@type": "HowToStep", text: "Open JPG to PDF in PDFNimbus." },
    { "@type": "HowToStep", text: "Upload JPG or PNG files." },
    { "@type": "HowToStep", text: "Reorder image cards to define PDF page order." },
    { "@type": "HowToStep", text: "Convert and download the final PDF." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/combine-images-into-pdf"
});

export default function CombineImagesIntoPdfGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/combine-images-into-pdf"
        title={title}
        intro={[
          "Combining images into one PDF is useful for reports, receipts, and scan-like submissions.",
          "PDFNimbus lets you upload image files, set order visually, and export one clean PDF in seconds."
        ]}
        steps={[
          "Open JPG to PDF.",
          "Upload all images for the final document.",
          "Arrange order and run conversion.",
          "Download the generated PDF."
        ]}
        ctaHref="/tools/jpg-to-pdf"
        ctaLabel="Use the JPG to PDF tool"
        benefits={[
          "Simple image-to-document workflow",
          "Visual page-order control",
          "One final PDF output",
          "Browser-based conversion"
        ]}
        relatedTools={[
          { href: "/tools/pdf-to-jpg", label: "PDF to JPG" },
          { href: "/tools/compress-image", label: "Compress Image" },
          { href: "/tools/merge-pdf", label: "Merge PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/convert-pdf-to-jpg-online", label: "How to Convert PDF to JPG Online" },
          { href: "/guides/pdf-pages-to-jpg", label: "How to Convert PDF Pages to JPG Images" }
        ]}
        faqItems={[
          { question: "Can I combine many images?", answer: "Yes, add multiple JPG/PNG files and export one PDF." },
          { question: "Can I control page order?", answer: "Yes, reorder image cards before conversion." },
          { question: "Is PNG also supported?", answer: "Yes, JPG and PNG are supported in the tool." }
        ]}
      />
    </>
  );
}
