import React, { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';

const TravelTourSlider = () => {
  const swiperContainerRef = useRef(null);
  const [favorites, setFavorites] = useState({});

  const tours = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80',
      title: 'From its medieval origins to the digital era',
      description: '40 impressive UNESCO World Heritage sites which bear witness to over 2,000 years of the city history.',
      price: '€145',
      city: 'Venice'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
      title: 'Discover Ancient Wonders',
      description: 'Explore breathtaking archaeological sites and immerse yourself in rich cultural heritage spanning millennia.',
      price: '€199',
      city: 'Paris'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
      title: 'European Cultural Journey',
      description: 'Experience the finest museums, galleries, and historic landmarks across iconic European destinations.',
      price: '€175',
      city: 'Rome'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      title: 'Magical City Exploration',
      description: 'Discover the enchanting streets and historical monuments of this beautiful European capital.',
      price: '€165',
      city: 'Barcelona'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
      title: 'Mediterranean Paradise',
      description: 'Experience the stunning coastline and rich cultural heritage of Mediterranean destinations.',
      price: '€210',
      city: 'Athens'
    }
  ];

  useEffect(() => {
    // Load Swiper CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.css';
    document.head.appendChild(link);

    // Load Swiper JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js';
    script.async = true;
    
    script.onload = () => {
      if (window.Swiper && swiperContainerRef.current) {
        new window.Swiper(swiperContainerRef.current, {
          slidesPerView: 1,
          spaceBetween: 24,
          loop: true,
          autoplay: {
            delay: 3500,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          },
        });
      }
    };
    
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="travel-slider-container">
      <style jsx>{`
        :root {
          --main-color: #e3b75e;
          --second-color: #272262;
          --white-color: #fff;
          --black-color: #333;
          --main-grey: #f9f9f9;
          --swiper-theme-color: var(--main-color);
          --swiper-pagination-bullet-inactive-color: #ddd;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .travel-slider-container {
          min-height: 100vh;
          background-color: var(--main-grey);
          padding: 60px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slider-wrapper {
          width: 100%;
          max-width: 1400px;
          position: relative;
        }

        .swiper {
          padding: 20px 0 60px 0;
        }

        .swiper-slide {
          height: auto;
        }

        .tour-card {
          background: var(--white-color);
          overflow: visible;
          position: relative;
          height: 100%;
        }

        .ticket-shape {
          position: relative;
          background: var(--white-color);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .ticket-shape::before,
        .ticket-shape::after {
          content: '';
          position: absolute;
          width: 40px;
          height: 40px;
          background: var(--main-grey);
          border-radius: 50%;
          z-index: 2;
        }

        .ticket-shape::before {
          left: -20px;
          top: 280px;
        }

        .ticket-shape::after {
          right: -20px;
          top: 280px;
        }

        .ticket-divider {
          position: absolute;
          top: 280px;
          left: 20px;
          right: 20px;
          height: 2px;
          background-image: repeating-linear-gradient(
            to right,
            var(--main-grey) 0,
            var(--main-grey) 8px,
            transparent 8px,
            transparent 16px
          );
          z-index: 1;
        }

        .tour-image-wrapper {
          position: relative;
          width: 100%;
          height: 280px;
          overflow: hidden;
        }

        .tour-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .tour-card:hover .tour-image {
          transform: scale(1.08);
        }

        .favorite-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 3;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .favorite-btn:hover {
          transform: scale(1.1);
          background: var(--white-color);
        }

        .favorite-btn.active {
          background: var(--main-color);
        }

        .city-badge {
          position: absolute;
          bottom: 16px;
          left: 16px;
          background: var(--second-color);
          color: var(--white-color);
          padding: 8px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
          z-index: 3;
        }

        .tour-content {
          padding: 28px 24px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .tour-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--black-color);
          line-height: 1.4;
          margin-bottom: 12px;
          min-height: 56px;
        }

        .tour-description {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tour-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
        }

        .price-tag {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .price-label {
          font-size: 12px;
          color: #999;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .price-value {
          font-size: 32px;
          font-weight: 800;
          color: var(--main-color);
        }

        .book-btn {
          background: var(--second-color);
          color: var(--white-color);
          border: none;
          padding: 12px 28px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .book-btn:hover {
          background: #1a1848;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(39, 34, 98, 0.3);
        }

        .swiper-button-next,
        .swiper-button-prev {
          width: 50px;
          height: 50px;
          background: var(--white-color);
          border: 2px solid var(--main-color);
          border-radius: 50%;
          color: var(--main-color);
          font-weight: bold;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: var(--main-color);
          color: var(--white-color);
          box-shadow: 0 6px 20px rgba(227, 183, 94, 0.4);
        }

        .swiper-pagination {
          bottom: 10px !important;
        }

        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: var(--swiper-pagination-bullet-inactive-color);
          opacity: 1;
        }

        .swiper-pagination-bullet-active {
          background: var(--main-color);
          width: 32px;
          border-radius: 6px;
        }

        @media (max-width: 1024px) {
          .swiper-button-next {
            right: 10px;
          }
          
          .swiper-button-prev {
            left: 10px;
          }
        }

        @media (max-width: 768px) {
          .travel-slider-container {
            padding: 40px 10px;
          }

          .tour-title {
            font-size: 18px;
            min-height: auto;
          }

          .tour-description {
            font-size: 13px;
          }

          .price-value {
            font-size: 28px;
          }

          .swiper-button-next,
          .swiper-button-prev {
            width: 40px;
            height: 40px;
          }

          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 16px;
          }
        }
      `}</style>

      <div className="slider-wrapper">
        <div className="swiper" ref={swiperContainerRef}>
          <div className="swiper-wrapper">
            {tours.map((tour) => (
              <div key={tour.id} className="swiper-slide">
                <div className="tour-card">
                  <div className="ticket-shape">
                    <div className="tour-image-wrapper">
                      <img 
                        src={tour.image} 
                        alt={tour.title}
                        className="tour-image"
                      />
                      <button 
                        className={`favorite-btn ${favorites[tour.id] ? 'active' : ''}`}
                        onClick={() => toggleFavorite(tour.id)}
                        aria-label="Add to favorites"
                      >
                        <Heart 
                          size={20} 
                          fill={favorites[tour.id] ? '#fff' : 'none'}
                          color={favorites[tour.id] ? '#fff' : '#333'}
                          strokeWidth={2.5}
                        />
                      </button>
                      <div className="city-badge">{tour.city}</div>
                    </div>
                    
                    <div className="ticket-divider"></div>
                    
                    <div className="tour-content">
                      <h2 className="tour-title">{tour.title}</h2>
                      
                      <p className="tour-description">
                        {tour.description}
                      </p>
                      
                      <div className="tour-footer">
                        <div className="price-tag">
                          <span className="price-label">Price</span>
                          <span className="price-value">{tour.price}</span>
                        </div>
                        
                        <button className="book-btn">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </div>
  );
};

export default TravelTourSlider;