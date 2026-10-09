import Link from "next/link";import { db,safe } from "@/lib/db";
export default async function List(){const a=await safe(()=>db.program.findMany({orderBy:{sortOrder:"asc"}}),[]);
 return <><div className="flex items-center justify-between"><h1 className="!text-3xl">Programs</h1><Link href="/admin/programs/new" className="btn">New program</Link></div>
 <p className="muted mt-2 text-sm">While no program is published, the public site shows the six default programs.</p>
 {a.length===0?<p className="muted mt-6">No programs yet.</p>:<ul className="mt-6 grid gap-3">{a.map(x=><li key={x.id} className="card flex items-center justify-between !p-4"><span><b>{x.title}</b><br/><small className="muted">{x.published?"Published":"Draft"}</small></span><Link href={"/admin/programs/"+x.id} className="font-semibold text-brand">Edit</Link></li>)}</ul>}</>}
