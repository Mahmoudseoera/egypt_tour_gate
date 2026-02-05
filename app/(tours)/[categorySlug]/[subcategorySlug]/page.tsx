//  Sub Category Page //

import Link from "next/link";
import Image from "next/image";
import categoriesData from "@/lib/api/categories";
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

  // Get items for this category + subcategory (day tours by city; packages/cruises by category)
  const { tours, packages, nile_cruises } = categoriesData;

  const dayTours = tours.filter(
    (t: Tour) => t.category === categorySlug && t.city === subcategorySlug
  );

  const packageItems = packages.filter(
    (p: TourPackage) => p.category === categorySlug
  );

  const cruises = nile_cruises.filter(() => categorySlug === "nile-cruises");

  type ListItem = (Tour | TourPackage | NileCruise) & {
    slug: string;
    title: string;
    price_from: number;
  };
  const items: ListItem[] = [
    ...dayTours,
    ...(categorySlug === "egypt-tour-packages" ? packageItems : []),
    ...(categorySlug === "nile-cruises" ? cruises : []),
  ] as ListItem[];

  const categoryName = category.name?.en ?? categorySlug;
  const subcategoryName = subcategory.name?.en ?? subcategorySlug;

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
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
        <section className="tours-page">
          <div className="container mx-auto py-16">
            <h1 className="text-3xl font-bold mb-2 text-center">
              {categoryName}
            </h1>
            <h2 className="text-xl text-gray-600 mb-8 text-center">
              {subcategoryName}
            </h2>

            {items.length === 0 ? (
              <p className="text-lg">No tours found for this subcategory.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${categorySlug}/${subcategorySlug}/${item.slug}`}
                    className="group block bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-shadow border border-gray-100"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      {/* src={(item as Tour & TourPackage & NileCruise).image ?? "/placeholder.svg"} */}
                      <Image
                        src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-sm font-semibold">
                        ${item.price_from}+
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-navy group-hover:text-[var(--main-color)]">
                        {item.title}
                      </h3>
                      {"short_description" in item &&
                        (item as Tour).short_description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {(item as Tour).short_description}
                          </p>
                        )}
                      {"duration" in item && (
                        <p className="text-sm text-gray-500 mt-2">
                          {item.duration}
                        </p>
                      )}
                      {"rating" in item && (
                        <span className="inline-block mt-2 text-sm font-medium">
                          ★ {item.rating}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </>
  );
}
