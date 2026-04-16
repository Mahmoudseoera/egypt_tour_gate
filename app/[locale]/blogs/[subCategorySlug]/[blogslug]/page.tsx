// app/blogs/[subCategorySlug]/[blogslug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, User, Calendar, ArrowLeft, Share2, Tag } from "lucide-react";
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

type BlogDetailsPageProps = {
  params: Promise<{
    subCategorySlug: string;
    blogslug: string;
  }>;
};

export async function generateMetadata({ params }: BlogDetailsPageProps): Promise<Metadata> {
  const { blogslug } = await params;
  const data = await getArticleDetailBySlug(blogslug);
  
  if (!data?.post) return { title: "Blog Not Found" };
  
  const post = data.post;
  
  // Parse SEO metadata from API response
  const seoTitle = post.seo?.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() || `${post.title} | Egypt Tours Gate Blog`;
  const seoDesc = post.seo?.match(/<meta name="description" content="([^"]*)"/i)?.[1]?.trim() || post.excerpt;
  
  return {
    title: seoTitle,
    description: seoDesc,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { blogslug } = await params;
  
  // Fetch article data from API
  const data = await getArticleDetailBySlug(blogslug);
  
  if (!data?.post) notFound();
  
  const post = data.post;
  const relatedPosts = data.relatedPosts;
  
  // Fetch category for breadcrumb
  const category = await getCategoryBySlug(post.categorySlug);
  
  // Fetch all categories for sidebar
  const allCategories = await getAllBlogCategories();
  
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
    url: `https://www.egypttoursgate.com/blogs/${post.categorySlug}/${post.slug}`,
  };

  return (
    <>
      <SchemaScript schema={blogSchema} />
      
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blogs', href: '/blogs' },
          { label: category?.title || post.categoryTitle, href: `/blogs/${post.categorySlug}` },
          { label: post.title, href: `/blogs/${post.categorySlug}/${post.slug}` },
        ]}
      />

      {/* Hero Section */}
      <div className="relative h-[500px] w-full">
        <Image
          src={post.image}
          alt={post.imageAlt || post.title}
          fill
          className="object-cover"
          priority
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

            <article className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
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

              {/* Related Tours Widget REMOVED - depends on categoriesData which is now deprecated */}
              {/* To restore this feature, create a separate API endpoint for tours */}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}