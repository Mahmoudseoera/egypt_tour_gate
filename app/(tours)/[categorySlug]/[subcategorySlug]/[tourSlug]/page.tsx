//  tour Details Page //

import Link from "next/link";
import TourDetailsClient from "./TourDetailsClient";
import Image from 'next/image';
import { notFound } from "next/navigation";
import categoriesData from "@/lib/api/categories";
import type { Tour, TourPackage, NileCruise } from "@/lib/api/categories";
import "@/styles/tour-details.css";

type TourDetailPageProps = {
  params: Promise<{
    categorySlug: string;
    subcategorySlug: string;
    tourSlug: string;
  }>;
};
function findTourBySlug(slug: string): Tour | TourPackage | NileCruise | null {
  const tour = categoriesData.tours.find((t) => t.slug === slug);
  if (tour) return tour;
  const pkg = categoriesData.packages.find((p) => p.slug === slug);
  if (pkg) return pkg;
  const cruise = categoriesData.nile_cruises.find((c) => c.slug === slug);
  if (cruise) return cruise;
  return null;
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { categorySlug, subcategorySlug, tourSlug } = await params;

  const item = findTourBySlug(tourSlug);
  if (!item) {
    notFound();
  }

  const isTour = "city" in item;
  const isPackage = "includes" in item;
  const isCruise = "route" in item;

  return (
    <main className="bg-main-grey">
          {/* Breadcrumb */}
          <div className="bg-[#fff]  border-gray-200">
        <div className="container mx-auto px-4 md:px-8  py-4">
        <nav className="text-sm text-gray-500">
        <Link href="/" className="hover:text-[var(--main-color)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/${categorySlug}`} className="hover:text-[var(--main-color)] underline">
          {categorySlug.replace(/-/g, " ")}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/${categorySlug}/${subcategorySlug}`}
          className="hover:text-[var(--main-color)] underline"
        >
          {subcategorySlug.replace(/-/g, " ")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-navy font-medium">{item.title}</span>
      </nav>
        </div>
      </div>
        <div className="container py-10 max-w-7xl mx-auto">
      {/* <div className="relative h-80 w-full rounded-xl overflow-hidden mb-8">
        <Image
          src={item.image ?? "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 896px) 100vw, 896px"
        />

      </div> */}
       <div className="tour-title relative">
       <h1 className="text-3xl font-bold text-navy mb-4">{item.title}</h1>
      <div className="absolute bottom-4 right-4 bg-white/95 px-4 py-2 rounded-lg shadow">
          <p className="text-navy font-bold text-xl">{"From $" + item.price_from}</p>
        </div>
       </div>

       <TourDetailsClient />
      {"short_description" in item && item.short_description && (
        <p className="text-lg text-gray-700 mb-6">{item.short_description}</p>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        {"duration" in item && (
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
            {item.duration}
          </span>
        )}
        {"rating" in item && (
          <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm font-medium">
            ★ {item.rating}
          </span>
        )}
        {isTour && (
          <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm">
            {(item as Tour).city}
          </span>
        )}
      </div>

      {isTour && (item as Tour).highlights && (item as Tour).highlights!.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Highlights</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {(item as Tour).highlights!.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </section>
      )}

      {isPackage && (item as TourPackage).includes && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Includes</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {(item as TourPackage).includes!.map((inc, i) => (
              <li key={i}>{inc}</li>
            ))}
          </ul>
        </section>
      )}

      {isCruise && (item as NileCruise).route && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Route</h2>
          <p className="text-gray-700">
            {(item as NileCruise).route.join(" → ")}
          </p>
        </section>
      )}

      {/* <div className="flex gap-4 mt-8">
        <Link
          href={`/${categorySlug}/${subcategorySlug}`}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back to list
        </Link>
        <a
          href="#"
          className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-[var(--main-color)] font-medium"
        >
          Book now
        </a>
      </div> */}
    </div>
    </main>

  );
}
