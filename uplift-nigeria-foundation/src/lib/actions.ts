"use server";
import { z } from "zod";
import { db } from "./db";
import { limited } from "./ratelimit";
type R={ok?:boolean;error?:string};
const recent=()=>new Date(Date.now()-10*60*1000); // identical resubmissions within 10 min are treated as already received
const opt=z.string().trim().max(200).optional().transform(v=>v||undefined);
const msg=z.string().trim().max(3000).optional().transform(v=>v||undefined);
const S={
 volunteer:z.object({fullName:z.string().trim().min(2).max(120),email:z.string().trim().email().max(200),phone:opt,location:opt,interest:z.string().trim().min(2).max(100),availability:opt,message:msg}),
 partner:z.object({organization:z.string().trim().min(2).max(160),contactPerson:z.string().trim().min(2).max(120),email:z.string().trim().email().max(200),phone:opt,partnershipType:z.string().trim().min(2).max(100),message:msg}),
 contact:z.object({name:z.string().trim().min(2).max(120),email:z.string().trim().email().max(200),phone:opt,subject:z.string().trim().min(2).max(160),message:z.string().trim().min(5).max(3000)}),
};
async function handle<T extends z.ZodTypeAny>(bucket:string,schema:T,fd:FormData,save:(d:z.infer<T>)=>Promise<unknown>,dupe?:(d:z.infer<T>)=>Promise<unknown>):Promise<R>{
  if(fd.get("website"))return{ok:true};
  if(await limited(bucket))return{error:"Too many submissions. Please try again in a few minutes."};
  const p=schema.safeParse(Object.fromEntries(fd));
  if(!p.success)return{error:"Please check the form: "+p.error.issues[0].path.join(".")+" is invalid or missing."};
  try{if(dupe&&await dupe(p.data))return{ok:true};await save(p.data);return{ok:true}}catch{return{error:"Something went wrong. Please try again later."}}
}
export async function submitVolunteer(_:R,fd:FormData){return handle("vol",S.volunteer,fd,d=>(db.volunteer as any).create({data:d}),d=>(db.volunteer as any).findFirst({where:{email:d.email,interest:d.interest,message:d.message??null,createdAt:{gt:recent()}}}))}
export async function submitPartner(_:R,fd:FormData){return handle("par",S.partner,fd,d=>(db.partnershipRequest as any).create({data:d}),d=>(db.partnershipRequest as any).findFirst({where:{email:d.email,organization:d.organization,message:d.message??null,createdAt:{gt:recent()}}}))}
export async function submitContact(_:R,fd:FormData){return handle("con",S.contact,fd,d=>(db.contactMessage as any).create({data:d}),d=>(db.contactMessage as any).findFirst({where:{email:d.email,subject:d.subject,message:d.message,createdAt:{gt:recent()}}}))}
