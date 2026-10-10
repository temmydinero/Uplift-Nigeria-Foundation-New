import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/settings";

export default async function L({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const baseUrl = rawUrl && rawUrl.trim() !== "" ? rawUrl : "http://localhost:3000";
  
  // Safely construct absolute logo URL
  let logoUrl = "/logo-mark.svg";
  try {
    logoUrl = new URL("/logo-mark.svg", baseUrl).toString();
  } catch {
    logoUrl = "http://localhost:3000/logo-mark.svg";
  }

  // Filter out empty or whitespace-only social links safely
  const socialLinks = [s.instagram, s.facebook, s.x, s.linkedin, s.youtube, s.tiktok]
    .filter((u): u is string => typeof u === "string" && u.trim() !== "");

  const ld = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: s.foundation_name,
    url: baseUrl,
    logo: logoUrl,
    slogan: s.tagline,
    email: s.email || undefined,
    telephone: s.phone || undefined,
    address: s.address
      ? {
          "@type": "PostalAddress",
          streetAddress: s.address,
          addressCountry: "NG"
        }
      : undefined,
    sameAs: socialLinks.length > 0 ? socialLinks : undefined
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
      />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
