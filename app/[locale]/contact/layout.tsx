import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo";
import { fetchSeoFromEndpoint } from "@/lib/api/seoApi";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const seo = await fetchSeoFromEndpoint("contact", locale);

  return buildSeoMetadata({
    seo,
    title: "Contact Egypt Tours Gate",
    description:
      "Contact Egypt Tours Gate to plan Egypt tours, Nile cruises, day trips, and tailor-made travel packages with our local experts.",
    path: "/contact",
    locale,
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
