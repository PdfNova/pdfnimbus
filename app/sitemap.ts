import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();

  const paths = [
    "/",
    "/tools",
    "/tools/merge-pdf",
    "/tools/compress-pdf",
    "/tools/split-pdf",
    "/tools/rotate-pdf",
    "/tools/pdf-to-jpg",
    "/tools/jpg-to-pdf",
    "/tools/qr-generator",
    "/tools/compress-image",
    "/privacy-policy",
    "/terms-and-conditions",
    "/cookies",
    "/security",
    "/about",
    "/contact"
  ];

  return paths.map((path) => ({
    url: `${site}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7
  }));
}
