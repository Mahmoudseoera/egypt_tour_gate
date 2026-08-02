import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Calendar, Clock, User } from "lucide-react";
import { getT } from "@/lib/hooks/getT";
import { getBlogPageData, getCategoryPageData } from "@/lib/api/blog";
import Breadcrumb from "@/components/layout/breadcrumb";
import ExpandableDescription from "@/components/shared/expandable-description";
import SchemaScript from "@/components/seo/schema-script";
import FallbackImage from "@/components/shared/fallback-image";
import {
  breadcrumbSchema,
  buildSeoMetadata,
  collectionPageSchema,
} from "@/lib/seo";
export const revalidate = 1800;

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    subCategorySlug: string;
  }>;
}

export async function generateStaticParams() {
  // This function generates params for *this* dynamic segment only. It has no
  // `subCategorySlug` input, so the old implementation requested
  // `/get-article-by-category/undefined` and returned a parameter belonging
  // to the child article route instead.
  const data = await getBlogPageData();

  return data.categories.map((category) => ({
    subCategorySlug: category.slug,
  }));
}
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, subCategorySlug } = await params;
  const data = await getCategoryPageData(subCategorySlug, locale);

  if (!data) return { title: "Category Not Found" };

  return buildSeoMetadata({
    // getCategoryPageData()/normaliseCategory() already converts the raw
    // HTML seo string from this endpoint into a structured ApiSeo object,
    // so this stays consistent with every other buildSeoMetadata() call.
    seo: data.category.seo,
    title: `${data.category.title} - Egypt Travel Blog | Egypt Tours Gate`,
    description: data.category.description,
    path: `/blogs/${subCategorySlug}`,
    locale,  
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, subCategorySlug } = await params;
  const data = await getCategoryPageData(subCategorySlug, locale);

  if (!data) notFound();
  const t = await getT("blogs");
  const commonT = await getT("common");
  const { category, posts } = data;

  const breadcrumbItems = [
    { label: commonT("home"), href: "/" },
    { label: commonT("blog"), href: "/blogs" },
    { label: category.title, href: `/blogs/${subCategorySlug}` },
  ];

  const categorySchema = [
    collectionPageSchema({
      name: category.title,
      description: category.description,
      path: `/blogs/${subCategorySlug}`,
      image: category.coverImage || category.image,
    }),
    breadcrumbSchema(breadcrumbItems),
  ];

  return (
    <div className="min-h-screen bg-grey-light">
      <SchemaScript schema={categorySchema} />
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Category Hero */}
      <section className="relative py-20 overflow-hidden">
        {/* Cover image background — falls back to gradient if no cover image */}
        {category.coverImage ? (
          <div className="absolute inset-0">
            <FallbackImage
              src={category.coverImage}
              alt={category.coverImageAlt}
              fill
              className="object-cover"
              sizes="100vw"
            />
            {/* Dark overlay so text stays readable over the photo */}
            <div className="absolute inset-0 bg-navy/70" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#3d3586] to-navy" />
        )}

        {/* Decorative ring — kept from original */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute bottom-10 left-10 w-32 h-32 border-4 border-gold rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {category.title}
            </h1>
            <div className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-semibold">
                {posts.length} {commonT("blog")}{posts.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          {category.description && (
            <ExpandableDescription
              text={category.description}
              maxLength={110}
              className="text-sm mb-5 text-white/90 leading-relaxed text-center [&>button]:text-gold"
            />
          )}
          <div className="max-w-7xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">{t("")}</div>
                <h2 className="text-3xl font-bold text-navy mb-4">
                  {t("no_articles_yet")}</h2>
                <p className="text-gray-600 mb-8">
                  {t("weaposre_working_on_creating_amazing_content")}</p>
                <Link
                  href="/blogs"
                  className="inline-block bg-gold hover:bg-gold/90 text-navy px-6 py-3 rounded-full font-bold transition-all"
                >
                  {t("browse_all_categories")}</Link>
              </div>
            ) : (
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-gray-100 bg-white shadow-[0_10px_35px_rgba(30,26,94,0.08)] transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/45 hover:shadow-[0_22px_55px_rgba(30,26,94,0.16)]"
                  >
                    <Link
                      href={`/blogs/${subCategorySlug}/${post.slug}`}
                      className="flex h-full flex-col"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-navy/20 to-gold/20">
                        <FallbackImage
                          src={post.image}
                          alt={post.imageAlt || post.title}
                          title={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />

                        <div className="absolute start-4 top-4">
                          <span className="inline-flex max-w-[15rem] items-center rounded-full border border-white/25 bg-navy/60 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                            {category.title}
                          </span>
                        </div>

                        <div className="absolute bottom-4 start-4 flex items-center gap-2 text-xs font-medium text-white/90">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 backdrop-blur-sm">
                            <Calendar className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                            <time dateTime={post.publishedAt}>{post.date}</time>
                          </span>

                          {/* {post.readTime && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 backdrop-blur-sm">
                              <Clock className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                              {post.readTime}
                            </span>
                          )} */}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-7">
                        <span className="absolute start-6 top-0 h-1 w-14 -translate-y-1/2 rounded-full bg-gold transition-all duration-500 group-hover:w-24" />

                        <div className="mb-4 flex items-center gap-2.5 text-xs font-semibold text-gray-500">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-gold shadow-sm">
                            <User className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="truncate">{post.author.name}</span>
                        </div>

                        <h3 className="mb-3 line-clamp-2 text-xl font-bold leading-snug text-navy transition-colors duration-300 group-hover:text-gold">
                          {post.title}
                        </h3>

                        <p className="mb-5 line-clamp-3 text-sm leading-7 text-gray-600">
                          {post.excerpt}
                        </p>

                        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">
                          <span className="text-sm font-bold text-navy transition-colors duration-300 group-hover:text-gold">
                            {commonT("read_more")}
                          </span>
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-gold shadow-sm transition-all duration-300 group-hover:rotate-45 group-hover:bg-gold group-hover:text-navy rtl:group-hover:-rotate-45">
                            <ArrowUpRight
                              className="h-5 w-5 rtl:-scale-x-100"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Back to All Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-navy hover:text-gold font-semibold text-lg transition-colors group"
            >
              <svg
                className="w-6 h-6 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>{t("back_to_all_categories")}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
