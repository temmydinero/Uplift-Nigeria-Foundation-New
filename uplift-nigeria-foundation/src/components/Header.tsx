"use client";
import Link from "next/link";import { usePathname } from "next/navigation";import { useEffect,useState } from "react";import { NAV } from "@/lib/content";import Logo from "./Logo";
export default function Header(){const [o,setO]=useState(false);const p=usePathname();
 useEffect(()=>{const k=(e:KeyboardEvent)=>{if(e.key==="Escape")setO(false)};addEventListener("keydown",k);return()=>removeEventListener("keydown",k)},[]);
 return <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur"><div className="wrap flex h-[72px] items-center justify-between">
 <Link href="/" aria-label="Uplift Nigeria Foundation home"><Logo/></Link>
 <nav id="main-nav" aria-label="Main" className={(o?"absolute inset-x-0 top-[72px] block border-b border-line bg-cream p-4 shadow-lg":"hidden")+" lg:static lg:block lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"}>
 <ul className="flex flex-col gap-1 lg:flex-row lg:items-center">{NAV.map(([n,h])=><li key={h}><Link href={h} onClick={()=>setO(false)} aria-current={p===h?"page":undefined} className={"block rounded-lg px-3 py-2 text-sm hover:bg-brand/10 "+(p===h?"font-semibold text-brand":"muted")}>{n}</Link></li>)}
 <li><Link href="/involved" className="btn !py-2.5 lg:ml-2" onClick={()=>setO(false)}>Get Involved</Link></li></ul></nav>
 <button className="rounded-lg border border-line px-3 py-2 lg:hidden" aria-label={o?"Close menu":"Open menu"} aria-expanded={o} aria-controls="main-nav" onClick={()=>setO(!o)}>{o?"✕":"☰"}</button></div></header>}
