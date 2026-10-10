export const meta = (title: string, description: string, path: string = "") => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim() !== "" 
    ? process.env.NEXT_PUBLIC_SITE_URL 
    : "http://localhost:3000";

  // Ensure path starts with a slash or safely resolve as a full URL if it's already absolute
  let canonicalUrl = path;
  try {
    canonicalUrl = new URL(path, baseUrl).toString();
  } catch {
    canonicalUrl = baseUrl;
  }

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website" as const,
      siteName: "Uplift Nigeria Foundation"
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description
    }
  };
};
