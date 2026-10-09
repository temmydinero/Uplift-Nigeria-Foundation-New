import MediaImage from "@/components/MediaImage"
import { db } from "@/lib/db"

export const metadata = {
  title: "Our Impact",
  description: "See the impact of Uplift Nigeria Foundation.",
}

export default async function Impact() {
  const stats = await db.impactStat.findMany()
  const stories = await db.impactStory.findMany()

  return (
    <section className="sec">
      <div className="my-10 grid gap-5 sm:grid-cols-2">
        {stats.length === 0 && <p className="muted">No stats available yet.</p>}
      </div>
      <h2 className="mb-6 mt-12">Impact Timeline</h2>
      {stories.length === 0 && <p className="muted">No stories available yet.</p>}
    </section>
  )
}
