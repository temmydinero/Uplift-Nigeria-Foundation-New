import { headers } from "next/headers";
const mem=new Map<string,number[]>();
let warned=false;
function local(key:string,max:number,windowMs:number){const now=Date.now(),a=(mem.get(key)||[]).filter(x=>now-x<windowMs);a.push(now);mem.set(key,a);if(mem.size>5000)mem.clear();return a.length>max}
// Returns true when the caller must be blocked. Upstash Redis (REST) is used when UPSTASH_REDIS_REST_URL and
// UPSTASH_REDIS_REST_TOKEN are set: SET NX PX creates the window, INCR counts (atomic, works on every Redis version).
// If Upstash is missing or fails, the per-instance in-memory limiter is used, so protection is never switched off.
export async function limited(bucket:string,max=5,windowMs=10*60*1000):Promise<boolean>{
 const h=headers();const ip=(h.get("x-forwarded-for")?.split(",")[0]||h.get("x-real-ip")||"unknown").trim().slice(0,64);const key="rl:"+bucket+":"+ip;
 const u=process.env.UPSTASH_REDIS_REST_URL,t=process.env.UPSTASH_REDIS_REST_TOKEN;
 if(u&&t){try{
  const r=await fetch(u.replace(/\/$/,"")+"/pipeline",{method:"POST",headers:{Authorization:"Bearer "+t,"Content-Type":"application/json"},cache:"no-store",signal:AbortSignal.timeout(2000),body:JSON.stringify([["SET",key,"0","PX",windowMs,"NX"],["INCR",key]])});
  const j=await r.json();const n=Array.isArray(j)?j[1]?.result:undefined;
  if(r.ok&&typeof n==="number")return n>max;
 }catch{}}
 else if(process.env.NODE_ENV==="production"&&!warned){warned=true;console.warn("[ratelimit] Upstash not configured: using per-instance in-memory limits. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.")}
 return local(key,max,windowMs)}
