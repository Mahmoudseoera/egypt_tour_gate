import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getPostsByCategory } from '../../../lib/api/blogData';
import Breadcrumb from '@/components/layout/breadcrumb';

interface CategoryPageProps {
  params: Promise<{
    subCategorySlug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = getCategoryBySlug(resolvedParams.subCategorySlug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.title} - Egypt Travel Blog | Egypt Tours Gate`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = getCategoryBySlug(resolvedParams.subCategorySlug);
  
  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(resolvedParams.subCategorySlug);

  return (
    <div className="min-h-screen bg-grey-light">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blogs', href: '/blogs' },
          { label: category.title, href: `/blogs/${resolvedParams.subCategorySlug}` }
        ]}
      />

      {/* Category Hero */}
      <section className="relative bg-gradient-to-br from-navy via-[#3d3586] to-navy py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-9xl">
            {category.icon}
          </div>
          <div className="absolute bottom-10 left-10 w-32 h-32 border-4 border-gold rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-7xl mb-6">{category.icon}</div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {category.title}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              {category.description}
            </p>
            <div className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-semibold">{posts.length} Article{posts.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">📝</div>
                <h2 className="text-3xl font-bold text-navy mb-4">No Articles Yet</h2>
                <p className="text-gray-600 mb-8">
                  We&aposre working on creating amazing content for this category. Check back soon!
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
                    key={post.slug}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <Link href={`/blogs/${resolvedParams.subCategorySlug}/${post.slug}`}>
                      <div className="relative h-64 bg-gradient-to-br from-navy/20 to-gold/20 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-24 h-24 text-gold/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-gold text-navy px-3 py-1 rounded-full text-sm font-bold">
                            {category.icon} {category.title}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                          <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                          <span className="text-gold">•</span>
                          <span>{post.readTime}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag}
                              className="bg-grey-light text-navy px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-navy flex items-center justify-center text-white font-bold">
                              {post.author.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
                            </div>
                          </div>
                          
                          <svg className="w-6 h-6 text-gold group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
              <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to All Categories</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}