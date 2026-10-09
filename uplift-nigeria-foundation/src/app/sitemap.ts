import type { MetadataRoute } from "next";
import { db, safe } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const b = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const a = await safe(() => (db.article as any).findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }), []);

  const staticPages = ["", "/about", "/programs", "/impact", "/news", "/involved", "/contact", "/privacy", "/terms"].map((p) => ({
    url: b + p,
  }));

  const articlePages = a.map((x: any) => ({
    url: b + "/news/" + x.slug,
    ...(x.updatedAt ? { lastModified: x.updatedAt } : {}),
  }));

  return [...staticPages, ...articlePages];
}
