import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPageData } from '@/lib/api/blog';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = "force-dynamic";
export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildSeoMetadata({
    title: 'Egypt Travel Blog - Tours, Tips & Cultural Guides | Egypt Tours Gate',
    description:
      'Explore our comprehensive guides on Egyptian tours, travel tips, cultural experiences, and historical insights. Plan your perfect Egyptian adventure with expert advice.',
    path: '/blogs',
    locale,
  });
}



export default async function BlogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { subTitle, title, description, categories } = await getBlogPageData(locale);

  return (
    <div className="min-h-screen bg-grey-light">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-[#3d3586] to-navy py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-gold rounded-full" />
          <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-gold rotate-45" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gold opacity-20 rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {subTitle && (
              <p className="text-gold font-semibold uppercase tracking-widest mb-3 text-sm">
                {subTitle}
              </p>
            )}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">{title}</h1>
            {description && (
              <p className="text-xl text-white/90 leading-relaxed">{description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-navy mb-12 text-center">
              Explore by Category
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blogs/${category.slug}`}
                  className="group block bg-grey-light rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
                        {category.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    {category.description && (
                      <p className="text-gray-600 leading-relaxed line-clamp-3">
                        {category.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center text-gold font-semibold gap-2 group-hover:gap-3 transition-all">
                      <span>Explore articles</span>
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-navy via-[#3d3586] to-navy">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Egyptian Adventure?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Let our expert team craft the perfect itinerary for your dream trip to Egypt
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gold hover:bg-gold/90 text-navy px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Plan Your Trip Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
