import { db } from "@/lib/db";
import { saveArticle, deleteArticle } from "@/lib/admin-actions";
import MediaSelect from "@/components/MediaSelect";
import ConfirmButton from "@/components/ConfirmButton";

export default async function Edit({params, searchParams}:{params:{id:string}; searchParams:{error?:string}}) {
  const rawArticle = params.id === "new" ? null : await db.article.findUnique({ where: { id: params.id } });
  const a: any = rawArticle;

  return (
    <>
      <h1 className="!text-3xl">{a ? "Edit article" : "New article"}</h1>
      {searchParams.error && <p role="alert" className="mt-3 rounded-xl bg-red-100 p-3 text-red-900">Please check the fields and try again.</p>}
      <form action={saveArticle} className="card mt-6 grid max-w-2xl gap-4">
        <input type="hidden" name="id" value={params.id} />
        <label className="lbl">Title<input name="title" required defaultValue={a?.title} className="input" /></label>
        <label className="lbl">Category<input name="category" defaultValue={a?.category?.name || ""} className="input" /></label>
        <label className="lbl">Excerpt (max 300)<textarea name="excerpt" required maxLength={300} rows={2} defaultValue={a?.excerpt || a?.content?.substring(0, 300) || ""} className="input" /></label>
        <label className="lbl">Body (blank line = new paragraph)<textarea name="body" required rows={12} defaultValue={a?.body || a?.content || ""} className="input" /></label>
        <MediaSelect value={a?.imageId} />
        <label className="lbl">SEO title (optional, max 70)<input name="seoTitle" maxLength={70} defaultValue={a?.seoTitle ?? ""} className="input" /></label>
        <label className="lbl">SEO description (optional, max 160)<input name="seoDescription" maxLength={160} defaultValue={a?.seoDescription ?? ""} className="input" /></label>
        <label className="lbl">Publish date/time (future date = scheduled)<input name="publishAt" type="datetime-local" defaultValue={a?.publishedAt ? new Date(a.publishedAt).toISOString().slice(0,16) : ""} className="input" /></label>
        <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={a?.published} /> Published (draft when unchecked)</label>
        <button className="btn">Save</button>
      </form>
      {a && <form action={deleteArticle} className="mt-4"><input type="hidden" name="id" value={a.id} /><ConfirmButton label="Delete this article" message="Delete this article permanently?" /></form>}
    </>
  );
}
