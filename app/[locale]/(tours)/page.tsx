import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo";


// import CategoryCard from "@/components/tour/category-card";
// import categoriesData from "@/lib/api/categories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildSeoMetadata({
    title: "Egypt Tours",
    description: "Browse Egypt Tours Gate travel packages, day tours, Nile cruises, and private guided experiences across Egypt.",
    path: "/tours",
    locale,
  });
}

export default async function ToursPage({
  params,
}: {
  params: Promise<{ pageTitle?: string }>;
}) {
  const resolved = await params;
  const pageTitle = resolved?.pageTitle ?? "Tours";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <h3>{pageTitle}</h3>
    </div>
  );
}