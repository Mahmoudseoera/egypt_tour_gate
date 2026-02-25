// All Category Page //
import type { Metadata } from 'next';
import Link from "next/link";
import Image from "next/image";
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/layout/breadcrumb';
import ExpandableDescription from '@/components/shared/expandable-description';
import SchemaScript from '@/components/seo/schema-script';

type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
};

const photos = [
  "/assets/images/tours/106896752__MG_7633-final_Pompeys_Pillar-webp.webp",
  "/assets/images/tours/camel front of giza pyramids.jpg",
  "/assets/images/tours/Pyramids-in-Egypt-webp.webp",
];

async function getCategoryData(categorySlug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local');
  }

  const res = await fetch(`${baseUrl}/general`, { cache: 'no-store' });
  const data = await res.json();
  const categories = data.data?.header?.headerCategories ?? [];

  return categories.find((cat: any) => cat.slug === categorySlug);
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategoryData(categorySlug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  const categoryName = category.name?.en ?? categorySlug;

  return {
    title: `${categoryName} Tours | Egypt Tours Gate`,
    description: `Explore ${categoryName} tours, itineraries, and travel options in Egypt with Egypt Tours Gate.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const category = await getCategoryData(categorySlug);

  if (!category) {
    notFound();
  }

  const categoryName = category.name?.en ?? categorySlug;
  const categoryDescription = `Browse all available ${categoryName} options and discover the best experiences curated by Egypt Tours Gate.`;

  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName,
    description: categoryDescription,
    url: `https://www.egypttoursgate.com/${categorySlug}`,
  };

  return (
    <>
      <SchemaScript schema={categorySchema} />
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: categoryName, href: `/${categorySlug}` },
        ]}
      />

      {/* ── Page Hero ── */}
      <div
        className="relative py-14 overflow-hidden"
        style={{ backgroundColor: 'var(--second-color)' }}
      >
        <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full opacity-10 bg-[var(--main-color)]" />
        <div className="absolute -bottom-14 -right-14 w-72 h-72 rounded-full opacity-10 bg-[var(--main-color)]" />

        <div className="relative z-10 text-center px-4">
          <p className="text-[var(--main-color)] font-semibold tracking-widest uppercase text-xs mb-3">
            Explore
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white capitalize leading-tight">
            {categoryName.toLowerCase()}
          </h1>
          <div className="max-w-3xl mx-auto mt-5">
            <ExpandableDescription text={categoryDescription} className="text-white [&>p]:text-white/90" />
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(category.children ?? []).map((child: any, index: number) => (
            <Link
              key={child.id}
              href={`/${category.slug}/${child.slug}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 border border-gray-100 hover:border-[var(--main-color)]"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="relative h-56 overflow-hidden flex-shrink-0">
                <Image
                  src={photos[child.id % photos.length]}
                  alt={child.name?.en ?? 'category'}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[var(--main-color)] shadow-md">
                  {category.name.en}
                </div>
              </div>

              <div className="flex flex-col flex-1 p-6 gap-4">
                <h3
                  className="text-xl font-bold capitalize leading-snug transition-colors duration-200 group-hover:text-[var(--main-color)]"
                  style={{ color: 'var(--second-color)' }}
                >
                  {child.name.en.toLowerCase()}
                </h3>

                <p className="text-sm leading-relaxed flex-1 text-[var(--black-color)] line-clamp-4">
                  Discover top {child.name.en} programs and tailor your perfect Egyptian journey.
                </p>

                <div className="pt-2 border-t border-gray-100">
                  <span
                    className="inline-flex items-center gap-2 w-full justify-center py-3 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-300 group-hover:gap-3"
                    style={{ backgroundColor: 'var(--second-color)' }}
                  >
                    View Tours
                  </span>
                </div>
              </div>

              <div
                className="h-1 w-full transition-all duration-500"
                style={{ backgroundColor: 'var(--main-color)' }}
              />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
