import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { blogCategories, getLatestPosts } from '@/lib/api/blogData';

export const metadata: Metadata = {
  title: 'Egypt Travel Blog - Tours, Tips & Cultural Guides | Egypt Tours Gate',
  description: 'Explore our comprehensive guides on Egyptian tours, travel tips, cultural experiences, and historical insights. Plan your perfect Egyptian adventure with expert advice.',
};

export default function BlogsPage() {
  const latestPosts = getLatestPosts(6);

  return (
    <div className="min-h-screen bg-grey-light">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-[#3d3586] to-navy py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-gold rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-gold rotate-45"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gold opacity-20 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Egypt Travel Insights
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Your complete resource for exploring Egypt&aposs wonders. From ancient pyramids to modern travel tips, 
              discover everything you need for an unforgettable journey through the land of pharaohs.
            </p>
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
              {blogCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blogs/${category.slug}`}
                  className="group block bg-grey-light rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-56 bg-gradient-to-br from-navy/80 to-navy/60 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl opacity-30 group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="mt-4 flex items-center text-gold font-semibold group-hover:gap-3 gap-2 transition-all">
                      <span>Explore articles</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-16 bg-grey-light">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-navy mb-12 text-center">
              Latest Articles
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
                >
                  <Link href={`/blogs/${post.categorySlug}/${post.slug}`}>
                    <div className="relative h-64 bg-gradient-to-br from-navy/20 to-gold/20 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-24 h-24 text-gold/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
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
                      
                      <div className="flex items-center justify-between">
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
