"use client";
import Image from "next/image";import { useState } from "react";
// Uses public/images/<name>.jpg through the Next.js image optimizer. If the file is missing, the pattern behind it shows (no broken image).
export default function Photo({name,alt,className="",priority=false,sizes="100vw"}:{name:string;alt:string;className?:string;priority?:boolean;sizes?:string}){
 const [bad,setBad]=useState(false);const a=alt?{role:"img" as const,"aria-label":alt}:{"aria-hidden":true as const};
 const pos=/\b(absolute|relative|fixed)\b/.test(className)?"":"relative ";
 return <div {...a} className={"pattern overflow-hidden "+pos+className}>{!bad&&<Image src={`/images/${name}.jpg`} alt="" fill sizes={sizes} priority={priority} quality={75} onError={()=>setBad(true)} className="object-cover"/>}</div>}
