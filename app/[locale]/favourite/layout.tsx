import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo";
import { getPageSeoHtml } from "@/lib/api/homeApi";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seoHtml = await getPageSeoHtml(locale, "favourites_page_scripts");

  return buildSeoMetadata({
    seoHtml,
    title: "Your Favourite Egypt Tours",
    description:
      "View and manage the Egypt tours, packages, and Nile cruises you've saved to your favourites list.",
    path: "/favourite",
    locale,
    // Personalized, localStorage-driven page — nothing here is unique
    // per-visitor content worth indexing.
    noIndex: true,
  });
}

export default function FavouriteLayout({ children }: { children: React.ReactNode }) {
  return children;
}