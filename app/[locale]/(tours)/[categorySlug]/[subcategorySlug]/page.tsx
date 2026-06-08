// sub Category Page //
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SecondTourCard from "@/components/tour/second-tour-card";
import Breadcrumb from "@/components/layout/breadcrumb";
import ExpandableDescription from "@/components/shared/expandable-description";
import SchemaScript from "@/components/seo/schema-script";
import {
  breadcrumbSchema,
  buildSeoMetadata,
  collectionPageSchema,
  stripHtml,
} from "@/lib/seo";
import {
  getSubcategoryBySlug,
  getGeneralCategories,
  getToursBySubcategory,
} from "@/lib/api/toursApi";
import { routing } from "@/lib/i18n/routing";
import Image from "next/image";
type SubcategoryPageProps = {
  params: Promise<{
    locale: string;
    categorySlug: string;
    subcategorySlug: string;
  }>;
};

async function getPageData(
  categorySlug: string,
  subcategorySlug: string,
  locale: string
) {
  const headerCategories = await getGeneralCategories(locale);
  const category = headerCategories.find((c) => c?.slug === categorySlug);

  // `subs` is already normalised by getGeneralCategories (comes from general-data header)
  const subcategoryFromHeader = category?.subs?.find(
    (ch: any) => ch?.slug === subcategorySlug
  );

  // Fetch the full subcategory detail (includes desc, tours, media, seo…)
  const directSubcategory = await getSubcategoryBySlug(subcategorySlug, locale);

  return {
    category,
    // Prefer the detailed endpoint; merge header stub as fallback
    subcategory: directSubcategory ?? subcategoryFromHeader ?? null,
  };
}

export async function generateStaticParams() {
  const result: Array<{
    locale: string;
    categorySlug: string;
    subcategorySlug: string;
  }> = [];
  for (const locale of routing.locales) {
    try {
      const categories = await getGeneralCategories(locale);
      categories.forEach((category: any) => {
        const subs = Array.isArray(category?.subs) ? category.subs : [];
        subs.forEach((subcategory: any) => {
          if (category?.slug && subcategory?.slug) {
            result.push({
              locale,
              categorySlug: category.slug,
              subcategorySlug: subcategory.slug,
            });
          }
        });
      });
    } catch {
      // Keep build resilient if remote API is unavailable.
    }
  }
  return result;
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const { locale, categorySlug, subcategorySlug } = await params;
  const { category, subcategory } = await getPageData(
    categorySlug,
    subcategorySlug,
    locale
  );

  if (!category || !subcategory) {
    return { title: "Subcategory Not Found" };
  }

  const categoryName =
    typeof category.name === "string"
      ? category.name
      : category.name?.[locale] ?? category.name?.en ?? categorySlug;
  const subcategoryName =
    typeof subcategory.name === "string"
      ? subcategory.name
      : subcategory.name?.[locale] ?? subcategory.name?.en ?? subcategorySlug;

  const metaDescription =
    subcategory.plainDesc ||
    stripHtml(subcategory.small_desc) ||
    `Discover ${subcategoryName} experiences in ${categoryName} with curated programs and flexible itineraries.`;

  return buildSeoMetadata({
    seoHtml: subcategory.seo,
    title: `${subcategoryName} ${categoryName} | Egypt Tours Gate`,
    description: metaDescription,
    path: `/${categorySlug}/${subcategorySlug}`,
    locale,
    image: subcategory.media?.image,
  });
}

export default async function SubcategoryPage({
  params,
}: SubcategoryPageProps) {
  const { locale, categorySlug, subcategorySlug } = await params;
  const { category, subcategory } = await getPageData(
    categorySlug,
    subcategorySlug,
    locale
  );

  if (!category || !subcategory) {
    notFound();
  }

  const tours = await getToursBySubcategory(subcategorySlug, locale);

  const normalizedItems = tours.map((tour) => ({
    id: tour.id,
    // mapTour already resolves media?.image
    image: tour.image,
    title: tour.title,
    // mapTour now picks small_desc first
    description: tour.short_description ?? "",
    price: tour.price_from,
    rating: tour.rating,
    reviewCount: 0,
    // mapTour now combines duration + duration_type
    duration: tour.duration,
    location: tour.location,
    slug: tour.slug,
    categorySlug,
    subcategorySlug,
  }));

  const categoryName =
    typeof category.name === "string"
      ? category.name
      : category.name?.[locale] ?? category.name?.en ?? categorySlug;

  const subcategoryName =
    typeof subcategory.name === "string"
      ? subcategory.name
      : subcategory.name?.[locale] ?? subcategory.name?.en ?? subcategorySlug;

  // second_title is a subtitle (e.g. "Egypt Luxury Tours and Trips")
  const subcategorySecondTitle: string = subcategory.second_title ?? "";
  const subcategoryCover: string = subcategory.media?.cover.image ?? "";
  // plainDesc is the HTML-stripped `desc` field set by getSubcategoryBySlug
  const shortDescription: string =
    subcategory.plainDesc ||
    subcategory.small_desc ||
    `Explore the top ${subcategoryName} tours in ${categoryName} and choose the itinerary that matches your travel style.`;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: categoryName, href: `/${categorySlug}` },
    { label: subcategoryName, href: `/${categorySlug}/${subcategorySlug}` },
  ];

  const subcategorySchema = [
    collectionPageSchema({
      name: `${subcategoryName} ${categoryName}`,
      description: shortDescription,
      path: `/${categorySlug}/${subcategorySlug}`,
      image: subcategory.media?.image,
    }),
    breadcrumbSchema(breadcrumbItems),
  ];

  return (
    <>
      <SchemaScript schema={subcategorySchema} />
      <Breadcrumb items={breadcrumbItems} />

      <section className="container py-10 max-w-7xl mx-auto">
        <div className="container mx-auto">
          <p className="text-xl text-gray-600 mb-1 text-center">
            {categoryName}
          </p>
          <h1 className="text-3xl font-bold mb-2 text-center text-[var(--second-color)]">
            {subcategoryName} 
          </h1>
          {subcategorySecondTitle && (
            <p className="text-base text-[var(--main-color)] font-medium text-center mb-3">
              {subcategorySecondTitle}
            </p>
          )}
          <div className="max-w-7xl mx-auto text-center mb-8">
            <ExpandableDescription text={shortDescription} isHtml/>
          </div>
            <Image
            src={subcategoryCover} alt ="sub-category-cover" width={1000} height={500}/>
          {normalizedItems.length === 0 ? (
            <p className="text-lg text-center">
              No tours found for this subcategory.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {normalizedItems.map((item) => (
                <SecondTourCard
                  key={item.id}
                  id={item.id}
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  price={item.price}
                  rating={item.rating}
                  reviewCount={item.reviewCount}
                  duration={item.duration}
                  location={item.location}
                  slug={item.slug}
                  categorySlug={item.categorySlug}
                  subcategorySlug={item.subcategorySlug}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
