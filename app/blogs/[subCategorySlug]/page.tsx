import { 
  getBlogCategoryBySlug, 
  getBlogPostsByCategory, 
  getBlogSubCategories,
  buildBlogBreadcrumb,
  hasSubCategories
} from "@/lib/api/blogData";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

/**
 * DYNAMIC CATEGORY PAGE
 * Route: /blogs/[category]
 * Shows all posts in a category OR subcategories if the category has children
 */

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Await params in Next.js 15+
  const { category: categorySlug } = await params;
  
  // Get category data
  const category = getBlogCategoryBySlug(categorySlug);
  
  // If category doesn't exist, show 404
  if (!category) {
    notFound();
  }
  
  // Get breadcrumb for navigation
  const breadcrumb = buildBlogBreadcrumb(categorySlug);
  
  // Check if this category has subcategories
  const hasChildren = hasSubCategories(categorySlug);
  const subCategories = getBlogSubCategories(categorySlug);
  
  // Get posts for this category (includes posts from child categories)
  const posts = getBlogPostsByCategory(categorySlug);

  return (
    <section className="category-page py-16 md:py-24 bg-[#f9f9f9] min-h-screen">
      <div className="container mx-auto px-4">
        {/* Breadcrumb Navigation - Shows hierarchical path */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link 
            href="/blogs" 
            className="text-gray-600 hover:text-[#e3b75e] transition-colors"
          >
            All Categories
          </Link>
          {breadcrumb.map((crumb, index) => (
            <div key={crumb.slug} className="flex items-center gap-2">
              <span className="text-gray-400">/</span>
              {index === breadcrumb.length - 1 ? (
                <span className="text-[#272262] font-semibold">{crumb.name}</span>
              ) : (
                <Link 
                  href={`/blogs/${crumb.slug}`}
                  className="text-gray-600 hover:text-[#e3b75e] transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Category Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="w-20 h-1.5 mx-auto mb-6 bg-[#e3b75e]"></div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#272262]">
            {category.name}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Show Subcategories if they exist */}
        {hasChildren && subCategories.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-[#272262]">Explore Subcategories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subCategories.map((subCat) => (
                <Link 
                  key={subCat.slug}
                  href={`/blogs/${subCat.slug}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={subCat.image}
                      alt={subCat.name}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 text-[#272262] group-hover:text-[#e3b75e] transition-colors">
                      {subCat.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {subCat.description}
                    </p>
                    <div className="mt-3 text-sm text-[#e3b75e] font-semibold">
                      {subCat.postCount} Articles →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-[#272262]">
              {hasChildren ? 'Latest Articles' : 'All Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article 
                  key={post.slug}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {/* Post Image with Link */}
                  <Link href={`/blogs/${categorySlug}/${post.slug}`}>
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>

                  {/* Post Content */}
                  <div className="p-6">
                    {/* Post Title with Link */}
                    <Link href={`/blogs/${categorySlug}/${post.slug}`}>
                      <h3 className="text-xl font-bold mb-3 text-[#272262] hover:text-[#e3b75e] transition-colors line-clamp-2 min-h-[3.5rem]">
                        {post.title}
                      </h3>
                    </Link>

                    {/* Post Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed min-h-[4.5rem]">
                      {post.excerpt}
                    </p>

                    {/* Post Meta - Author and Date */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        {/* Author Icon */}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <span>{post.readTime}</span>
                    </div>

                    {/* Read More Link/Button */}
                    <Link 
                      href={`/blogs/${categorySlug}/${post.slug}`}
                      className="inline-flex items-center gap-2 text-[#e3b75e] font-semibold hover:gap-3 transition-all duration-300"
                    >
                      <span>Read More</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          /* No Posts Message */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-[#272262] mb-2">No Articles Yet</h3>
            <p className="text-gray-600">Check back soon for new content in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Generate static params for all categories (for static site generation)
 * This is optional but improves performance
 */
export async function generateStaticParams() {
  const { blogCategories } = await import("@/lib/api/blogData");
  
  return blogCategories.map((category) => ({
    category: category.slug,
  }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getBlogCategoryBySlug(categorySlug);
  
  if (!category) {
    return {
      title: "Category Not Found",
    };
  }
  
  return {
    title: `${category.name} | Egypt Tours Blog`,
    description: category.description,
  };
}