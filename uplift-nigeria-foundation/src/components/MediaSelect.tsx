import { db, safe } from "@/lib/db";

export default async function MediaSelect({ name = "imageId", value }: { name?: string; value?: string | null }) {
  const m = await safe(() => db.media.findMany({ orderBy: { createdAt: "desc" }, take: 200 }), []);

  return (
    <label className="lbl">
      Image (from Media library)
      <select name={name} defaultValue={value || ""} className="input">
        <option value="">No image</option>
        {m.map((x: any) => (
          <option key={x.id} value={x.id}>
            {x.alt ? x.alt.slice(0, 60) : x.filename || x.id}
          </option>
        ))}
      </select>
      <span className="text-xs font-normal muted">Upload images under Media first.</span>
    </label>
  );
}
