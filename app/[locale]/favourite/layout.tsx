import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo";
import { fetchSeoFromEndpoint } from "@/lib/api/seoApi";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await fetchSeoFromEndpoint("favourite", locale);
  return buildSeoMetadata({
    seo,
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
