import { db } from "@/lib/db";
import { saveStats, addStat, deleteStat } from "@/lib/admin-actions";
import ConfirmButton from "@/components/ConfirmButton";

export default async function AdminImpact({ searchParams }: { searchParams: { saved?: string; error?: string } }) {
  const stats = await db.impactStat.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <h1 className="!text-3xl">Manage Impact Statistics</h1>
      {searchParams.saved && <p role="status" className="mt-3 rounded-xl bg-green-100 p-3 text-green-900">Saved.</p>}
      {searchParams.error && <p role="alert" className="mt-3 rounded-xl bg-red-100 p-3 text-red-900">Please check the fields and try again.</p>}

      <h2 className="mt-8 !text-xl">Statistics</h2>
      <p className="muted text-sm">A number appearing on the homepage and impact page.</p>

      <form action={saveStats} className="card mt-3 grid max-w-2xl gap-3">
        {stats.map((s: any) => (
          <div key={s.id} className="grid items-center gap-2 sm:grid-cols-[1fr_90px_70px_auto]">
            <input type="hidden" name="id" value={s.id} />
            <input name="label" defaultValue={s.label} className="input" placeholder="Label" />
            <input name="value" defaultValue={s.value} className="input" placeholder="Value" />
            <input name="sortOrder" type="number" defaultValue={s.sortOrder} className="input" placeholder="Order" />
          </div>
        ))}
        <button className="btn mt-2 w-max">Save All Statistics</button>
      </form>

      <h2 className="mt-10 !text-xl">Add New Statistic</h2>
      <form action={addStat} className="card mt-3 flex max-w-2xl gap-2">
        <input name="label" placeholder="New statistic label" className="input" />
        <input name="value" placeholder="Value (e.g. 5,000+)" className="input" />
        <input name="sortOrder" type="number" defaultValue={stats.length + 1} className="input w-24" />
        <button className="btn">Add</button>
      </form>

      {stats.map((s: any) => (
        <form key={s.id} action={deleteStat} className="mt-2">
          <input type="hidden" name="id" value={s.id} />
          <ConfirmButton label={`Delete "${s.label}"`} message="Delete this statistic?" />
        </form>
      ))}
    </>
  );
}
