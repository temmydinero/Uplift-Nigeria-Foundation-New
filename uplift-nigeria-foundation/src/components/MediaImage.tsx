import Image from "next/image";
// CMS images: optimised via next/image when served from the configured storage host, plain lazy <img> otherwise.
export default function MediaImage({src,alt,className,sizes="(min-width:1024px) 33vw, 100vw"}:{src:string;alt:string;className?:string;sizes?:string}){
 let ok=false;try{ok=!!process.env.STORAGE_PUBLIC_URL&&new URL(src).host===new URL(process.env.STORAGE_PUBLIC_URL).host}catch{}
 return ok?<Image src={src} alt={alt} width={1200} height={675} sizes={sizes} className={className}/>:<img src={src} alt={alt} loading="lazy" decoding="async" className={className}/>}
