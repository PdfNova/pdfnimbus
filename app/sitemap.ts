import type { MetadataRoute } from "next";

const siteUrl = "https://pdfnimbus.vercel.app";

const now = new Date();

const homepageRoutes = ["/"];

const toolRoutes = [
  "/tools",
  "/tools/merge-pdf",
  "/tools/compress-pdf",
  "/tools/split-pdf",
  "/tools/rotate-pdf",
  "/tools/pdf-to-jpg",
  "/tools/jpg-to-pdf",
  "/tools/compress-image",
  "/tools/qr-generator",
  "/tools/remove-pdf-pages",
  "/tools/protect-pdf",
  "/tools/unlock-pdf",
  "/tools/pdf-to-word",
  "/tools/word-to-pdf",
  "/tools/pdf-to-excel",
  "/tools/excel-to-pdf",
  "/tools/pdf-to-powerpoint",
  "/tools/powerpoint-to-pdf"
];

const guideRoutes = [
  "/guides",
  "/guides/merge-pdf-files",
  "/guides/combine-pdf-pages",
  "/guides/compress-pdf-without-losing-quality",
  "/guides/split-pdf-by-range",
  "/guides/rotate-pdf-pages",
  "/guides/pdf-pages-to-jpg",
  "/guides/merge-pdf-online-free",
  "/guides/merge-pdf-without-software",
  "/guides/merge-pdf-on-mac",
  "/guides/compress-pdf-for-email",
  "/guides/split-pdf-into-pages",
  "/guides/merge-pdf-for-email",
  "/guides/merge-pdf-on-windows",
  "/guides/convert-pdf-to-jpg-online",
  "/guides/combine-images-into-pdf",
  "/guides/pdf-to-word",
  "/guides/convert-pdf-to-word",
  "/guides/word-to-pdf",
  "/guides/convert-word-to-pdf",
  "/guides/remove-pages-from-pdf",
  "/guides/password-protect-pdf",
  "/guides/protect-pdf-for-email",
  "/guides/how-to-lock-a-pdf-file",
  "/guides/unlock-pdf",
  "/guides/remove-password-from-pdf",
  "/guides/unlock-pdf-for-printing",
  "/guides/pdf-to-excel",
  "/guides/convert-pdf-to-excel",
  "/guides/excel-to-pdf",
  "/guides/convert-excel-to-pdf",
  "/guides/pdf-to-powerpoint",
  "/guides/convert-pdf-to-powerpoint",
  "/guides/powerpoint-to-pdf",
  "/guides/convert-powerpoint-to-pdf"
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
