import { getUser } from "@/lib/authz";import { db } from "@/lib/db";import { KINDS } from "@/lib/kinds";
const cell=(v:unknown)=>{let s=v instanceof Date?v.toISOString():String(v??"");if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
export async function GET(_:Request,{params}:{params:{kind:string}}){
 const u=await getUser();if(!u)return new Response("Unauthorized",{status:401});if(u.role!=="ADMIN")return new Response("Forbidden",{status:403});
 const k=KINDS[params.kind];if(!k)return new Response("Not found",{status:404});
 const rows:any[]=await(db as any)[k.model].findMany({orderBy:{createdAt:"desc"}});const cols=(rows[0]?Object.keys(rows[0]):[]).filter(c=>c!=="id"&&c!=="updatedAt");
 const csv=[cols.join(","),...rows.map(r=>cols.map(c=>cell(r[c])).join(","))].join("\n");
 return new Response(csv,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":`attachment; filename="${params.kind}.csv"`,"Cache-Control":"no-store"}})}
