import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Convert PDF to JPG Online";
const description = "Convert PDF pages to JPG online with clear preview and download options using PDFNimbus.";

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
    { "@type": "HowToStep", text: "Open PDF to JPG in PDFNimbus." },
    { "@type": "HowToStep", text: "Upload your PDF and review preview/page count." },
    { "@type": "HowToStep", text: "Convert pages to JPG outputs." },
    { "@type": "HowToStep", text: "Download single images or ZIP for multi-page files." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/convert-pdf-to-jpg-online"
});

export default function ConvertPdfToJpgOnlineGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/convert-pdf-to-jpg-online"
        title={title}
        intro={[
          "Converting PDF to JPG online is useful for presentations, design boards, and image-first sharing workflows.",
          "PDFNimbus lets you export one JPG per page and download results clearly as files or ZIP."
        ]}
        steps={[
          "Open PDF to JPG tool.",
          "Upload PDF and confirm preview.",
          "Run conversion.",
          "Download image outputs."
        ]}
        ctaHref="/tools/pdf-to-jpg"
        ctaLabel="Use the PDF to JPG tool"
        benefits={[
          "One image per page output",
          "Clear download options",
          "Fast browser-based conversion",
          "Useful for design and share workflows"
        ]}
        relatedTools={[
          { href: "/tools/jpg-to-pdf", label: "JPG to PDF" },
          { href: "/tools/compress-image", label: "Compress Image" },
          { href: "/tools/merge-pdf", label: "Merge PDF" }
        ]}
        relatedGuides={[
          { href: "/guides/pdf-pages-to-jpg", label: "How to Convert PDF Pages to JPG Images" },
          { href: "/guides/combine-images-into-pdf", label: "How to Combine Images into PDF" }
        ]}
        faqItems={[
          { question: "Will each PDF page become a JPG?", answer: "Yes, each page is exported as a separate JPG output." },
          { question: "Can I download all at once?", answer: "Yes, multi-page outputs can be downloaded as ZIP." },
          { question: "Is this browser-based?", answer: "Yes, it is designed for browser-first processing." }
        ]}
      />
    </>
  );
}
