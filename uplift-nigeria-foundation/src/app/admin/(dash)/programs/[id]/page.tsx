import { db } from "@/lib/db";import { saveProgram,deleteProgram } from "@/lib/admin-actions";import MediaSelect from "@/components/MediaSelect";import ConfirmButton from "@/components/ConfirmButton";
export default async function Edit({params,searchParams}:{params:{id:string};searchParams:{error?:string}}){const a=params.id==="new"?null:await db.program.findUnique({where:{id:params.id},include:{category:true}});
 return <><h1 className="!text-3xl">{a?"Edit program":"New program"}</h1>{searchParams.error&&<p role="alert" className="mt-3 rounded-xl bg-red-100 p-3 text-red-900">Please check the fields and try again.</p>}
 <form action={saveProgram} className="card mt-6 grid max-w-2xl gap-4"><input type="hidden" name="id" value={params.id}/>
 <label className="lbl">Title<input name="title" required defaultValue={a?.title} className="input"/></label>
 <label className="lbl">Category<input name="category" defaultValue={a?.category?.name} className="input"/></label>
 <label className="lbl">Short summary (max 300)<textarea name="summary" required maxLength={300} rows={2} defaultValue={a?.summary} className="input"/></label>
 <label className="lbl">Long description<textarea name="body" rows={8} defaultValue={a?.body??""} className="input"/></label>
 <label className="lbl">Display order (lower shows first)<input name="sortOrder" type="number" min={0} defaultValue={a?.sortOrder??0} className="input"/></label>
 <MediaSelect value={a?.imageId}/>
 <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={a?.published}/> Published</label><button className="btn">Save</button></form>
 {a&&<form action={deleteProgram} className="mt-4"><input type="hidden" name="id" value={a.id}/><ConfirmButton label="Delete this program" message="Delete this program permanently?"/></form>}</>}
