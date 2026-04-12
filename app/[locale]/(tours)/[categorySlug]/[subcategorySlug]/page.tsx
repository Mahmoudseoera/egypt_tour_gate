
// sub Category Page (expoerted in tours dynamics routes)//
// Centralized API base URL and simple helpers (expoerted in tours dynamics routes)
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import categoriesData from "@/lib/api/categories";
import SecondTourCard from "@/components/tour/second-tour-card";
import type { Tour, TourPackage, NileCruise } from "@/lib/api/categories";
import Breadcrumb from "@/components/layout/breadcrumb";
import ExpandableDescription from "@/components/shared/expandable-description";
import SchemaScript from "@/components/seo/schema-script";
import { apiGet } from "@/lib/api/client";

type SubcategoryPageProps = {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
};

async function getGeneralCategories() {
  const data = await apiGet<any>("/general-data?locale=en");
  return data.data?.header?.categories ?? data.data?.header?.headerCategories ?? [];
}

async function getPageData(categorySlug: string, subcategorySlug: string) {
  const headerCategories = await getGeneralCategories();
  const category = headerCategories.find((c: { slug: string }) => c.slug === categorySlug);
  const subcategory = category?.subs?.find((ch: { slug: string }) => ch.slug === subcategorySlug);

  return { category, subcategory };
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const { categorySlug, subcategorySlug } = await params;
  const { category, subcategory } = await getPageData(categorySlug, subcategorySlug);

  if (!category || !subcategory) {
    return { title: "Subcategory Not Found" };
  }

  const categoryName = category.name ?? categorySlug;
  const subcategoryName = subcategory.name ?? subcategorySlug;

  return {
    title: `${subcategoryName} ${categoryName} | Egypt Tours Gate`,
    description: `Discover ${subcategoryName} experiences in ${categoryName} with curated programs and flexible itineraries.`,
  };
}

export default async function SubcategoryPage({
  params,
}: SubcategoryPageProps) {
  const { categorySlug, subcategorySlug } = await params;
  const { category, subcategory } = await getPageData(categorySlug, subcategorySlug);

  if (!category || !subcategory) {
    notFound();
  }

  const { tours, packages, nile_cruises } = categoriesData;

  const dayTours = tours.filter(
    (t: Tour) => t.category === categorySlug && t.city === subcategorySlug
  );

  const packageItems = packages.filter(
    (p: TourPackage) => p.category === categorySlug
  );

  const cruises = nile_cruises.filter(
    (c: NileCruise) => c.categorySlug === categorySlug && c.subcategorySlug === subcategorySlug
  );

  const normalizedItems = [
    ...dayTours.map((tour: Tour) => ({
      id: tour.id,
      image: tour.image,
      title: tour.title,
      description: tour.short_description,
      price: tour.price_from,
      rating: tour.rating,
      reviewCount: 0,
      duration: tour.duration,
      location: tour.city,
      slug: tour.slug,
      categorySlug: categorySlug,
      subcategorySlug: subcategorySlug,
    })),
    ...packageItems.map((pkg: TourPackage) => ({
      id: pkg.id,
      image: pkg.image,
      title: pkg.title,
      description: pkg.includes?.join(", "),
      price: pkg.price_from,
      rating: pkg.rating,
      reviewCount: 0,
      duration: pkg.duration,
      location: pkg.category,
      slug: pkg.slug,
      categorySlug: categorySlug,
      subcategorySlug: subcategorySlug,
    })),
    ...cruises.map((cruise: NileCruise) => ({
      id: cruise.id,
      image: cruise.image,
      title: cruise.title,
      description: cruise.description,
      price: cruise.price_from,
      rating: cruise.rating,
      reviewCount: cruise.reviewCount || 0,
      duration: cruise.duration,
      location: cruise.location,
      slug: cruise.slug,
      categorySlug: cruise.categorySlug,
      subcategorySlug: cruise.subcategorySlug,
    })),
  ];

  const categoryName = category.name ?? categorySlug;
  const subcategoryName = subcategory.name ?? subcategorySlug;
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
