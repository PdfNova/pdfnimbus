import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function getSiteUrl() {
  return siteUrl;
}

export function buildToolMetadata({
  title,
  description,
  canonicalPath
}: {
  title: string;
  description: string;
  canonicalPath: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: "PDFNova",
      type: "website",
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: "PDFNova"
        }
      ]
    }
  };
}
