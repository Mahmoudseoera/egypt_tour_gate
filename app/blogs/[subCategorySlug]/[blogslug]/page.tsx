'use client';

import { useState } from 'react';
import Link from "next/link";
import Image from 'next/image';

// Types
interface TableOfContentItem {
  id: number;
  title: string;
}

interface BlogPost {
  title: string;
  author: string;
  authorAvatar?: string;
  date: string;
  category: string;
  heroImage: string;
  content: string;
  tableOfContents: TableOfContentItem[];
}

interface Tour {
  id: number;
  title: string;
  duration: string;
  image: string;
  slug?: string;
}

interface Category {
  name: string;
  count: number;
}

interface RelatedPost {
  id: number;
  title: string;
  author: string;
  date: string;
  image: string;
}

interface BlogDetailsPageProps {
  post?: BlogPost;
  relatedTours?: Tour[];
  categories?: Category[];
  relatedPosts?: RelatedPost[];
  onTourClick?: (tourId: number) => void;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export default function BlogDetailsPage({ 
  post,
  relatedTours,
  categories,
  relatedPosts,
  onTourClick,
  whatsappNumber = "1234567890",
  whatsappMessage = "Hello! I'm interested in your Egypt tours"
}: BlogDetailsPageProps) {
  const [tocOpen, setTocOpen] = useState(true);

  // Default data
  const defaultPost: BlogPost = {
    title: "What Is The Sphinx And Why Does It Have A Secret?",
    author: "Maria",
    date: "2024-08-14",
    category: "Egypt Tours Guide",
    heroImage: "/assets/images/blogs/camel front of giza pyramids.jpg",
    content: `
      <p>The Sphinx is mysterious and reviled by the Egyptians for ages. It is an ancient Egyptian structure. It is estimated that the enormous edifice, which resembles a lion with a human head, was created approximately 2500 BC. While the Sphinx is well-known, few individuals are aware of its mysteries.</p>

      <h3>What is the Sphinx?</h3>
      <p>The Great Sphinx of Giza is a colossal limestone statue with a human head is known as the Sphinx. It supposedly foster guard over Pharaoh Khafre's famous entry into Egypt. Many theories suggest it is either Khafre, the son of Khufu, who built the Great Pyramid.</p>

      <h3>The Historical of the Sphinx</h3>
      <p>The Great Sphinx of Giza, an enormous statue with a lion's body and a human head, is situated in the Giza pyramid complex in Egypt, and is accepted to have been worked almost 4500 BC.</p>

      <h3>Who Constructed the Sphinx?</h3>
      <p>Ancient Egyptians constructed the Great Sphinx about 4,500 years ago. It is still a bit of a puzzle as to who exactly built this magnificent structure.</p>

      <h3>Conclusion</h3>
      <p>Although the Sphinx is a well-known representation of Egypt, mystery it conceals it is still. For the most recent information on this age-old mystery, see our Egypt Tours gate blogs.</p>
    `,
    tableOfContents: [
      { id: 1, title: "What is the Sphinx?" },
      { id: 2, title: "The Historical of the Sphinx" },
      { id: 3, title: "Who Constructed the Sphinx?" },
      { id: 4, title: "How was the Sphinx built?" },
      { id: 5, title: "What is the Sphinx's Secret?" },
      { id: 6, title: "Conclusion" }
    ]
  };

  const defaultTours: Tour[] = [
    {
      id: 1,
      title: "Giza Pyramids, Sphinx And Sakkara From Alexandria Port",
      duration: "85$",
      image: "/assets/images/blogs/camel front of giza pyramids.jpg"
    },
    {
      id: 2,
      title: "Giza Pyramids, Sphinx And Sakkara From Alexandria Port",
      duration: "75$",
      image: "/assets/images/blogs/camel front of giza pyramids.jpg"
    },
    {
      id: 3,
      title: "Giza Pyramids, Sphinx And Sakkara Day Excursion From Sokhna Port",
      duration: "100",
      image: "/assets/images/blogs/camel front of giza pyramids.jpg"
    }
  ];

  const defaultCategories: Category[] = [
    { name: "Travel", count: 12 },
    { name: "Guide", count: 10 },
    { name: "Rental", count: 14 },
    { name: "Adventure", count: 16 },
    { name: "Vacation", count: 20 },
    { name: "Tips", count: 15 }
  ];

  const defaultRelatedPosts: RelatedPost[] = [
    {
      id: 1,
      title: "How to Travel on a Budget: Affordable Destinations & Tips",
      author: "Bryan",
      date: "14 May 2025",
      image: "/assets/images/blogs/camel front of giza pyramids.jpg"
    },
    {
      id: 2,
      title: "The Ultimate Guide to Solo Travel: Tips for First-Time Travelers",
      author: "Michell",
      date: "14 May 2025",
      image: "/assets/images/blogs/camel front of giza pyramids.jpg"
    },
    {
      id: 3,
      title: "Top 10 Breath taking Destinations You Must Visit in 2025",
      author: "Bafield",
      date: "14 May 2025",
      image: "/assets/images/blogs/camel front of giza pyramids.jpg"
    }
  ];

  const blogPost = post || defaultPost;
  const tours = relatedTours || defaultTours;
  const cats = categories || defaultCategories;
  const relPosts = relatedPosts || defaultRelatedPosts;

  const handleTourClick = (tourId: number) => {
    if (onTourClick) {
      onTourClick(tourId);
    }
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

const styles =`
 @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@400;700&display=swap');

        * {
          box-sizing: border-box;
        }

        h1, h2, h3 {
          font-family: 'Playfair Display', serif;
        }

        body {
          font-family: 'Lato', sans-serif;
        }

        .blog-content h3 {
          color: var(--second-color);
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .blog-content p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
          color: var(--black-color);
        }

        .blog-content ul {
          list-style: none;
          padding-left: 0;
          margin: 1.5rem 0;
        }

        .blog-content ul li {
          position: relative;
          padding-left: 2rem;
          margin-bottom: 0.75rem;
          color: var(--black-color);
        }

        .blog-content ul li::before {
          content: '◆';
          position: absolute;
          left: 0;
          color: var(--main-color);
          font-size: 0.875rem;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }`

  return (
    <>
    <style dangerouslySetInnerHTML={{ __html: styles }} />
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300 via-purple-400 to-purple-300">
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <svg className="absolute top-0 left-0 w-full h-full">
              <path d="M 100 50 Q 300 100, 500 150" stroke="#5eabc7" strokeWidth="3" strokeDasharray="8,12" fill="none"/>
              <path d="M 200 100 Q 500 50, 800 200" stroke="#5eabc7" strokeWidth="3" strokeDasharray="8,12" fill="none"/>
              <path d="M 1200 100 Q 1000 300, 800 400" stroke="#5eabc7" strokeWidth="3" strokeDasharray="8,12" fill="none"/>
            </svg>
            
            {/* Decorative airplane */}
            <div className="absolute top-20 left-1/4">
              <svg width="60" height="60" viewBox="0 0 100 100" className="text-teal-500">
                <path d="M50 40 L30 50 L20 48 L50 40 Z M50 40 L30 30 L20 32 L50 40 Z M50 40 L80 40 L90 45 L85 50 L80 40 Z" fill="currentColor"/>
              </svg>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute top-12 right-1/4 w-6 h-6 bg-teal-400 rounded-full opacity-60"></div>
            <div className="absolute bottom-1/3 left-1/4 w-5 h-5 bg-blue-300 rounded-full opacity-60"></div>
          </div>
        </div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                {blogPost.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[var(--main-color)] transition-colors underline underline-offset-4">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[var(--main-color)] transition-colors underline underline-offset-4">Blog</Link>
            <span>/</span>
            <Link href="/blog/egypt-tours-guide" className="hover:text-[var(--main-color)] transition-colors underline underline-offset-4">Egypt Tours Guide</Link>
            <span>/</span>
            <span className="text-[var(--second-color)] font-medium capitalize">
              {blogPost.title.length > 50 ? blogPost.title.substring(0, 50) + '...' : blogPost.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Content - Blog Post */}
          <div className="lg:col-span-8">
            {/* Featured Image */}
            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
              <Image 
              width={1600}
              height={400}
                src={blogPost.heroImage} 
                alt={blogPost.title}
                className="w-full h-[400px] object-cover"
              />
            </div>

            {/* Post Meta */}
            <div className="mb-6 flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--main-color)] flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">
                    {getAuthorInitials(blogPost.author)}
                  </span>
                </div>
                <span className="font-medium text-sm">{blogPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="#e3b75e" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{blogPost.date}</span>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="mb-12 border border-[var(--main-color)] rounded-xl overflow-hidden bg-white shadow-md">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-[var(--main-grey)] hover:bg-gray-100 transition-colors"
                aria-expanded={tocOpen}
                aria-label="Toggle table of contents"
              >
                <h2 className="text-lg font-bold text-[var(--second-color)]">
                  In this article:
                </h2>
                <svg 
                  className={`w-5 h-5 text-[var(--second-color)] transition-transform duration-300 ${tocOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${tocOpen ? 'max-h-[500px]' : 'max-h-0'}`}
              >
                <div className="px-6 py-4 bg-white">
                  <ol className="space-y-2">
                    {blogPost.tableOfContents.map((item) => (
                      <li key={item.id} className="group">
                        <a 
                          href={`#section-${item.id}`}
                          className="flex items-start gap-3 text-[var(--black-color)] hover:text-[var(--main-color)] transition-colors py-1"
                        >
                          <span className="text-[var(--main-color)] font-semibold min-w-[20px] text-sm">
                            {item.id}.
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform duration-200 text-sm">
                            {item.title}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none mb-16"
              style={{
                '--tw-prose-body': 'var(--black-color)',
                '--tw-prose-headings': 'var(--second-color)',
                '--tw-prose-links': 'var(--main-color)',
              } as React.CSSProperties}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
                className="text-[var(--black-color)] leading-relaxed blog-content"
              />
            </div>
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
                    Categories
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {cats.map((category, index) => (
                      <li key={index}>
                        <a 
                          href={`/category/${category.name.toLowerCase()}`}
                          className="flex items-center justify-between text-[var(--black-color)] hover:text-[var(--main-color)] transition-colors group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {category.name}
                          </span>
                          <span className="text-gray-500 text-sm">({category.count})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Related Posts Widget */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-[var(--main-grey)] border-b border-gray-200">
                  <h3 className="text-lg font-bold text-[var(--second-color)] flex items-center gap-2">
                    <svg className="w-5 h-5 text-[var(--main-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    Related Posts
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {relPosts.map((relPost) => (
                      <li key={relPost.id} className="group">
                        <a href={`/blog/${relPost.id}`} className="flex gap-3">
                          <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden">
                            <Image 
                              width={100}
                              height={80}
                              src={relPost.image} 
                              alt={relPost.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-[var(--black-color)] group-hover:text-[var(--main-color)] transition-colors line-clamp-2 mb-1">
                              {relPost.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span>{relPost.author}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{relPost.date}</span>
                              </div>
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Related Tours Section */}
      <div className="bg-[var(--main-grey)] py-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--second-color)] mb-2">Related Tours</h2>
            <div className="w-20 h-1 bg-[var(--main-color)]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <div 
                key={tour.id}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => handleTourClick(tour.id)}
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 bg-[var(--main-color)] text-white text-sm font-semibold rounded-full shadow-md">
                      {tour.duration}
                    </span>
                  </div>
                  <Image 
                    src={tour.image}
                    width={150}
                    height={100}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[var(--second-color)] mb-4 line-clamp-2 group-hover:text-[var(--main-color)] transition-colors">
                    {tour.title}
                  </h3>
                  <button className="w-full py-3 px-6 bg-[var(--second-color)] hover:bg-[var(--main-color)] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md">
                    View Tour
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
