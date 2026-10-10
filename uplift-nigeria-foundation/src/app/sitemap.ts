import type { MetadataRoute } from "next";
import { db, safe } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const baseUrl = rawUrl && rawUrl.trim() !== "" ? rawUrl : "http://localhost:3000";

  const a = await safe(
    () => (db.article as any).findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    []
  );

  const staticPaths = ["", "/about", "/programs", "/impact", "/news", "/involved", "/contact", "/privacy", "/terms"];
  
  const staticPages = staticPaths.map((p) => ({
    url: new URL(p, baseUrl).toString(),
  }));

  const articlePages = a.map((x: any) => ({
    url: new URL(`/news/${x.slug}`, baseUrl).toString(),
    ...(x.updatedAt ? { lastModified: new Date(x.updatedAt) } : {}),
  }));

  return [...staticPages, ...articlePages];
}

