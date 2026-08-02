import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildSeoMetadata, collectionPageSchema } from "@/lib/seo";
import { fetchSeoFromEndpoint } from "@/lib/api/seoApi";
import { getGeneralCategories } from "@/lib/api/toursApi";
import FallbackImage from "@/components/shared/fallback-image";
import SchemaScript from "@/components/seo/schema-script";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await fetchSeoFromEndpoint("tours", locale);

  return buildSeoMetadata({
    seo,
    title: "Egypt Tours",
    description: "Browse Egypt Tours Gate travel packages, day tours, Nile cruises, and private guided experiences across Egypt.",
    path: "/tours",
    locale,
  });
}

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const categories = await getGeneralCategories(locale);
  const title = "Explore Egypt Tours";
  const description =
    "Browse Egypt tour categories, private trips, Nile cruises, and tailor-made travel experiences.";
  const schema = collectionPageSchema({
    name: title,
    description,
    path: "/tours",
  });

  return (
    <main className="min-h-screen bg-white">
      <SchemaScript schema={schema} />

      <section className="relative overflow-hidden bg-[var(--second-color)] px-4 py-16 text-center text-white md:py-20">
        <div className="absolute -start-20 -top-24 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-28 end-10 h-72 w-72 rounded-full bg-[var(--main-color)]/10" />
        <div className="relative mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[var(--main-color)]">
            Egypt Tours Gate
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/80 md:text-lg">
            {description}
          </p>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-7 px-4 py-14 md:grid-cols-2 md:px-8 lg:grid-cols-3">
          {categories.map((category: Record<string, any>) => {
            const categoryName =
              typeof category.name === "string"
                ? category.name
                : category.name?.[locale] ?? category.name?.en ?? category.slug;
            const image =
              category.media?.image?.image ?? category.media?.image ?? category.image ?? "";
            const imageAlt =
              category.media?.image?.alt ?? category.media?.alt ?? categoryName;
            const categoryDescription =
              category.small_desc ?? category.description ?? "";

            return (
              <Link
                key={category.id ?? category.slug}
                href={`/${category.slug}`}
                className="group relative flex min-h-[25rem] overflow-hidden rounded-[1.5rem] bg-[var(--second-color)] shadow-[0_12px_35px_rgba(30,26,94,0.12)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(30,26,94,0.22)]"
              >
                <FallbackImage
                  src={image}
                  alt={imageAlt}
                  title={categoryName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--second-color)] via-[var(--second-color)]/35 to-transparent" />
                <div className="relative mt-auto w-full p-6 text-white">
                  <span className="mb-4 block h-1 w-14 rounded-full bg-[var(--main-color)] transition-all duration-500 group-hover:w-24" />
                  <h2 className="text-2xl font-bold capitalize leading-snug transition-colors group-hover:text-[var(--main-color)]">
                    {categoryName}
                  </h2>
                  {categoryDescription && (
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/80">
                      {categoryDescription}
                    </p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--main-color)]">
                    View tours
                    <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}
