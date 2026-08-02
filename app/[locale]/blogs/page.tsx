// Blog posts  page //  app/blogs/[subCategorySlug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPageData } from '@/lib/api/blog';
import { buildSeoMetadata } from '@/lib/seo';
import { getT } from "@/lib/hooks/getT";
import FallbackImage from "@/components/shared/fallback-image";
export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>; 
}): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await getBlogPageData(locale);

  return buildSeoMetadata({
    seo: pageData.seo,
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
  const t = await getT("blogs");
  const commonT = await getT("common");
  const { locale } = await params;
  const { subTitle, title, description, cover, categories } = await getBlogPageData(locale);
  return (
    <div className="min-h-screen bg-grey-light">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="bg-gradient-to-br from-navy via-[#3d3586] to-navy absolute inset-0 z-[1] opacity-75">
        </div>
        <FallbackImage src={cover} fill sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw, 33vw" alt={t("egypt_travel_blog_tours_tips_cultural")} 
          className="object-cover object-center" />
        <div className="absolute inset-0 z-20 opacity-10">
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
            <div className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white">
              <span className='font-semibold'>
                {categories.length} {t("categor")}{categories.length !== 1 ? "ies" : "y"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-navy mb-12 text-center">
              {t("articles")}
            </h2>

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blogs/${category.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-gray-100 bg-white shadow-[0_10px_35px_rgba(30,26,94,0.08)] transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/45 hover:shadow-[0_22px_55px_rgba(30,26,94,0.16)]"
                >
                  <div className="relative h-60 overflow-hidden bg-gray-100">
                    <FallbackImage
                      src={category.image}
                      alt={category.imageAlt || category.title}
                      title={category.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />

                    <div className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-navy/55 text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-navy rtl:group-hover:-rotate-45">
                      <svg
                        className="h-5 w-5 rtl:-scale-x-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 17 17 7M7 7h10v10"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="relative flex flex-1 flex-col px-6 pb-6 pt-7">
                    <span className="absolute start-6 top-0 h-1 w-14 -translate-y-1/2 rounded-full bg-gold transition-all duration-500 group-hover:w-24" />

                    <h3 className="mb-3 text-xl font-bold leading-snug text-navy transition-colors duration-300 group-hover:text-gold">
                      {category.title}
                    </h3>

                    {category.description && (
                      <p className="line-clamp-3 text-sm leading-7 text-gray-600">
                        {category.description}
                      </p>
                    )}

                    <div className="mt-auto flex items-center gap-2 border-t border-gray-100 pt-5 text-sm font-bold text-navy transition-colors duration-300 group-hover:text-gold">
                      <span>{commonT("view_details")}</span>
                      <svg
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
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
              {t("ready_to_start_your_egyptian_adventure")}</h2>
            <p className="text-xl text-white/90 mb-8">
              {t("let_our_expert_team_craft_the")}</p>
            <Link
              href="/contact"
              className="inline-block bg-gold hover:bg-gold/90 text-navy px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              {t("plan_your_trip_today")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
