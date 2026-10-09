import MediaImage from "@/components/MediaImage";import Link from "next/link";import { meta } from "@/lib/meta";import { db,safe } from "@/lib/db";
export const metadata=meta("News & Activities","News, events and community activities from Uplift Nigeria Foundation.","/news");export const revalidate=60;
export default async function News(){const a=await safe(()=>db.article.findMany({where:{published:true,publishedAt:{lte:new Date()}},orderBy:{publishedAt:"desc"},include:{image:true,category:true}}),[]);
 return <section className="sec"><div className="wrap"><p className="tag">News &amp; activities</p><h1 className="mb-8 mt-2">Latest from the Foundation</h1>
 {a.length===0?<p className="muted">No articles published yet. Please check back soon.</p>:<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{a.map(x=><article key={x.id} className="card">
 {x.image?<MediaImage src={x.image.url} alt={x.image.alt} className="mb-3 aspect-video w-full rounded-xl object-cover"/>:<div className="ph mb-3 !aspect-video !rounded-xl">No image</div>}
 <p className="text-xs"><span className="rounded-full bg-brand/10 px-3 py-1 font-semibold text-brand">{x.category?.name||"News"}</span> <time dateTime={x.publishedAt?.toISOString()}>{x.publishedAt?.toLocaleDateString("en-NG",{dateStyle:"medium"})}</time></p>
 <h3 className="mt-2"><Link href={"/news/"+x.slug}>{x.title}</Link></h3><p className="muted my-2">{x.excerpt}</p><Link href={"/news/"+x.slug} className="font-semibold text-brand">Read more →</Link></article>)}</div>}</div></section>}
