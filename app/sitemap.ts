import type { MetadataRoute } from "next";

const siteUrl = "https://pdfnimbus.vercel.app";

const now = new Date();

const homepageRoutes = ["/"];

const toolRoutes = [
  "/tools/merge-pdf",
  "/tools/compress-pdf",
  "/tools/split-pdf",
  "/tools/rotate-pdf",
  "/tools/pdf-to-jpg",
  "/tools/jpg-to-pdf",
  "/tools/compress-image",
  "/tools/qr-generator"
];

const guideRoutes = [
  "/guides/merge-pdf-files",
  "/guides/combine-pdf-pages",
  "/guides/compress-pdf-without-losing-quality",
  "/guides/split-pdf-by-range",
  "/guides/rotate-pdf-pages",
  "/guides/pdf-pages-to-jpg"
];

const legalCompanyRoutes = [
  "/privacy-policy",
  "/terms-and-conditions",
  "/cookies",
  "/security",
  "/about",
  "/contact"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...homepageRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1.0
    })),
    ...toolRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9
    })),
    ...guideRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...legalCompanyRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5
    }))
  ];
}
