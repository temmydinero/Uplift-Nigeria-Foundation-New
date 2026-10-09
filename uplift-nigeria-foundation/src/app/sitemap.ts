import type { MetadataRoute } from "next";import { db,safe } from "@/lib/db";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const b=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";
 const a=await safe(()=>db.article.findMany({where:{published:true,publishedAt:{lte:new Date()}},select:{slug:true,updatedAt:true}}),[]);
 return[...["","/about","/programs","/impact","/news","/involved","/contact","/privacy","/terms"].map(p=>({url:b+p})),...a.map(x=>({url:b+"/news/"+x.slug,lastModified:x.updatedAt}))]}
