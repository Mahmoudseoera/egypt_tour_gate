//  tour Details Page //

import type { Metadata } from 'next';
import TourDetailsClient from "./TourDetailsClient";
import { notFound } from "next/navigation";
import categoriesData from "@/lib/api/categories";
import type { Tour, TourPackage, NileCruise } from "@/lib/api/categories";
import Breadcrumb from '@/components/layout/breadcrumb';
import ExpandableDescription from '@/components/shared/expandable-description';
import SchemaScript from '@/components/seo/schema-script';
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

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  const { tourSlug } = await params;
  const item = findTourBySlug(tourSlug);

  if (!item) {
    return { title: 'Tour Not Found' };
  }

  const description = 'short_description' in item && item.short_description
    ? item.short_description
    : 'description' in item && item.description
      ? item.description
      : `${item.title} with Egypt Tours Gate.`;

  return {
    title: `${item.title} | Egypt Tours Gate`,
    description,
  };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { categorySlug, subcategorySlug, tourSlug } = await params;

  const item = findTourBySlug(tourSlug);
  if (!item) {
    notFound();
  }

  const shortDescription = 'short_description' in item && item.short_description
    ? item.short_description
    : 'description' in item && item.description
      ? item.description
      : `${item.title} with Egypt Tours Gate.`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: item.title,
    description: shortDescription,
    url: `https://www.egypttoursgate.com/${categorySlug}/${subcategorySlug}/${tourSlug}`,
    offers: {
      '@type': 'Offer',
      price: item.price_from,
      priceCurrency: 'USD',
    },
  };

  return (
    <main className="bg-main-grey">
      <SchemaScript schema={schema} />
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: categorySlug.replace(/-/g, ' '), href: `/${categorySlug}` },
          { label: subcategorySlug.replace(/-/g, ' '), href: `/${categorySlug}/${subcategorySlug}` },
          { label: item.title, href: `/${categorySlug}/${subcategorySlug}/${tourSlug}` },
        ]}
      />

      <div className="container py-10 max-w-7xl mx-auto">
        <div className="tour-title rounded-xl border border-gray-200 bg-white p-4 sm:p-5 mb-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl sm:text-3xl font-bold text-navy leading-snug">{item.title}</h1>
            <div className="shrink-0 bg-white/95 px-3 py-2 rounded-lg shadow border border-gray-100">
              <p className="text-navy font-bold text-sm sm:text-xl whitespace-nowrap">{"From $" + item.price_from}</p>
            </div>
          </div>
          <div className="mt-3">
            <ExpandableDescription text={shortDescription} maxLength={220} />
          </div>
        </div>

        <TourDetailsClient />
      </div>
    </main>

  );
}
