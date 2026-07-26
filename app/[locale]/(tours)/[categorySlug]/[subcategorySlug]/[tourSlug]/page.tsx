//  tour Details Page egypt_tour_gate\app\[locale]\(tours)\[categorySlug]\[subcategorySlug]\[tourSlug]\page.tsx//

import type { Metadata } from 'next';
import TourDetailsClient from "./TourDetailsClient";
import { notFound } from "next/navigation";
import Breadcrumb from '@/components/layout/breadcrumb';
import ExpandableDescription from '@/components/shared/expandable-description';
import SchemaScript from '@/components/seo/schema-script';
import { breadcrumbSchema, buildSeoMetadata, tourSchema } from '@/lib/seo';
import "@/styles/tour-details.css";
import { getTourBySlug } from '@/lib/api/toursApi';
export const revalidate = 3600;

type TourDetailPageProps = {
  params: Promise<{
    locale: string;
    categorySlug: string;
    subcategorySlug: string;
    tourSlug: string;
  }>;
};

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  const { locale, categorySlug, subcategorySlug, tourSlug } = await params;
  const item = await getTourBySlug(categorySlug, subcategorySlug, tourSlug, locale);
  const readableName = item?.title || tourSlug.replace(/-/g, " ");
  return buildSeoMetadata({
    seo: item?.seo,
    title: `${readableName} | Egypt Tours Gate`,
    description:
      item?.short_description ||
      item?.description ||
      `Explore ${readableName} with Egypt Tours Gate.`,
    path: `/${categorySlug}/${subcategorySlug}/${tourSlug}`,
    locale,
    image: item?.media?.image || item?.image || item?.images?.[0],
  });
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { locale, categorySlug, subcategorySlug, tourSlug } = await params;

  let item = null;
  try {
    item = await getTourBySlug(categorySlug, subcategorySlug, tourSlug, locale);
  } catch {
    item = null;
  }

  if (!item) {
    notFound();
  }

  const shortDescription = item.short_description || item.description || `${item.title} with Egypt Tours Gate.`;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: categorySlug.replace(/-/g, ' '), href: `/${categorySlug}` },
    { label: subcategorySlug.replace(/-/g, ' '), href: `/${categorySlug}/${subcategorySlug}` },
    { label: item.title, href: `/${categorySlug}/${subcategorySlug}/${tourSlug}` },
  ];

  const schema = [
    tourSchema({
      name: item.title,
      description: shortDescription,
      path: `/${categorySlug}/${subcategorySlug}/${tourSlug}`,
      image: item.media?.image || item.image || item.images?.[0],
      price: item.price_from,
      city: item.location,
      duration: item.duration,
      code: item.code,
    }),
    breadcrumbSchema(breadcrumbItems),
  ];

  return (
    <main className="bg-main-grey">
      <SchemaScript schema={schema} />
      <Breadcrumb items={breadcrumbItems} />
      <div className="container py-10 max-w-7xl mx-auto">
        <div className="tour-title rounded-xl border border-gray-200 bg-white p-4 sm:p-5 mb-4">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl sm:text-3xl font-bold text-navy leading-snug">{item.title}</h1>
            <div className="shrink-0 bg-white/95 px-3 py-2 rounded-lg shadow border border-gray-100">
              <p className="text-[var(--main-color)] font-bold text-sm sm:text-xl whitespace-nowrap">{"From $" + item.price_from}</p>
              {item.price_after_discount && item.price_after_discount < item.price_from && <span className="line-through text-gray-500">{"From $" + item.price_after_discount}</span>}
            </div>
          </div>
          <div className="mt-3">
            <ExpandableDescription text={shortDescription} maxLength={220} />
          </div>
        </div>

        <TourDetailsClient tour={item} />
      </div>
    </main>

  );
}
