//  tour Details Page //

import type { Metadata } from 'next';
import TourDetailsClient from "./TourDetailsClient";
import { notFound } from "next/navigation";
import Breadcrumb from '@/components/layout/breadcrumb';
import ExpandableDescription from '@/components/shared/expandable-description';
import SchemaScript from '@/components/seo/schema-script';
import "@/styles/tour-details.css";
import { getGeneralCategories, getTourBySlug, getToursBySubcategory } from '@/lib/api/toursApi';
import { routing } from '@/lib/i18n/routing';

type TourDetailPageProps = {
  params: Promise<{
    locale: string;
    categorySlug: string;
    subcategorySlug: string;
    tourSlug: string;
  }>;
};

export async function generateStaticParams() {
  const result: Array<{
    locale: string;
    categorySlug: string;
    subcategorySlug: string;
    tourSlug: string;
  }> = [];

  for (const locale of routing.locales) {
    try {
      const categories = await getGeneralCategories(locale);
      for (const category of categories) {
        const subs = Array.isArray(category?.subs) ? category.subs : [];
        for (const subcategory of subs) {
          if (!category?.slug || !subcategory?.slug) continue;
          const tours = await getToursBySubcategory(subcategory.slug, locale);
          tours.forEach((tour) => {
            if (tour.slug) {
              result.push({
                locale,
                categorySlug: category.slug,
                subcategorySlug: subcategory.slug,
                tourSlug: tour.slug,
              });
            }
          });
        }
      }
    } catch {
      // Keep build resilient if API is unavailable.
    }
  }

  return result;
}

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  const { locale, tourSlug } = await params;
  const item = await getTourBySlug(tourSlug, locale);

  if (!item) {
    return { title: 'Tour Not Found' };
  }

  const description = item.short_description || item.description || `${item.title} with Egypt Tours Gate.`;

  return {
    title: `${item.title} | Egypt Tours Gate`,
    description,
  };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { locale, categorySlug, subcategorySlug, tourSlug } = await params;

  const item = await getTourBySlug(tourSlug, locale);
  if (!item) {
    notFound();
  }

  const shortDescription = item.short_description || item.description || `${item.title} with Egypt Tours Gate.`;

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
