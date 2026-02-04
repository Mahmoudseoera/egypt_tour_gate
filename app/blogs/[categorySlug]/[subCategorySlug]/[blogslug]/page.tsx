'use client';

import { useState } from 'react';

// Types
interface TableOfContentItem {
  id: number;
  title: string;
}

interface BlogPost {
  title: string;
  author: string;
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
  price?: string;
}

interface BlogDetailsPageProps {
  post?: BlogPost;
  relatedTours?: Tour[];
  onTourClick?: (tourId: number) => void;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export default function BlogDetailsPage({ 
  post,
  relatedTours,
  onTourClick,
  whatsappNumber = "1234567890",
  whatsappMessage = "Hello! I'm interested in your Egypt tours"
}: BlogDetailsPageProps) {
  const [tocOpen, setTocOpen] = useState(true);

  // Default blog data if no post prop is provided
  const defaultPost: BlogPost = {
    title: "The Ultimate Guide to Solo Travel: Tips for First-Time Travelers",
    author: "Bryan Bradfield",
    date: "14 May 2025",
    category: "Travels",
    heroImage: "/api/placeholder/1200/600",
    content: `
      <p>Solo travel can be an incredibly empowering and enriching experience, offering you the freedom to explore the world at your own pace and make personal connections with different cultures. However, if it's your first time traveling solo, the idea can be both exciting and a bit intimidating. This guide provides essential tips to help you prepare for your adventure and make the most of your solo journey.</p>
      
      <p>When traveling solo, it's important to have a rough plan in place, especially if it's your first time. Research your destination, book accommodations in advance, and have a basic itinerary. However, don't over-plan! Leave some room for spontaneity so you can explore new opportunities and experiences that arise along the way.</p>
      
      <h3>Safety First</h3>
      <ul>
        <li>Prioritize safety by booking your first night's accommodation before you arrive.</li>
        <li>Bring only essentials to make moving around easier and keep your hands free.</li>
        <li>Have a small first-aid kit with basic supplies in case of minor injuries or health issues.</li>
      </ul>
      
      <p>Solo travel is a fantastic way to grow, explore, and discover new aspects of yourself and the world. While it may feel daunting at first, with the right preparation, mindset, and a bit of courage, it can become one of the most fulfilling experiences of your life.</p>
    `,
    tableOfContents: [
      { id: 1, title: "Introduction to Solo Travel" },
      { id: 2, title: "Planning Your First Solo Trip" },
      { id: 3, title: "Safety First" },
      { id: 4, title: "Making the Most of Your Journey" }
    ]
  };

  const defaultTours: Tour[] = [
    {
      id: 1,
      title: "Giza Pyramids, Sphinx And Sakkara From Alexandria Port",
      duration: "1 Day",
      image: "/api/placeholder/400/300"
    },
    {
      id: 2,
      title: "Giza Pyramids, Sphinx And Sakkara From Alexandria Port",
      duration: "1 Day",
      image: "/api/placeholder/400/300"
    },
    {
      id: 3,
      title: "Giza Pyramids, Sphinx And Sakkara Day Excursion From Sokhna Port",
      duration: "1 Day",
      image: "/api/placeholder/400/300"
    }
  ];

  const blogPost = post || defaultPost;
  const tours = relatedTours || defaultTours;

  const handleTourClick = (tourId: number) => {
    if (onTourClick) {
      onTourClick(tourId);
    }
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(blogPost.title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this article: ${blogPost.title}`);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
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
              <div className="inline-block mb-4">
                <span className="px-4 py-1.5 bg-[var(--main-color)] text-white text-sm font-semibold rounded-full shadow-lg">
                  {blogPost.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--second-color)] mb-4 leading-tight">
                {blogPost.title}
              </h1>
              <div className="flex items-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[var(--main-color)] flex items-center justify-center shadow-md">
                    <span className="text-sm font-semibold">
                      {getAuthorInitials(blogPost.author)}
                    </span>
                  </div>
                  <span className="font-medium">{blogPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{blogPost.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src={blogPost.heroImage} 
              alt={blogPost.title}
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* Table of Contents */}
          <div className="mb-12 border-2 border-[var(--main-color)] rounded-xl overflow-hidden bg-[var(--main-grey)] shadow-lg">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              aria-expanded={tocOpen}
              aria-label="Toggle table of contents"
            >
              <h2 className="text-xl font-bold text-[var(--second-color)] flex items-center gap-2">
                <svg className="w-6 h-6 text-[var(--main-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                In this article:
              </h2>
              <svg 
                className={`w-6 h-6 text-[var(--second-color)] transition-transform duration-300 ${tocOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ${tocOpen ? 'max-h-96' : 'max-h-0'}`}
              style={{ maxHeight: tocOpen ? '500px' : '0' }}
            >
              <div className="px-6 py-4 bg-white">
                <ol className="space-y-3">
                  {blogPost.tableOfContents.map((item) => (
                    <li key={item.id} className="group">
                      <a 
                        href={`#section-${item.id}`}
                        className="flex items-start gap-3 text-[var(--black-color)] hover:text-[var(--main-color)] transition-colors"
                      >
                        <span className="text-[var(--main-color)] font-semibold min-w-[24px]">
                          {item.id}.
                        </span>
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
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
              className="text-[var(--black-color)] leading-relaxed"
            />
          </div>

          {/* Social Share */}
          <div className="mb-16 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-[var(--second-color)] mb-4">Share this article:</h3>
            <div className="flex gap-3">
              <button 
                onClick={shareToFacebook}
                className="p-3 rounded-full bg-[#1877F2] hover:bg-[#0c5dcd] text-white transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button 
                onClick={shareToTwitter}
                className="p-3 rounded-full bg-[#1DA1F2] hover:bg-[#0c8bd9] text-white transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button 
                onClick={shareToWhatsApp}
                className="p-3 rounded-full bg-[#25D366] hover:bg-[#1da851] text-white transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Share on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
              <button 
                onClick={shareToLinkedIn}
                className="p-3 rounded-full bg-[#0077B5] hover:bg-[#005885] text-white transition-all duration-300 hover:scale-110 shadow-md"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
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
                  <img 
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[var(--second-color)] mb-4 line-clamp-2 group-hover:text-[var(--main-color)] transition-colors">
                    {tour.title}
                  </h3>
                  {tour.price && (
                    <p className="text-2xl font-bold text-[var(--main-color)] mb-4">
                      {tour.price}
                    </p>
                  )}
                  <button className="w-full py-3 px-6 bg-[var(--second-color)] hover:bg-[var(--main-color)] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md">
                    View Tour
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <a 
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 z-50"
      >
        <button 
          className="bg-[#25D366] hover:bg-[#1da851] text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
          aria-label="Contact us on WhatsApp"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
      </a>

      {/* TrustedSite Badge */}
      <div className="fixed bottom-8 right-8 z-50 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:shadow-xl transition-shadow">
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
        <span className="text-sm font-semibold text-gray-700">TrustedSite</span>
      </div>

      <style jsx>{`
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

        .prose h3 {
          color: var(--second-color);
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .prose p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
          color: var(--black-color);
        }

        .prose ul {
          list-style: none;
          padding-left: 0;
          margin: 1.5rem 0;
        }

        .prose ul li {
          position: relative;
          padding-left: 2rem;
          margin-bottom: 0.75rem;
          color: var(--black-color);
        }

        .prose ul li::before {
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
        }
      `}</style>
    </div>
  );
}
