// All Category Page //
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
 import { getT } from "@/lib/hooks/getT";
import Breadcrumb from "@/components/layout/breadcrumb";
import ExpandableDescription from "@/components/shared/expandable-description";
import SchemaScript from "@/components/seo/schema-script";
import FallbackImage from "@/components/shared/fallback-image";
import {
  breadcrumbSchema,
  buildSeoMetadata,
  collectionPageSchema,
  stripHtml,
} from "@/lib/seo";
import { getCategoryBySlug, getGeneralCategories } from "@/lib/api/toursApi";
import { routing } from "@/lib/i18n/routing";
import { ArrowUpRight, Binoculars } from "lucide-react";
// import placeholder from "@/assets/images/placeholder.png";
type CategoryPageProps = {
  params: Promise<{ locale: string; categorySlug: string }>;
};


// Fallback image used only when a subcategory has no media at all
// const FALLBACK_IMAGE = "/assets/images/placeholder.png";

async function getCategoryData(categorySlug: string, locale: string) {
  const fromEndpoint = await getCategoryBySlug(categorySlug, locale);
  const categories = await getGeneralCategories(locale);
  const fromGeneral =
    categories.find((cat: any) => cat.slug === categorySlug) ?? null;

  // `getCategoryBySlug` already normalises subs → fromEndpoint.subs
  if (
    fromEndpoint &&
    Array.isArray(fromEndpoint.subs) &&
    fromEndpoint.subs.length > 0
  ) {
    return fromEndpoint;
  }

  if (fromEndpoint && fromGeneral) {
    return {
      ...fromEndpoint,
      subs:
        fromEndpoint.subs?.length
          ? fromEndpoint.subs
          : (fromGeneral.subs ?? []),
    };
  }

  return fromEndpoint ?? fromGeneral;
}

export async function generateStaticParams() {
  const result: Array<{ locale: string; categorySlug: string }> = [];
  for (const locale of routing.locales) {
    try {
      const categories = await getGeneralCategories(locale);
      categories.forEach((category: any) => {
        if (category?.slug) result.push({ locale, categorySlug: category.slug });
      });
    } catch {
      // Keep build resilient if remote API is temporarily unavailable.
    }
  }
  return result;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  const category = await getCategoryData(categorySlug, locale);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const categoryName =
    typeof category.name === "string"
      ? category.name
      : category.name?.[locale] ?? category.name?.en ?? categorySlug;

  const description =
    category.plainDesc ||
    stripHtml(category.small_desc) ||
    `Explore ${categoryName} tours, itineraries, and travel options in Egypt with Egypt Tours Gate.`;

  return buildSeoMetadata({
    seo: category.seo,
    title: `${categoryName} Tours | Egypt Tours Gate`,
    description,
    path: `/${categorySlug}`,
    locale,
    image: category.media?.image,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, categorySlug } = await params;
  const category = await getCategoryData(categorySlug, locale);
    const t = await getT("view_tour");
    
  if (!category) {
    notFound();
  }

  const categoryName =
    typeof category.name === "string"
      ? category.name
      : category.name?.[locale] ?? category.name?.en ?? categorySlug;

  // Use the rich `desc` (stripped of HTML) when available, fall back to generic text
  const categoryDescription =
    category.plainDesc ||
    `Browse all available ${categoryName} options and discover the best experiences curated by Egypt Tours Gate.`;

  // second_title shown as subtitle in the hero (e.g. "Egypt Day Tours and Excursions")
  const categorySecondTitle: string = category.second_title ?? "";
  const coverCategory :string = category.media?.cover?.image ?? "";
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: categoryName, href: `/${categorySlug}` },
  ];

  const categorySchema = [
    collectionPageSchema({
      name: categoryName,
      description: categoryDescription,
      path: `/${categorySlug}`,
      image: category.media?.image,
    }),
    breadcrumbSchema(breadcrumbItems),
  ];

  return (
    <>
      <SchemaScript schema={categorySchema} />
      {/* ── Page Hero ── */}
        <div className="relative py-16 h-80 overflow-hidden">
        {/* Background Image */}
            <FallbackImage
               src={coverCategory || "/placeholder.svg"}
              alt={categoryName}
              fill
              className="object-cover"
            />
          {/* Main Color Overlay */}
      <div
        className="absolute inset-0 z-[1] "
        style={{
          background: "var(--second-color)",
          opacity: 0.55,
        }}
      />
        <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full opacity-10 bg-[var(--main-color)]" />
        <div className="absolute -bottom-14 -right-14 w-72 h-72 rounded-full opacity-10 bg-[var(--main-color)]" />

        <div className="relative z-[3] flex flex-col justify-center item-center h-full text-center px-4">
          <p className="text-[var(--main-color)] font-semibold tracking-widest uppercase text-xs mb-3">
      {t("explore")}      </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white capitalize leading-tight">
            {categoryName.toLowerCase()}
          </h1>
          {categorySecondTitle && (
            <p className="text-white/70 text-lg mt-2 font-medium">
              {categorySecondTitle}
            </p>
          )}
        </div>
      </div>
       <Breadcrumb items={breadcrumbItems} />
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
           <div className="max-w-7xl mx-auto text-center mb-8">
            <ExpandableDescription
              text={categoryDescription}
              isHtml
              className="text-white [&>p]:text-white/90 [&_a:hover]:underline"
            />
          </div>
          {category.subs.length === 0 ? (
            <p className="text-lg text-center">
        {t("no_subcategory_found_for_this_category")}      </p>
          ): (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {(category.subs ?? []).map((child: any, index: number) => {
                // ── Real image from API media, fallback only when absent ──
                const rawImage: string =
                  child.media?.image?.trim() ||
                  child.media?.image_url?.trim() ||
                  "";

                // const childImage: string =
                //  rawImage && rawImage.includes("/uploads/category/")
                // ? rawImage
                // : FALLBACK_IMAGE;

                const childImageAlt: string =
                  child.media?.alt ||
                  child.media?.title ||
                  child.name ||
                  "category";

                const childName =
                  typeof child.name === "string"
                    ? child.name
                    : child.name?.[locale] ?? child.name?.en ?? child.slug;

                // small_desc is present on subCategories in the real API
                const childDesc: string =
                  child.small_desc || child.description || "";

                return (
                  <Link
                    key={child.slug}
                    href={`/${category.slug}/${child.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-gray-100 bg-white shadow-[0_10px_35px_rgba(30,26,94,0.08)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--main-color)]/45 hover:shadow-[0_22px_55px_rgba(30,26,94,0.16)]"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="relative h-64 flex-shrink-0 overflow-hidden bg-gray-100">
                      <FallbackImage
                        src={rawImage}
                        alt={childImageAlt}
                        title={childName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        unoptimized={rawImage.startsWith("http")}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--second-color)]/90 via-[var(--second-color)]/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--main-color)] to-transparent opacity-90" />

                      <div className="absolute start-4 top-4">
                        <span className="inline-flex max-w-[15rem] items-center rounded-full border border-white/25 bg-[var(--second-color)]/65 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                          {categoryName}
                        </span>
                      </div>

                      <div className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:border-[var(--main-color)] group-hover:bg-[var(--main-color)] group-hover:text-[var(--second-color)] rtl:group-hover:-rotate-45">
                        <ArrowUpRight
                          className="h-5 w-5 rtl:-scale-x-100"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="absolute bottom-5 start-5 end-5">
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--main-color)]">
                          {t("explore")}
                        </span>
                        <h3 className="line-clamp-2 text-2xl font-bold capitalize leading-snug text-white transition-colors duration-300 group-hover:text-[var(--main-color)]">
                          {childName.toLowerCase()}
                        </h3>
                      </div>
                    </div>

                    <div className="relative flex flex-1 flex-col px-6 pb-6 pt-7">
                      <span className="absolute start-6 top-0 h-1 w-14 -translate-y-1/2 rounded-full bg-[var(--main-color)] transition-all duration-500 group-hover:w-24" />

                      <p className="mb-6 line-clamp-3 flex-1 text-sm leading-7 text-[var(--black-color)]/75">
                        {childDesc ||
                          `Discover top ${childName} programs and tailor your perfect Egyptian journey.`}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">
                        <span className="inline-flex items-center gap-2 text-sm font-bold capitalize text-[var(--second-color)] transition-colors duration-300 group-hover:text-[var(--main-color)]">
                          <Binoculars className="h-4 w-4" aria-hidden="true" />
                          {t("view_tours")}
                        </span>
                        <span className="h-px w-10 bg-[var(--main-color)] transition-all duration-500 group-hover:w-16" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 start-0 h-1 w-0 bg-[var(--main-color)] transition-all duration-500 group-hover:w-full" />
                  </Link>
                );
              })}
            </div>
          )}

      </section>
    </>
  );
}
