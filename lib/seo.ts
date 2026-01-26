import type { Metadata } from "next";

export async function getSeoMetadata(slug: string): Promise<Metadata | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/seo?slug=${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  const seo = await res.json();

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: {
      index: seo.index,
      follow: seo.follow,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [{ url: seo.og_image }],
    },
  };
}
