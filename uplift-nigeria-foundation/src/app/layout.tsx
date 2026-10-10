import "./globals.css";
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const getSiteUrl = () => {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url && url.trim() !== "") {
    try {
      return new URL(url);
    } catch {
      // fallback if malformed
    }
  }
  return new URL("http://localhost:3000");
};

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Uplift Nigeria Foundation | Uplifting Lives. Strengthening Communities.",
    template: "%s | Uplift Nigeria Foundation"
  },
  description:
    "Uplift Nigeria Foundation is a Nigerian charitable foundation improving lives and strengthening communities through education, healthcare, youth empowerment and community development."
};

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={serif.variable + " " + sans.variable}>
      <body>{children}</body>
    </html>
  );
}
