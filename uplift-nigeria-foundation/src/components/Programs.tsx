import MediaImage from "@/components/MediaImage";
import Link from "next/link";
import Icon from "./Icon";
import { db, safe } from "@/lib/db";
import { PROGRAMS } from "@/lib/content";

export default async function Programs(){
 const rows = await safe(() => (db.program as any).findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }), []);
 const list = rows.length ? rows.map((r: any) => ({ title: r.title, slug: r.slug, summary: r.summary || r.description, img: undefined, alt: undefined })) : PROGRAMS.map(p => ({...p, img: undefined, alt: undefined}));
 
 return (
   <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
     {list.map(p => (
       <article key={p.slug} className="card">
         {p.img ? (
           <MediaImage src={p.img} alt={p.alt || p.title} className="mb-4 aspect-video w-full rounded-xl object-cover"/>
         ) : (
           <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
             <Icon slug={p.slug}/>
           </div>
         )}
         <h3>{p.title}</h3>
         <p className="muted my-2">{p.summary}</p>
         <Link href="/contact" className="font-semibold text-brand">Learn More →</Link>
       </article>
     ))}
   </div>
 );
}
