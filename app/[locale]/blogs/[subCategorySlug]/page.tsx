import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryPageData } from '@/lib/api/blog';
import Breadcrumb from '@/components/layout/breadcrumb';
import PageCover from '@/components/shared/page-cover';
import SchemaScript from '@/components/seo/schema-script';
import { breadcrumbSchema, buildSeoMetadata, collectionPageSchema } from '@/lib/seo';
export const revalidate = 300;

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    subCategorySlug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, subCategorySlug } = await params;
  const data = await getCategoryPageData(subCategorySlug, locale);

  if (!data) return { title: 'Category Not Found' };

  return buildSeoMetadata({
    seoHtml: data.category.seo,
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

  const { category, posts } = data;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blogs', href: '/blogs' },
    { label: category.title, href: `/blogs/${subCategorySlug}` },
  ];

  const categorySchema = [
    collectionPageSchema({
      name: category.title,
      description: category.description,
      path: `/blogs/${subCategorySlug}`,
      image: category.cover ?? category.image,
    }),
    breadcrumbSchema(breadcrumbItems),
  ];

  return (
    <div className="min-h-screen bg-grey-light">
      <SchemaScript schema={categorySchema} />

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <PageCover
        cover={category.cover ?? { image: category.image, alt: category.imageAlt, title: category.title }}
        title={category.title}
        subtitle={category.description}
        label="Travel Blog"
      />



      {/* Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">📝</div>
                <h2 className="text-3xl font-bold text-navy mb-4">No Articles Yet</h2>
                <p className="text-gray-600 mb-8">
                  We&apos;re working on creating amazing content for this category. Check back soon!
                </p>
                <Link
                  href="/blogs"
                  className="inline-block bg-gold hover:bg-gold/90 text-navy px-6 py-3 rounded-full font-bold transition-all"
                >
                  Browse All Categories
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <Link href={`/blogs/${subCategorySlug}/${post.slug}`}>
                      {/* Thumbnail */}
                      <div className="relative h-64 bg-gradient-to-br from-navy/20 to-gold/20 overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.imageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-gold text-navy px-3 py-1 rounded-full text-sm font-bold">
                            {category.title}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                          <time dateTime={post.publishedAt}>{post.date}</time>
                        </div>

                        <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                        <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                          <svg
                            className="w-6 h-6 text-gold group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
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
              <span>Back to All Categories</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
