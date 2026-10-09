"use server";
import { z } from "zod";import bcrypt from "bcryptjs";import { redirect } from "next/navigation";import { revalidatePath } from "next/cache";
import { requireEditor,requireAdmin } from "./authz";import { db } from "./db";import { KINDS } from "./kinds";import { DEFAULTS } from "./settings";import { storeImage,removeStored } from "./storage";
const slugify=(t:string)=>t.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,80)||"item";
async function uniqueSlug(m:"article"|"program",t:string){let s=slugify(t),n=1;while(await(db as any)[m].findUnique({where:{slug:s}}))s=slugify(t)+"-"+(++n);return s}
const opt=(n:number)=>z.string().trim().max(n).optional().transform(v=>v||undefined);
// ---- Articles (ADMIN + EDITOR)
const A=z.object({title:z.string().trim().min(3).max(160),excerpt:z.string().trim().min(5).max(300),body:z.string().trim().min(10).max(50000),category:opt(60),imageId:opt(40),seoTitle:opt(70),seoDescription:opt(160)});
export async function saveArticle(fd:FormData){const u=await requireEditor();const id=String(fd.get("id")||"new");
 const r=A.safeParse(Object.fromEntries(fd));if(!r.success)redirect("/admin/articles/"+id+"?error=1");const p=r.data;
 const published=fd.get("published")==="on";const old=id!=="new"?await db.article.findUnique({where:{id}}):null;
 const cat=p.category?await db.articleCategory.upsert({where:{name:p.category},update:{},create:{name:p.category,slug:slugify(p.category)}}):null;
 const data={title:p.title,excerpt:p.excerpt,body:p.body,published,categoryId:cat?.id??null,imageId:p.imageId??null,seoTitle:p.seoTitle??null,seoDescription:p.seoDescription??null};
 if(old)await db.article.update({where:{id},data:data as any});else await db.article.create({data:{...data,slug:await uniqueSlug("article",p.title),authorId:u.id} as any});
 revalidatePath("/news");revalidatePath("/");redirect("/admin/articles")}
export async function deleteArticle(fd:FormData){await requireEditor();await db.article.delete({where:{id:String(fd.get("id"))}});revalidatePath("/news");redirect("/admin/articles")}
// ---- Programs
const P=z.object({title:z.string().trim().min(3).max(120),summary:z.string().trim().min(5).max(300),body:opt(20000),category:opt(60),sortOrder:z.coerce.number().int().min(0).max(999).default(0),imageId:opt(40)});
export async function saveProgram(fd:FormData){await requireEditor();const id=String(fd.get("id")||"new");
 const r=P.safeParse(Object.fromEntries(fd));if(!r.success)redirect("/admin/programs/"+id+"?error=1");const p=r.data;
 const cat=p.category?await db.programCategory.upsert({where:{name:p.category},update:{},create:{name:p.category,slug:slugify(p.category)}}):null;
 const data={title:p.title,summary:p.summary,body:p.body??null,sortOrder:p.sortOrder,published:fd.get("published")==="on",categoryId:cat?.id??null,imageId:p.imageId??null};
 if(id!=="new")await db.program.update({where:{id},data:data as any});else await db.program.create({data:{...data,slug:await uniqueSlug("program",p.title)} as any});
 revalidatePath("/programs");revalidatePath("/");redirect("/admin/programs")}
export async function deleteProgram(fd:FormData){await requireEditor();await db.program.delete({where:{id:String(fd.get("id"))}});revalidatePath("/programs");redirect("/admin/programs")}
// ---- Media
export async function uploadMedia(fd:FormData){await requireEditor();const f=fd.get("file");const alt=String(fd.get("alt")||"").trim();
 if(!(f instanceof File)||!f.size)redirect("/admin/media?error=file");if(alt.length<3||alt.length>200)redirect("/admin/media?error=alt");
 let s:Awaited<ReturnType<typeof storeImage>>|null=null;let err="";try{s=await storeImage(f)}catch(e){err=(e as Error).message}
 if(!s)redirect("/admin/media?error="+(["storage","size","type"].includes(err)?err:"failed"));
 await db.media.create({data:{url:s.url,storageKey:s.key,mimeType:s.mime,sizeBytes:s.size,alt} as any});revalidatePath("/admin/media");redirect("/admin/media?ok=1")}
export async function updateAlt(fd:FormData){await requireEditor();const alt=String(fd.get("alt")||"").trim();if(alt.length<3||alt.length>200)redirect("/admin/media?error=alt");
 await db.media.update({where:{id:String(fd.get("id"))},data:{alt} as any});revalidatePath("/","layout");redirect("/admin/media?ok=1")}
export async function deleteMedia(fd:FormData){await requireEditor();const m=(await db.media.delete({where:{id:String(fd.get("id"))}})) as any;await removeStored(m.storageKey);revalidatePath("/","layout");redirect("/admin/media")}
// ---- Impact
export async function addStat(fd:FormData){await requireEditor();const l=String(fd.get("label")||"").trim().slice(0,80);if(l.length<2)redirect("/admin/impact?error=1");
 await db.impactStat.create({data:{label:l,value:0,verified:false,published:false,sortOrder:99} as any});redirect("/admin/impact?saved=1")}
export async function saveStats(fd:FormData){await requireEditor();
 for(const id of fd.getAll("id").map(String))await db.impactStat.update({where:{id},data:{label:String(fd.get("label_"+id)).slice(0,80),value:Math.max(0,parseInt(String(fd.get("value_"+id)))||0),sortOrder:Math.max(0,parseInt(String(fd.get("order_"+id)))||0),verified:fd.get("verified_"+id)==="on",published:fd.get("published_"+id)==="on"} as any});
 revalidatePath("/impact");revalidatePath("/");redirect("/admin/impact?saved=1")}
export async function deleteStat(fd:FormData){await requireEditor();await db.impactStat.delete({where:{id:String(fd.get("id"))}});revalidatePath("/impact");redirect("/admin/impact")}
const S=z.object({initiative:z.string().trim().min(2).max(160),community:z.string().trim().min(2).max(160),action:z.string().trim().min(2).max(3000),result:z.string().trim().min(2).max(3000),imageId:opt(40),occurredAt:opt(20)});
export async function addStory(fd:FormData){await requireEditor();const r=S.safeParse(Object.fromEntries(fd));if(!r.success)redirect("/admin/impact?error=1");const p=r.data;const d=p.occurredAt?new Date(p.occurredAt):null;
 await db.impactStory.create({data:{initiative:p.initiative,community:p.community,action:p.action,result:p.result,published:fd.get("published")==="on",imageId:p.imageId??null,occurredAt:d&&!isNaN(+d)?d:null} as any});revalidatePath("/impact");redirect("/admin/impact?saved=1")}
export async function deleteStory(fd:FormData){await requireEditor();await db.impactStory.delete({where:{id:String(fd.get("id"))}});revalidatePath("/impact");redirect("/admin/impact")}
// ---- Inbox + settings (ADMIN only)
export async function setStatus(fd:FormData){await requireAdmin();const k=KINDS[String(fd.get("kind"))];const st=String(fd.get("status"));if(!k||!k.statuses.includes(st))return;
 await(db as any)[k.model].update({where:{id:String(fd.get("id"))},data:{status:st}});revalidatePath("/admin/inbox/"+fd.get("kind"))}
const T=(n:number)=>z.string().trim().max(n);const U=z.string().trim().max(300).refine(v=>v===""||/^https:\/\/[^\s]+$/.test(v),"https");
const SET=z.object({foundation_name:T(100).min(2),tagline:T(150),email:z.string().trim().max(200).refine(v=>v===""||/^\S+@\S+\.\S+$/.test(v)),phone:T(40),address:T(250),instagram:U,facebook:U,x:U,linkedin:U,youtube:U,tiktok:U,map_embed_url:U,footer_text:T(300),support_text:T(500)});
export async function saveSettings(fd:FormData){await requireAdmin();const r=SET.safeParse(Object.fromEntries(fd));if(!r.success)redirect("/admin/settings?error=1");
 const all:Record<string,string>={...r.data,show_support_section:fd.get("show_support_section")==="true"?"true":"false"};
 for(const key of Object.keys(DEFAULTS))if(key in all)await db.siteSetting.upsert({where:{key},update:{value:all[key]},create:{key,value:all[key]}});
 revalidatePath("/","layout");redirect("/admin/settings?saved=1")}
// ---- Users (ADMIN only)
const PW=z.string().min(12).max(100).regex(/[a-z]/).regex(/[A-Z]/).regex(/\d/);const ROLE=z.enum(["ADMIN","EDITOR"]);
async function lastAdmin(id:string){return (await db.adminUser.count({where:{role:"ADMIN",active:true,id:{not:id}}}))===0}
export async function createUser(fd:FormData){await requireAdmin();const r=z.object({email:z.string().trim().toLowerCase().email().max(200),name:z.string().trim().min(2).max(80),role:ROLE,password:PW}).safeParse(Object.fromEntries(fd));
 if(!r.success)redirect("/admin/users?error=invalid");if(await db.adminUser.findUnique({where:{email:r.data.email}}))redirect("/admin/users?error=exists");
 await db.adminUser.create({data:{email:r.data.email,name:r.data.name,role:r.data.role,passwordHash:await bcrypt.hash(r.data.password,12)}});redirect("/admin/users?ok=1")}
export async function setRole(fd:FormData){const me=await requireAdmin();const id=String(fd.get("id"));const role=ROLE.parse(fd.get("role"));
 if(role!=="ADMIN"&&(id===me.id||await lastAdmin(id)))redirect("/admin/users?error=last");await db.adminUser.update({where:{id},data:{role}});redirect("/admin/users?ok=1")}
export async function setActive(fd:FormData){const me=await requireAdmin();const id=String(fd.get("id"));const active=fd.get("active")==="true";
 if(!active&&(id===me.id||await lastAdmin(id)))redirect("/admin/users?error=last");await db.adminUser.update({where:{id},data:{active}});redirect("/admin/users?ok=1")}
export async function resetPassword(fd:FormData){await requireAdmin();const p=PW.safeParse(fd.get("password"));if(!p.success)redirect("/admin/users?error=invalid");
 await db.adminUser.update({where:{id:String(fd.get("id"))},data:{passwordHash:await bcrypt.hash(p.data,12)}});redirect("/admin/users?ok=1")}
export async function deleteUser(fd:FormData){const me=await requireAdmin();const id=String(fd.get("id"));if(id===me.id||await lastAdmin(id))redirect("/admin/users?error=last");await db.adminUser.delete({where:{id}});redirect("/admin/users?ok=1")}
