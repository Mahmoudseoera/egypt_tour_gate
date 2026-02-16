import Link from "next/link";
import categoriesData from "@/lib/api/categories";
import SecondTourCard from "@/components/tour/second-tour-card";
import type { Tour, TourPackage, NileCruise } from "@/lib/api/categories";

type SubcategoryPageProps = {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
};

async function getGeneralCategories(baseUrl: string) {
  const res = await fetch(`${baseUrl}/general`, { cache: "no-store" });
  const data = await res.json();
  return data.data?.header?.headerCategories ?? [];
}

export default async function SubcategoryPage({
  params,
}: SubcategoryPageProps) {
  const { categorySlug, subcategorySlug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local"
    );
  }

  const headerCategories = await getGeneralCategories(baseUrl);
  const category = headerCategories.find(
    (c: { slug: string }) => c.slug === categorySlug
  );
  const subcategory = category?.children?.find(
    (ch: { slug: string }) => ch.slug === subcategorySlug
  );

  if (!category || !subcategory) {
    return (
      <div className="container py-10">
        <p className="text-lg">Category or subcategory not found.</p>
        <Link
          href="/"
          className="text-[var(--main-color)] underline mt-4 inline-block"
        >
          Back to home
        </Link>
      </div>
    );
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

  // Normalize all items to a common structure for SecondTourCard
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

  const categoryName = category.name?.en ?? categorySlug;
  const subcategoryName = subcategory.name?.en ?? subcategorySlug;

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border border-gray-200">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[var(--main-color)]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/${categorySlug}`}
              className="hover:text-[var(--main-color)] transition-colors"
            >
              {categorySlug.replace(/-/g, " ")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-navy font-medium uppercase">
              {subcategorySlug.replace(/-/g, " ")}
            </span>
          </nav>
        </div>
      </div>
      
      <section className="container py-10 max-w-7xl mx-auto">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center text-[var(--second-color)]">
            {categoryName}
          </h1>
          <h2 className="text-xl text-gray-600 mb-8 text-center">
            {subcategoryName}
          </h2>

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