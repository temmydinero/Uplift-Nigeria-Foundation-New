import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const baseUrl = rawUrl && rawUrl.trim() !== "" ? rawUrl : "http://localhost:3000";
  const sitemapUrl = new URL("/sitemap.xml", baseUrl).toString();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: sitemapUrl,
  };
}
