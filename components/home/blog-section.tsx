import { ArrowRight, User } from 'lucide-react';

export default function TravelBlogSection() {
  const blogPosts = [
    {
      id: 1,
      author: "Aidan Butler",
      date: { day: "14", month: "June" },
      title: "Resources for your first trip to overseas vacation",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80",
      link: "#",
      type: "small"
    },
    {
      id: 2,
      author: "Poul Ward",
      date: { day: "28", month: "June" },
      title: "Step by step guide to planning your ideal holiday",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80",
      link: "#",
      type: "small"
    },
    {
      id: 3,
      author: "Ricardo Bell",
      date: { day: "26", month: "June" },
      title: "How to get acquainted with natives in a strange land",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
      link: "#",
      type: "small"
    },
    {
      id: 4,
      author: "Poul Ward",
      date: { day: "28", month: "June" },
      title: "Step by step guide to planning your ideal holiday",
      image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80",
      link: "#",
      type: "medium"
    },
    {
      id: 5,
      author: "Martin Hicks",
      date: { day: "20", month: "June" },
      title: "Resources for your first trip to overseas vacation",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80",
      link: "#",
      type: "small"
    },
    {
      id: 6,
      author: "Joey Peterson",
      date: { day: "08", month: "JUNE" },
      title: "The Top Travel Destinations for Photography Enthusiasts",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      link: "#",
      type: "featured"
    }
  ];

  const styles = `
    .blog-card-hover {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .blog-card-hover:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .blog-image {
      transition: transform 0.6s ease;
    }

    .blog-card-hover:hover .blog-image {
      transform: scale(1.1);
    }

    .blog-overlay {
      position: relative;
      overflow: hidden;
    }

    .blog-overlay::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%);
      z-index: 1;
      transition: opacity 0.4s ease;
    }

    .blog-card-hover:hover .blog-overlay::before {
      opacity: 0.9;
    }

    .blog-content {
      position: relative;
      z-index: 2;
    }

    .blog-fade-in {
      animation: blogFadeIn 0.6s ease-out forwards;
      opacity: 0;
    }

    .blog-fade-in:nth-child(1) { animation-delay: 0.1s; }
    .blog-fade-in:nth-child(2) { animation-delay: 0.2s; }
    .blog-fade-in:nth-child(3) { animation-delay: 0.3s; }
    .blog-fade-in:nth-child(4) { animation-delay: 0.4s; }
    .blog-fade-in:nth-child(5) { animation-delay: 0.5s; }
    .blog-fade-in:nth-child(6) { animation-delay: 0.6s; }

    @keyframes blogFadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .cta-button {
      transition: all 0.3s ease;
    }

    .cta-button:hover {
      background-color: #272262;
      transform: translateX(5px);
    }

    .cta-button:hover .arrow-icon {
      transform: translateX(5px);
    }

    .arrow-icon {
      transition: transform 0.3s ease;
    }

    .clickable-link {
      cursor: pointer;
      transition: opacity 0.3s ease;
    }

    .clickable-link:hover {
      opacity: 0.8;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div style={{ backgroundColor: '#f9f9f9' }} className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 3 Small Cards */}
            <div className="flex flex-col gap-6 h-full">
              {blogPosts.slice(0, 3).map((post) => (
                <div key={post.id} className="blog-card-hover blog-fade-in bg-white rounded-3xl overflow-hidden shadow-md flex-1">
                  <div className="flex items-center gap-4 p-4 h-full">
                    {/* Image - Clickable */}
                    <a href={post.link} className="clickable-link flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden blog-overlay">
                      <img 
                        src={post.image}
                        alt={post.title}
                        className="blog-image w-full h-full object-cover"
                      />
                    </a>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4" style={{ color: '#e3b75e' }} />
                        <h4 style={{ color: '#e3b75e' }} className="font-bold text-sm">{post.author}</h4>
                      </div>
                      <a href={post.link} className="clickable-link block">
                        <p style={{ color: '#272262' }} className="font-semibold text-base leading-snug line-clamp-2">
                          {post.title}
                        </p>
                      </a>
                    </div>

                    {/* Date Badge */}
                    <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-sm min-w-[60px]">
                      <div style={{ backgroundColor: '#fff', borderColor: '#e3b75e' }} className="text-center px-3 py-2 border-b-2">
                        <div style={{ color: '#272262' }} className="text-xl font-bold leading-none">{post.date.day}</div>
                      </div>
                      <div style={{ backgroundColor: '#272262' }} className="text-center px-3 py-1">
                        <div className="text-white text-xs font-medium">{post.date.month}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Middle Column - Medium Card */}
            <div className="blog-card-hover blog-fade-in blog-overlay rounded-3xl overflow-hidden shadow-md relative h-full min-h-[600px]">
              <a href={blogPosts[3].link} className="clickable-link block h-full">
                <img 
                  src={blogPosts[3].image}
                  alt={blogPosts[3].title}
                  className="blog-image absolute inset-0 w-full h-full object-cover"
                />
                <div className="blog-content absolute bottom-0 left-0 right-0 p-8">
                  {/* Date Badge */}
                  <div className="inline-block rounded-xl overflow-hidden shadow-lg mb-4">
                    <div style={{ backgroundColor: '#fff', borderColor: '#e3b75e' }} className="text-center px-4 py-2 border-b-2">
                      <div style={{ color: '#272262' }} className="text-2xl font-bold leading-none">{blogPosts[3].date.day}</div>
                    </div>
                    <div style={{ backgroundColor: '#272262' }} className="text-center px-4 py-2">
                      <div className="text-white text-xs font-medium">{blogPosts[3].date.month}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4" style={{ color: '#e3b75e' }} />
                    <h4 style={{ color: '#e3b75e' }} className="font-bold text-lg">{blogPosts[3].author}</h4>
                  </div>
                  <p className="text-white font-semibold text-xl leading-snug">
                    {blogPosts[3].title}
                  </p>
                </div>
              </a>
            </div>

            {/* Right Column - Small Card + Large Featured */}
            <div className="flex flex-col gap-6 h-full">
              {/* Small Card */}
              <div className="blog-card-hover blog-fade-in bg-white rounded-3xl overflow-hidden shadow-md">
                <div className="flex items-center gap-4 p-4">
                  {/* Image - Clickable */}
                  <a href={blogPosts[4].link} className="clickable-link flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden blog-overlay">
                    <img 
                      src={blogPosts[4].image}
                      alt={blogPosts[4].title}
                      className="blog-image w-full h-full object-cover"
                    />
                  </a>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" style={{ color: '#e3b75e' }} />
                      <h4 style={{ color: '#e3b75e' }} className="font-bold text-sm">{blogPosts[4].author}</h4>
                    </div>
                    <a href={blogPosts[4].link} className="clickable-link block">
                      <p style={{ color: '#272262' }} className="font-semibold text-base leading-snug line-clamp-2">
                        {blogPosts[4].title}
                      </p>
                    </a>
                  </div>

                  {/* Date Badge */}
                  <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-sm min-w-[60px]">
                    <div style={{ backgroundColor: '#fff', borderColor: '#e3b75e'  }} className="text-center px-3 py-2 border-b-2">
                      <div style={{ color: '#272262' }} className="text-xl font-bold leading-none">{blogPosts[4].date.day}</div>
                    </div>
                    <div style={{ backgroundColor: '#272262' }} className="text-center px-3 py-1">
                      <div className="text-white text-xs font-medium">{blogPosts[4].date.month}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Large Featured Card */}
              <div className="blog-card-hover blog-fade-in blog-overlay rounded-3xl overflow-hidden shadow-md relative flex-1 min-h-[400px]">
                <a href={blogPosts[5].link} className="clickable-link block h-full">
                  <img 
                    src={blogPosts[5].image}
                    alt={blogPosts[5].title}
                    className="blog-image absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="blog-content absolute top-6 right-6">
                    {/* Date Badge */}
                    <div className="rounded-xl overflow-hidden shadow-lg">
                      <div style={{ backgroundColor: '#fff' }} className="text-center px-5 py-3 border-b-2">
                        <div style={{ color: '#272262' }} className="text-3xl font-bold leading-none">{blogPosts[5].date.day}</div>
                      </div>
                      <div style={{ backgroundColor: '#e3b75e', borderColor: '#e3b75e'}} className="text-center px-5 py-2">
                        <div style={{ color: '#272262' }} className="text-sm font-bold">{blogPosts[5].date.month}</div>
                      </div>
                    </div>
                  </div>
                  <div className="blog-content absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5" style={{ color: '#e3b75e' }} />
                      <h4 style={{ color: '#e3b75e' }} className="font-bold text-base">By {blogPosts[5].author}</h4>
                    </div>
                    <p className="text-white font-bold text-2xl leading-tight">
                      {blogPosts[5].title}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12 text-center">
            <button 
              className="cta-button inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg text-white shadow-lg"
              style={{ backgroundColor: '#e3b75e' }}
            >
              <span>Explore All Articles</span>
              <ArrowRight className="arrow-icon w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}