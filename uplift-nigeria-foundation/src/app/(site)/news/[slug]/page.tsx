import MediaImage from "@/components/MediaImage";import { notFound } from "next/navigation";import { db,safe } from "@/lib/db";import { meta } from "@/lib/meta";
export const revalidate=60;
const get=(slug:string)=>safe(()=>db.article.findFirst({where:{slug,published:true,publishedAt:{lte:new Date()}},include:{image:true,category:true}}),null);
export async function generateMetadata({params}:{params:{slug:string}}){const a=await get(params.slug);if(!a)return{};const m=meta(a.seoTitle||a.title,a.seoDescription||a.excerpt,"/news/"+a.slug);return a.image?{...m,openGraph:{...m.openGraph,type:"article" as const,images:[{url:a.image.url,alt:a.image.alt}]}}:m}
export default async function Post({params}:{params:{slug:string}}){const a=await get(params.slug);if(!a)notFound();
 const ld={"@context":"https://schema.org","@type":"NewsArticle",headline:a.title,datePublished:a.publishedAt?.toISOString(),publisher:{"@type":"Organization",name:"Uplift Nigeria Foundation"}};
 return <article className="sec"><div className="wrap max-w-3xl"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld).replace(/</g,"\\u003c")}}/>
 <p className="tag">{a.category?.name||"News"} · {a.publishedAt?.toLocaleDateString("en-NG",{dateStyle:"long"})}</p><h1 className="my-3 !text-4xl">{a.title}</h1>
 {a.image&&<MediaImage src={a.image.url} alt={a.image.alt} className="my-6 w-full rounded-2xl"/>}
 {a.body.split(/\n{2,}/).map((p,i)=><p key={i} className="my-4 leading-8">{p}</p>)}</div></article>}
