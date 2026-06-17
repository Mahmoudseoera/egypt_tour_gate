// All Category Page //
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
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
    seoHtml: category.seo,
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
        <div className="relative py-20 overflow-hidden">
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

        <div className="relative z-10 text-center px-4">
          <p className="text-[var(--main-color)] font-semibold tracking-widest uppercase text-xs mb-3">
            Explore
          </p>
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
              className="text-white [&>p]:text-white/90"
            />
          </div>
          {category.subs.length === 0 ? (
            <p className="text-lg text-center">
              No subcategory found for this category.
            </p>
          ): (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 border border-gray-100 hover:border-[var(--main-color)]"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="relative h-56 overflow-hidden flex-shrink-0">
                      <Image
                        src={rawImage}
                        alt={childImageAlt}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        unoptimized={rawImage.startsWith("http")}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[var(--main-color)] shadow-md">
                        {categoryName}
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 p-6 gap-4">
                      <h3
                        className="text-xl font-bold capitalize leading-snug transition-colors duration-200 group-hover:text-[var(--main-color)]"
                        style={{ color: "var(--second-color)" }}
                      >
                        {childName.toLowerCase()}
                      </h3>

                      <p className="text-sm leading-relaxed flex-1 text-[var(--black-color)] line-clamp-4">
                        {childDesc ||
                          `Discover top ${childName} programs and tailor your perfect Egyptian journey.`}
                      </p>

                      <div className="pt-2 border-t border-gray-100">
                        <span
                          className="inline-flex items-center gap-2 w-full justify-center py-3 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-300 group-hover:gap-3"
                          style={{ backgroundColor: "var(--second-color)" }}
                        >
                          View Tours
                        </span>
                      </div>
                    </div>

                    <div
                      className="h-1 w-full transition-all duration-500"
                      style={{ backgroundColor: "var(--main-color)" }}
                    />
                  </Link>
                );
              })}
            </div>
          )}

      </section>
    </>
  );
}
