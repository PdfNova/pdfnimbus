import type { Metadata } from "next";
import { GuidePageTemplate } from "@/app/guides/_components/guide-page-template";
import { buildToolMetadata } from "@/lib/seo";

const title = "How to Compress PDF for Email";
const description = "Reduce PDF size for email attachments quickly with PDFNimbus browser-based compression.";

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
    { "@type": "HowToStep", text: "Open Compress PDF in PDFNimbus." },
    { "@type": "HowToStep", text: "Upload the file and choose a compression level." },
    { "@type": "HowToStep", text: "Run compression and review output size." },
    { "@type": "HowToStep", text: "Download the smaller PDF and attach it to email." }
  ]
};

export const metadata: Metadata = buildToolMetadata({
  title,
  description,
  canonicalPath: "/guides/compress-pdf-for-email"
});

export default function CompressPdfForEmailGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleJsonLd, howToJsonLd]) }} />
      <GuidePageTemplate
        currentGuideHref="/guides/compress-pdf-for-email"
        
        title={title}
        intro={[
          "Email providers often reject large attachments, so compressing PDF files before sending is a practical fix.",
          "PDFNimbus lets you shrink PDF size quickly and compare original vs compressed output before download."
        ]}
        steps={[
          "Open Compress PDF and upload your file.",
          "Select a level (start with recommended).",
          "Compress and check size reduction.",
          "Download and attach the optimized PDF to your email."
        ]}
        ctaHref="/tools/compress-pdf"
        ctaLabel="Compress your PDF now"
        benefits={[
          "Smaller files for email limits",
          "Clear size comparison",
          "Fast browser-based flow",
          "Simple quality/size tradeoff control"
        ]}
        relatedTools={[
          { href: "/tools/merge-pdf", label: "Merge PDF" },
          { href: "/tools/split-pdf", label: "Split PDF" },
          { href: "/tools/pdf-to-jpg", label: "PDF to JPG" }
        ]}
        relatedGuides={[
          { href: "/guides/compress-pdf-without-losing-quality", label: "How to Compress PDF Without Losing Quality" },
          { href: "/guides/merge-pdf-files", label: "How to Merge PDF Files Online" }
        ]}
        faqItems={[
          { question: "Will compression always reduce quality?", answer: "Quality depends on level; recommended mode balances readability and size." },
          { question: "Is this useful for Gmail/Outlook limits?", answer: "Yes, this guide targets common email attachment constraints." },
          { question: "Can I compress again if needed?", answer: "Yes, you can rerun with a stronger level if size is still high." }
        ]}
      />
    </>
  );
}

