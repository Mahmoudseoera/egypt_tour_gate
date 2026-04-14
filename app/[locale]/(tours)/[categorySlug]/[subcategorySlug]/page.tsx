
// sub Category Page (expoerted in tours dynamics routes)//
// Centralized API base URL and simple helpers (expoerted in tours dynamics routes)
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SecondTourCard from "@/components/tour/second-tour-card";
import Breadcrumb from "@/components/layout/breadcrumb";
import ExpandableDescription from "@/components/shared/expandable-description";
import SchemaScript from "@/components/seo/schema-script";
import {
  getGeneralCategories,
  getToursBySubcategory,
} from "@/lib/api/toursApi";
import { routing } from "@/lib/i18n/routing";

type SubcategoryPageProps = {
  params: Promise<{ locale: string; categorySlug: string; subcategorySlug: string }>;
};

async function getPageData(categorySlug: string, subcategorySlug: string, locale: string) {
  const headerCategories = await getGeneralCategories(locale);
  const category = headerCategories.find((c) => c?.slug === categorySlug);
  const subcategory = category?.subs?.find((ch: any) => ch?.slug === subcategorySlug);

  return { category, subcategory };
}

export async function generateStaticParams() {
  const result: Array<{ locale: string; categorySlug: string; subcategorySlug: string }> = [];
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
  const { category, subcategory } = await getPageData(categorySlug, subcategorySlug, locale);

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

  return {
    title: `${subcategoryName} ${categoryName} | Egypt Tours Gate`,
    description: `Discover ${subcategoryName} experiences in ${categoryName} with curated programs and flexible itineraries.`,
  };
}

export default async function SubcategoryPage({
  params,
}: SubcategoryPageProps) {
  const { locale, categorySlug, subcategorySlug } = await params;
  const { category, subcategory } = await getPageData(categorySlug, subcategorySlug, locale);

  if (!category || !subcategory) {
    notFound();
  }

  const tours = await getToursBySubcategory(subcategorySlug, locale);
  const normalizedItems = tours.map((tour) => ({
    id: tour.id,
    image: tour.image,
    title: tour.title,
    description: tour.short_description,
    price: tour.price_from,
    rating: tour.rating,
    reviewCount: 0,
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
  const shortDescription = `Explore the top ${subcategoryName} tours in ${categoryName} and choose the itinerary that matches your travel style.`;

  const subcategorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${subcategoryName} ${categoryName}`,
    description: shortDescription,
    url: `https://www.egypttoursgate.com/${categorySlug}/${subcategorySlug}`,
  };

  return (
    <>
      <SchemaScript schema={subcategorySchema} />
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: categoryName, href: `/${categorySlug}` },
          { label: subcategoryName, href: `/${categorySlug}/${subcategorySlug}` },
        ]}
      />

      <section className="container py-10 max-w-7xl mx-auto">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center text-[var(--second-color)]">
            {categoryName}
          </h1>
          <h2 className="text-xl text-gray-600 mb-4 text-center">
            {subcategoryName}
          </h2>
          <div className="max-w-2xl mx-auto text-center mb-8">
            <ExpandableDescription text={shortDescription} />
          </div>

          {normalizedItems.length === 0 ? (
            <p className="text-lg text-center">No tours found for this subcategory.</p>
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
