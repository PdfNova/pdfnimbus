import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Merge PDF Online Free";
const description = "Merge PDF files online for free with a fast browser-first workflow in PDFNimbus.";

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
    { "@type": "HowToStep", text: "Open the Merge PDF tool." },
    { "@type": "HowToStep", text: "Upload all PDF files and reorder cards." },
    { "@type": "HowToStep", text: "Choose output page size and run merge." },
    { "@type": "HowToStep", text: "Download the merged PDF file." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/merge-pdf-online-free"
});

export default function MergePdfOnlineFreeGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/merge-pdf-online-free"
        
        title={title}
        intro={[
          "You can merge PDF files online for free when you need one clean document for upload, sharing, or archiving.",
          "PDFNimbus gives you a browser-first merge flow with visual ordering so you can combine files quickly without extra software."
        ]}
        steps={[
          "Open Merge PDF in PDFNimbus.",
          "Upload all PDFs you want to combine.",
          "Drag cards into final order and select page-size mode.",
          "Merge and download the final PDF."
        ]}
        ctaHref="/tools/merge-pdf"
        ctaLabel="Use the Merge PDF tool"
        benefits={[
          "Free workflow for common merge tasks",
          "Visual file order before export",
          "Fast browser-based processing",
          "No heavy software setup"
        ]}
        relatedTools={[
          { href: "/tools/split-pdf", label: "Split PDF" },
          { href: "/tools/compress-pdf", label: "Compress PDF" },
          { href: "/tools/rotate-pdf", label: "Rotate PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/merge-pdf-files", label: "How to Merge PDF Files Online" },
          { href: "/guides/combine-pdf-pages", label: "How to Combine PDF Pages" }
        ]}
        faqItems={[
          { question: "Is this merge workflow free?", answer: "Yes, you can run the tool for free in your browser." },
          { question: "Are files uploaded for normal use?", answer: "Typical processing is browser-first for standard workflows." },
          { question: "Can I use this on mobile?", answer: "Yes, modern mobile browsers work, though desktop is easier for large files." }
        ]}
      />
    </>
  );
}

