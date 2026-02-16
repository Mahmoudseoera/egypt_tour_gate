// app/blogs/[subCategorySlug]/[blogslug]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, User, Calendar, ArrowLeft, Share2, Tag, MapPin, Star } from "lucide-react";
import { getPostBySlug, getRelatedPosts, getCategoryBySlug, blogCategories } from "@/lib/api/blogData";
import categoriesData from "@/lib/api/categories";

type BlogDetailsPageProps = {
  params: Promise<{
    subCategorySlug: string;
    blogslug: string;
  }>;
};

// Helper function to get related tours based on blog tags and content
function getRelatedTours(post: any, limit: number = 3) {
  const { tours, packages: tourPackages, nile_cruises } = categoriesData;
  
  // Extract city/location keywords from blog tags and content
  const keywords = [
    ...post.tags.map((tag: string) => tag.toLowerCase()),
    post.title.toLowerCase(),
    post.excerpt.toLowerCase(),
  ].join(' ');

  const allTours = [
    ...tours.map(t => ({ ...t, type: 'tour', routePath: `/egypt-day-tours/${t.city}/${t.slug}` })),
    ...tourPackages.map(p => ({ ...p, type: 'package', city: 'egypt', routePath: `/egypt-tour-packages/${p.slug}` })),
    ...nile_cruises.map(c => ({ ...c, type: 'cruise', city: c.location, routePath: `/nile-cruises/${c.subcategorySlug}/${c.slug}` })),
  ];

  // Score tours based on relevance
  const scoredTours = allTours.map(tour => {
    let score = 0;
    const tourText = `${tour.title} ${(tour as any).city || ''} ${(tour as any).short_description || ''}`.toLowerCase();
    
    // Check for city matches
    if (keywords.includes('cairo') && tourText.includes('cairo')) score += 3;
    if (keywords.includes('luxor') && tourText.includes('luxor')) score += 3;
    if (keywords.includes('aswan') && tourText.includes('aswan')) score += 3;
    if (keywords.includes('hurghada') && tourText.includes('hurghada')) score += 3;
    if (keywords.includes('giza') && tourText.includes('giza')) score += 3;
    
    // Check for activity matches
    if (keywords.includes('pyramid') && tourText.includes('pyramid')) score += 2;
    if (keywords.includes('temple') && tourText.includes('temple')) score += 2;
    if (keywords.includes('cruise') && tour.type === 'cruise') score += 2;
    if (keywords.includes('nile') && tour.type === 'cruise') score += 2;
    if (keywords.includes('diving') && tourText.includes('diving')) score += 2;
    if (keywords.includes('desert') && tourText.includes('desert')) score += 2;
    
    return { ...tour, score };
  });

  // Sort by score and return top results
  return scoredTours
    .filter(tour => tour.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { subCategorySlug, blogslug } = await params;

  // Get the blog post
  const post = getPostBySlug(blogslug);
  
  if (!post) {
    notFound();
  }

  // Get category info
  const category = getCategoryBySlug(post.categorySlug);
  
  // Get related posts
  const relatedPosts = getRelatedPosts(post, 3);
  
  // Get related tours
  const relatedTours = getRelatedTours(post, 3);

  const publishDate = new Date(post.publishedAt);

  return (
    <div className="min-h-screen bg-[var(--main-grey)]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[var(--main-color)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-[var(--main-color)] transition-colors">
              Blogs
            </Link>
            <span>/</span>
            <Link
              href={`/blogs/${post.categorySlug}`}
              className="hover:text-[var(--main-color)] transition-colors"
            >
              {category?.title || post.categorySlug}
            </Link>
            <span>/</span>
            <span className="text-[var(--second-color)] font-medium line-clamp-1">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[500px] w-full">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-8 lg:px-16 pb-12">
            <div className="max-w-4xl">
              {/* Category Badge */}
              <Link
                href={`/blogs/${post.categorySlug}`}
                className="inline-flex items-center gap-2 bg-[var(--main-color)] text-[var(--second-color)] px-4 py-2 rounded-full text-sm font-bold mb-4 hover:bg-white transition-colors"
              >
                <span>{category?.icon}</span>
                <span>{category?.title || post.categorySlug}</span>
              </Link>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[var(--main-color)]" />
                  <span className="font-medium">{post.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[var(--main-color)]" />
                  <span>
                    {publishDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
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
          {/* Main Article Content */}
          <div className="lg:col-span-8">
            {/* Back Button */}
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-[var(--second-color)] hover:text-[var(--main-color)] transition-colors mb-8 group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-semibold">Back to Blog</span>
            </Link>

            {/* Article Content */}
            <article className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
              {/* Excerpt */}
              <div className="text-xl text-gray-700 leading-relaxed mb-8 pb-8 border-b border-gray-200 italic">
                {post.excerpt}
              </div>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-[var(--second-color)] prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[var(--main-color)] prose-a:no-underline hover:prose-a:underline prose-strong:text-[var(--second-color)] prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Tag className="w-5 h-5 text-[var(--main-color)]" />
                    <span className="font-semibold text-[var(--second-color)]">Tags:</span>
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
                  <p className="font-bold text-[var(--second-color)] text-lg">
                    {post.author.name}
                  </p>
                  <p className="text-gray-600">Travel Writer & Egypt Expert</p>
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <span className="font-semibold text-[var(--second-color)]">
                    Share this article:
                  </span>
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
                <h2 className="text-3xl font-bold text-[var(--second-color)] mb-8">
                  Related Articles
                </h2>
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
                          alt={relatedPost.title}
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

          {/* Right Sidebar */}
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
                    {blogCategories.map((blogCategory) => (
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

              {/* Related Tours Widget */}
              {relatedTours.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 bg-[var(--main-grey)] border-b border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--second-color)] flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[var(--main-color)]" />
                      Related Tours
                    </h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-4">
                      {relatedTours.map((tour) => (
                        <li key={tour.id} className="group">
                          <Link href={tour.routePath} className="flex gap-3">
                            <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden">
                              <Image 
                                width={80}
                                height={64}
                                src={tour.image || "/placeholder.svg"} 
                                alt={tour.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-[var(--black-color)] group-hover:text-[var(--main-color)] transition-colors line-clamp-2 mb-1">
                                {tour.title}
                              </h4>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-[var(--main-color)] text-[var(--main-color)]" />
                                  <span>{tour.rating}</span>
                                </div>
                                <span className="font-semibold text-[var(--main-color)]">
                                  ${tour.price_from}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link 
                      href="/egypt-day-tours"
                      className="block mt-6 text-center px-4 py-2 bg-[var(--main-color)] text-white rounded-lg font-semibold hover:bg-[var(--second-color)] transition-colors"
                    >
                      View All Tours
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
