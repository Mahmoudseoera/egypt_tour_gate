// app/blogs/[subCategorySlug]/[blogslug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, User, Calendar, ArrowLeft, Share2, Tag } from "lucide-react";
import FallbackImage from "@/components/shared/fallback-image";
import { 
  getArticleDetailBySlug, 
  getCategoryBySlug, 
  getAllBlogCategories,
  BlogPost,
  BlogCategory 
} from "@/lib/api/blog";
import Breadcrumb from "@/components/layout/breadcrumb";
import SchemaScript from "@/components/seo/schema-script";
import ExpandableDescription from "@/components/shared/expandable-description";
import { breadcrumbSchema, buildSeoMetadata, absoluteUrl } from "@/lib/seo";
export const revalidate = 1800;

type BlogDetailsPageProps = {
  params: Promise<{
    locale: string;
    subCategorySlug: string;
    blogslug: string;
  }>;
};

export async function generateMetadata({ params }: BlogDetailsPageProps): Promise<Metadata> {
  const { locale, subCategorySlug, blogslug } = await params;
  const data = await getArticleDetailBySlug(blogslug, locale);
  
  if (!data?.post) return { title: "Blog Not Found" };
  
  const post = data.post;
  
  return buildSeoMetadata({
    seoHtml: post.seo,
    title: `${post.title} | Egypt Tours Gate Blog`,
    description: post.excerpt,
    path: `/blogs/${subCategorySlug}/${blogslug}`,
    locale,
    image: post.image,
    type: "article",
  });
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { locale, blogslug } = await params;
  
  // Fetch article data from API
  const data = await getArticleDetailBySlug(blogslug, locale);
  
  if (!data?.post) notFound();
  
  const post = data.post;
  const imagehero = data?.post.image;
  const relatedPosts = data.relatedPosts ?? [];
  const relatedtours = data?.related_tours ?? [];
  console.log("relatedtours", relatedtours)
  console.log("image hero ",imagehero)
  // Fetch category for breadcrumb
  const category = await getCategoryBySlug(post.categorySlug, locale);
  
  // Fetch all categories for sidebar
  const allCategories = await getAllBlogCategories(locale);
  
  const publishDate = new Date(post.publishedAt);
  
  // Schema.org structured data
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Person", name: post.author.name },
    publisher: {
      "@type": "Organization",
      name: "Egypt Tours Gate",
      logo: { "@type": "ImageObject", url: "https://www.egypttoursgate.com/uploads/settings/logo2.png" },
    },
    image: post.image,
    url: absoluteUrl(`/blogs/${post.categorySlug}/${post.slug}`),
  };
   
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blogs', href: '/blogs' },
    { label: category?.title || post.categoryTitle, href: `/blogs/${post.categorySlug}` },
    { label: post.title, href: `/blogs/${post.categorySlug}/${post.slug}` },
  ];

  const schema = [blogSchema, breadcrumbSchema(breadcrumbItems)];

  return (
    <>
      <SchemaScript schema={schema} />
      
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      <div className="relative h-[500px] w-full">
        <FallbackImage
          src={imagehero}
          alt={post.imageAlt || post.title}
          fill
          className="object-cover"       
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-8 lg:px-16 pb-12">
            <div className="max-w-4xl">
              <Link
                href={`/blogs/${post.categorySlug}`}
                className="inline-flex items-center gap-2 bg-[var(--main-color)] text-[var(--second-color)] px-4 py-2 rounded-full text-sm font-bold mb-4 hover:bg-white transition-colors"
              >
                <span>{category?.icon}</span>
                <span>{category?.title || post.categoryTitle}</span>
              </Link>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[var(--main-color)]" />
                  <span className="font-medium">{post.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[var(--main-color)]" />
                  <span>{publishDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[var(--main-color)]" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-8">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-[var(--second-color)] hover:text-[var(--main-color)] transition-colors mb-8 group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-semibold">Back to Blog</span>
            </Link>

            <article className="bg-white rounded-3xl shadow-lg p-8 md:p-12 blog-details-body">
              <div className="text-xl text-gray-700 leading-relaxed mb-8 pb-8 border-b border-gray-200 italic">
                <ExpandableDescription text={post.excerpt} maxLength={140} />
              </div>

              {/* Render full HTML content from API */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-[var(--second-color)] prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[var(--main-color)] prose-a:no-underline hover:prose-a:underline prose-strong:text-[var(--second-color)] prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags - conditional render */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Tag className="w-5 h-5 text-[var(--main-color)]" />
                    <span className="font-semibold text-[var(--second-color)]">Tags: </span>
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blogs?tag=${tag.toLowerCase().replace(/\s+/g, "-")}`}
                        className="px-4 py-2 bg-gray-100 hover:bg-[var(--main-color)] hover:text-white rounded-full text-sm font-medium transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Info */}
              <div className="mt-12 pt-8 border-t border-gray-200 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--main-color)] to-[var(--second-color)] flex items-center justify-center text-white text-2xl font-bold">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[var(--second-color)] text-lg">{post.author.name}</p>
                  <p className="text-gray-600">Travel Writer & Egypt Expert</p>
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <span className="font-semibold text-[var(--second-color)]">Share this article:</span>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[var(--main-color)] hover:text-white flex items-center justify-center transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-[var(--second-color)] mb-8">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blogs/${relatedPost.categorySlug}/${relatedPost.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.imageAlt || relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3 text-sm">
                          <User className="w-4 h-4 text-[var(--main-color)]" />
                          <span className="text-gray-600">{relatedPost.author.name}</span>
                        </div>
                        <h3 className="font-bold text-lg text-[var(--second-color)] group-hover:text-[var(--main-color)] transition-colors line-clamp-2 mb-3">
                          {relatedPost.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{relatedPost.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}


             </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-10 space-y-8">
              
              {/* Categories Widget */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-[var(--main-grey)] border-b border-gray-200">
                  <h3 className="text-lg font-bold text-[var(--second-color)] flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--main-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Blog Categories
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {allCategories.map((blogCategory) => (
                      <li key={blogCategory.slug}>
                        <Link 
                          href={`/blogs/${blogCategory.slug}`}
                          className="flex items-center justify-between text-[var(--black-color)] hover:text-[var(--main-color)] transition-colors group"
                        >
                          <span className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200">
                            <span>{blogCategory.icon}</span>
                            <span>{blogCategory.title}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {relatedtours.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 bg-[var(--main-grey)] border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--second-color)]">
                      Related Tours
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">
                      {relatedtours.length} tours
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {relatedtours.map((tour) => (
                      <Link
                        key={tour.id}
                        href={`/${tour.subCategory.categorySlug}/${tour.subCategory.subCategorySlug}/${tour.slug}`}
                        className="flex gap-3 p-4 hover:bg-gray-50 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={tour.media.image}
                            alt={tour.media.alt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="80px"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--second-color)] leading-snug line-clamp-2 group-hover:text-[var(--main-color)] transition-colors">
                            {tour.name}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              {/* map-pin inline svg — no external dep */}
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                              {tour.city}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                              {tour.duration} {tour.duration_type}
                            </span>
                          </div>

                          <div className="mt-1.5">
                            <span className="text-sm font-bold text-[var(--second-color)]">
                              ${tour.price_after_discount}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">/ person</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
