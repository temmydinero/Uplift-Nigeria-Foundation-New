import { notFound } from "next/navigation";
import { db, safe } from "@/lib/db";
import { meta } from "@/lib/meta";

export const revalidate = 60;

const get = (slug: string) => 
  safe(() => db.article.findFirst({
    where: { 
      slug, 
      published: true 
    }
  }), null);

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const a = await get(params.slug);
  if (!a) return {};
  const m = meta(a.title, a.content ? a.content.substring(0, 150) : "", "/news/" + a.slug);
  return m;
}

export default async function Post({ params }: { params: { slug: string } }) {
  const a = await get(params.slug);
  if (!a) notFound();

  const articleDate = a.createdAt ?? new Date();

  const ld = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    datePublished: articleDate.toISOString(),
    publisher: { "@type": "Organization", name: "Uplift Nigeria Foundation" }
  };

  return (
    <article className="sec">
      <div className="wrap max-w-3xl">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
        <p className="tag">
          News · {articleDate.toLocaleDateString("en-NG", { dateStyle: "long" })}
        </p>
        <h1 className="my-3 !text-4xl">{a.title}</h1>
        {a.content && a.content.split(/\n{2,}/).map((p: string, i: number) => <p key={i} className="my-4 leading-8">{p}</p>)}
      </div>
    </article>
  );
}
