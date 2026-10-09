import Link from "next/link";import { signOut } from "@/lib/auth";import { requireAuth } from "@/lib/authz";
const ALL:[string,string,boolean][]=[["Overview","/admin",false],["Programs","/admin/programs",false],["News","/admin/articles",false],["Impact","/admin/impact",false],["Media","/admin/media",false],["Volunteers","/admin/inbox/volunteers",true],["Partnerships","/admin/inbox/partnerships",true],["Messages","/admin/inbox/messages",true],["Settings","/admin/settings",true],["Admin users","/admin/users",true]];
export const metadata={title:"Admin",robots:{index:false,follow:false}};
export default async function Dash({children}:{children:React.ReactNode}){const u=await requireAuth();
 return <div className="min-h-screen md:flex"><aside className="bg-brand p-4 text-white md:w-56"><p className="font-serif font-bold">UNF Admin</p><p className="mb-3 text-xs text-white/70">{u.name} · {u.role}</p>
 <nav aria-label="Admin" className="flex flex-wrap gap-1 md:block">{ALL.filter(l=>!l[2]||u.role==="ADMIN").map(([n,h])=><Link key={h} href={h} className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10">{n}</Link>)}</nav>
 <form action={async()=>{"use server";await signOut({redirectTo:"/admin/login"})}} className="mt-3"><button className="rounded-lg px-3 py-2 text-sm underline">Log out</button></form></aside><div className="min-w-0 flex-1 p-5 md:p-8">{children}</div></div>}
