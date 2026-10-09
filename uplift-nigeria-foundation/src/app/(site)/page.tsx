import MediaImage from "@/components/MediaImage";
import Link from "next/link";
import Programs from "@/components/Programs";
import Photo from "@/components/Photo";
import { getSettings } from "@/lib/settings";
import { db,safe } from "@/lib/db";
import { APPROACH } from "@/lib/content";

export const metadata={title:{absolute:"Uplift Nigeria Foundation | Uplifting Lives. Strengthening Communities."},description:"Uplift Nigeria Foundation is a Nigerian charitable foundation working to improve lives and strengthen communities.",alternates:{canonical:"/"},openGraph:{title:"Uplift Nigeria Foundation",description:"Uplifting Lives. Strengthening Communities.",url:"/",type:"website" as const,siteName:"Uplift Nigeria Foundation"}};
export const revalidate=60;

export default async function Home(){
 const s=await getSettings();
 const stats=await safe(()=>db.impactStat.findMany({where:{published:true},orderBy:{sortOrder:"asc"}}),[]);
 const news=await safe(()=>db.article.findMany({where:{published:true},orderBy:{createdAt:"desc"},take:3,include:{category:true,image:true}}),[]);

 return <>
 <section className="dark-sec relative isolate overflow-hidden text-white"><Photo name="hero" alt="" priority className="absolute inset-0 -z-20 h-full w-full"/><div className="absolute inset-0 -z-10 bg-[#0b2e22]/75"/>
  <div className="wrap max-w-3xl py-24 md:py-40"><p className="tag">Nigerian charitable foundation</p><h1 className="mt-3 text-white">Uplifting Lives. Strengthening Communities.</h1>
  <p className="mt-5 max-w-xl text-lg text-white/90">Uplift Nigeria Foundation works to improve lives, empower communities, and create meaningful opportunities for vulnerable people across Nigeria.</p>
  <div className="mt-8 flex flex-wrap gap-3"><Link href="/programs" className="btn">Discover Our Work</Link><Link href="/involved" className="btn btn-o !text-white">Get Involved</Link></div></div></section>
 <section className="sec"><div className="wrap grid items-center gap-12 md:grid-cols-2"><Photo name="community" alt="A smiling child with other children behind" sizes="(min-width:768px) 50vw, 100vw" className="aspect-[4/3] w-full rounded-3xl"/>
  <div><p className="tag">Who we are</p><h2 className="mt-2">We Believe Every Life Deserves an Opportunity to Thrive.</h2><p className="muted my-5">Uplift Nigeria Foundation is committed to creating meaningful change through practical, community-focused initiatives: listening first, identifying genuine needs, and working alongside the people we serve.</p><Link href="/about" className="btn">Learn More About Us</Link></div></div></section>
 <section className="sec bg-brand/5"><div className="wrap"><p className="tag">Our programs</p><h2 className="mb-8 mt-2">What We Do</h2><Programs/></div></section>
 <section className="sec"><div className="wrap"><p className="tag">Our approach</p><h2 className="mb-8 mt-2">How We Work</h2><ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{APPROACH.map(([t,d],i)=><li key={t} className="border-t-4 border-accent pt-4"><span className="font-serif text-3xl text-brand">0{i+1}</span><h3 className="mt-1">{t}</h3><p className="muted">{d}</p></li>)}</ol></div></section>
 <section className="dark-sec sec bg-brand text-white"><div className="wrap"><p className="tag">Our impact</p><h2 className="mb-8 mt-2 text-white">Results We Can Stand Behind</h2>
  {stats.length?<dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{stats.map(x=><div key={x.id}><dd className="font-serif text-5xl">{x.value}{x.suffix}</dd><dt className="text-white/80">{x.label}</dt></div>)}</dl>:<p className="max-w-xl text-white/85">We share only verified results. Follow our activities below as we document our work with the communities we serve.</p>}
  <Link href="/impact" className="btn mt-8">See our impact</Link></div></section>
 <section className="sec"><div className="wrap"><p className="tag">Latest activities</p><h2 className="mb-8 mt-2">News &amp; Updates</h2>
  {news.length===0?<p className="muted">New activities and announcements will be shared here.</p>:<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{news.map(x=><article key={x.id} className="card">{x.image&&<MediaImage src={x.image.url} alt={x.image.alt} className="mb-3 aspect-video w-full rounded-xl object-cover"/>}<span className="text-xs font-semibold text-brand">{x.category?.name||"News"}</span><h3 className="mt-1"><Link href={"/news/"+x.slug}>{x.title}</Link></h3><p className="muted mt-2">{x.excerpt}</p></article>)}</div>}
  <Link href="/news" className="mt-6 inline-block font-semibold text-brand">All news →</Link></div></section>
 <section className="sec bg-brand/5"><div className="wrap"><p className="tag">Get involved</p><h2 className="mb-8 mt-2">Be Part of the Work</h2><div className="grid gap-5 md:grid-cols-2">
  <div className="card"><h3>Volunteer</h3><p className="muted my-2">Share your time and skills with community initiatives.</p><Link href="/involved#volunteer" className="font-semibold text-brand">Volunteer with us →</Link></div>
  <div className="card"><h3>Partner With Us</h3><p className="muted my-2">Organizations and institutions can collaborate with the foundation.</p><Link href="/involved#partner" className="font-semibold text-brand">Explore partnerships →</Link></div></div></div></section>
 {s.show_support_section==="true"&&<section className="sec"><div className="wrap max-w-2xl text-center"><h2>Support Our Work</h2><p className="muted mt-3">{s.support_text||"Individuals and organizations can support the foundation's work. Contact us to learn how."}</p><Link href="/contact" className="btn mt-5">Contact Us</Link></div></section>}
 <section className="sec"><div className="wrap max-w-2xl text-center"><h2>Together, we can uplift lives.</h2><p className="muted my-4">Questions about our work or how to take part? We would love to hear from you.</p><Link href="/contact" className="btn">Contact the Foundation</Link></div></section></>}
