import MediaImage from "@/components/MediaImage";
import Link from "next/link";
import { db, safe } from "@/lib/db";
import { meta } from "@/lib/meta";

export const metadata = meta("News & Activities", "News, events and community activities from Uplift Nigeria Foundation.", "/news");

export default async function News() {
  const articles = await safe(() => db.article.findMany({
    where: { 
      published: true 
    },
    orderBy: {
      createdAt: "desc"
    }
  }), []) || [];

  return (
    <section className="sec">
      <div className="wrap">
        <p className="tag">News &amp; Activities</p>
        <h1 className="my-3 !text-4xl">Latest News</h1>
        
        {articles.length === 0 ? (
          <p className="muted">No articles published yet. Please check back soon.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {articles.map((x: any) => (
              <Link key={x.id} href={`/news/${x.slug}`} className="block border rounded-2xl p-4 hover:shadow-lg transition">
                <h2 className="text-xl font-semibold mb-2">{x.title}</h2>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(x.createdAt).toLocaleDateString("en-NG", { dateStyle: "long" })}
                </p>
                <p className="text-gray-600 line-clamp-3">{x.content}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
