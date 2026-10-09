import { S3Client,PutObjectCommand,DeleteObjectCommand } from "@aws-sdk/client-s3";import { randomUUID } from "crypto";
const E=process.env;export const storageReady=()=>!!(E.STORAGE_BUCKET&&E.STORAGE_ACCESS_KEY_ID&&E.STORAGE_SECRET_ACCESS_KEY&&E.STORAGE_PUBLIC_URL);
const client=()=>new S3Client({region:E.STORAGE_REGION||"auto",endpoint:E.STORAGE_ENDPOINT||undefined,credentials:{accessKeyId:E.STORAGE_ACCESS_KEY_ID!,secretAccessKey:E.STORAGE_SECRET_ACCESS_KEY!}});
export const MAX_BYTES=5*1024*1024;
const T:Record<string,{ext:string;ok:(b:Buffer)=>boolean}>={
 "image/jpeg":{ext:"jpg",ok:b=>b[0]===0xff&&b[1]===0xd8&&b[2]===0xff},
 "image/png":{ext:"png",ok:b=>b.subarray(0,8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))},
 "image/webp":{ext:"webp",ok:b=>b.subarray(0,4).toString()==="RIFF"&&b.subarray(8,12).toString()==="WEBP"}};
// Validates declared type, extension AND file signature. SVG/others rejected. Original filename is never used.
export async function storeImage(f:File){if(!storageReady())throw new Error("storage");if(!f.size||f.size>MAX_BYTES)throw new Error("size");
 const t=T[f.type];const ext=f.name.split(".").pop()?.toLowerCase()||"";if(!t||!["jpg","jpeg","png","webp"].includes(ext))throw new Error("type");
 const buf=Buffer.from(await f.arrayBuffer());if(!t.ok(buf))throw new Error("type");
 const key="uploads/"+new Date().getUTCFullYear()+"/"+randomUUID()+"."+t.ext;
 await client().send(new PutObjectCommand({Bucket:E.STORAGE_BUCKET,Key:key,Body:buf,ContentType:f.type,CacheControl:"public, max-age=31536000, immutable"}));
 return{key,url:E.STORAGE_PUBLIC_URL!.replace(/\/$/,"")+"/"+key,size:buf.length,mime:f.type}}
export async function removeStored(key:string){if(!storageReady()||!key.startsWith("uploads/"))return;try{await client().send(new DeleteObjectCommand({Bucket:E.STORAGE_BUCKET,Key:key}))}catch{}}
