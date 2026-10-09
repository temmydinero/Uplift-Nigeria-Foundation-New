import Link from "next/link";
import Logo from "./Logo";
import { getSettings } from "@/lib/settings";
import { NAV, PROGRAMS } from "@/lib/content";

export default async function Footer() {
  const s = await getSettings();
  const soc = [
    ["Instagram", s.instagram],
    ["Facebook", s.facebook],
    ["X / Twitter", s.x],
    ["LinkedIn", s.linkedin],
    ["YouTube", s.youtube],
    ["TikTok", s.tiktok]
  ].filter(([_, u]) => typeof u === "string" && u.trim() !== "");

  return (
    <footer className="bg-[#0b2e22] py-14 text-[#cfe0d6]">
      <div className="wrap">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo light />
            <p className="mt-2 text-sm">{s.tagline}</p>
            <p className="mt-2 text-sm">{s.footer_text}</p>
          </div>
          <div>
            <h3 className="text-base text-white">Quick Links</h3>
            {NAV.map(([n, h]) => (
              <Link key={h} href={h} className="block py-1 text-sm hover:text-white">
                {n}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="text-base text-white">Programs</h3>
            {PROGRAMS.slice(0, 5).map((p) => (
              <Link key={p.slug} href="/programs" className="block py-1 text-sm hover:text-white">
                {p.title}
              </Link>
            ))}
          </div>
          <div>
            <h3 className="text-base text-white">Contact</h3>
            <p className="text-sm">
              {s.email}
              <br />
              {s.phone}
              <br />
              {s.address}
            </p>
            {soc.length > 0 && (
              <p className="mt-3 flex flex-wrap gap-3 text-sm">
                {soc.map(([n, u]) => (
                  <a key={n} href={u} target="_blank" rel="noopener noreferrer" className="underline">
                    {n}
                  </a>
                ))}
              </p>
            )}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-between gap-2 border-t border-white/15 pt-5 text-sm">
          <span>© {new Date().getFullYear()} Uplift Nigeria Foundation. All rights reserved.</span>
          <span>
            <Link href="/privacy">Privacy Policy</Link> | <Link href="/terms">Terms of Use</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
