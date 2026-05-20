import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo";
import { fetchSeoHtmlFromEndpoint } from "@/lib/api/seoApi";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const seoHtml = await fetchSeoHtmlFromEndpoint("forms/get/tailor-made", locale);

  return buildSeoMetadata({
    seoHtml,
    title: "Tailor Made Egypt Tours",
    description:
      "Create a tailor-made Egypt tour package with Egypt Tours Gate and customize cities, dates, hotels, budget, and travel preferences.",
    path: "/tailor-made",
    locale,
  });
}

export default function TailorMadeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
