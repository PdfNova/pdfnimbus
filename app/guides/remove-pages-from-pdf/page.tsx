import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Remove Pages from PDF";
const description = "Remove unwanted pages from a PDF quickly with the browser-first PDFNimbus workflow.";

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
    { "@type": "HowToStep", text: "Open Remove PDF Pages in PDFNimbus." },
    { "@type": "HowToStep", text: "Upload your PDF file." },
    { "@type": "HowToStep", text: "Choose pages to remove and run export." },
    { "@type": "HowToStep", text: "Download the updated PDF." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/remove-pages-from-pdf"
});

export default function RemovePagesFromPdfGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/remove-pages-from-pdf"
        title={title}
        intro={[
          "If your PDF includes cover pages, blanks, or unnecessary sections, removing selected pages can make the file easier to share.",
          "PDFNimbus provides a browser-first route for this task with simple selection and export flow."
        ]}
        steps={[
          "Open the Remove PDF Pages tool.",
          "Upload the source PDF.",
          "Select pages to remove and apply changes.",
          "Download the updated PDF."
        ]}
        ctaHref="/tools/remove-pdf-pages"
        ctaLabel="Use the Remove PDF Pages tool"
        benefits={[
          "Cleaner PDFs for sharing",
          "Quick page cleanup",
          "Browser-based workflow",
          "No heavy setup"
        ]}
        relatedTools={[
          { href: "/tools/split-pdf", label: "Split PDF" },
          { href: "/tools/merge-pdf", label: "Merge PDF" },
          { href: "/tools/compress-pdf", label: "Compress PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/split-pdf-into-pages", label: "How to Split PDF into Pages" },
          { href: "/guides/merge-pdf-files", label: "How to Merge PDF Files Online" }
        ]}
        faqItems={[
          { question: "Can I remove multiple pages at once?", answer: "Yes, select all pages you want removed before exporting." },
          { question: "Will page order remain intact?", answer: "Yes, remaining pages keep their sequence after removal." },
          { question: "Can I do this for free?", answer: "Yes, this browser-based route is available for free usage." }
        ]}
      />
    </>
  );
}
