import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildSeoMetadata({
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
