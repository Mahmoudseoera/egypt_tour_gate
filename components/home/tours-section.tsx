"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import categoriesData from "@/lib/api/categories";
import type { Tour, TourPackage, NileCruise } from "@/lib/api/categories";

// styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type TourItem = (Tour | TourPackage | NileCruise) & {
  link: string;
  location: string;
};

export default function TravelTourSlider() {
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const prepareTourItems = (): TourItem[] => {
    const items: TourItem[] = [];

    categoriesData.tours.slice(0, 2).forEach(tour => {
      items.push({
        ...tour,
        link: `/${tour.category}/${tour.city}/${tour.slug}`,
        location: tour.city.charAt(0).toUpperCase() + tour.city.slice(1)
      });
    });

    categoriesData.packages.slice(0, 2).forEach(pkg => {
      items.push({
        ...pkg,
        link: `/${pkg.category}/${pkg.slug}`,
        location: "Egypt",
        city: "Egypt"
      } as TourItem);
    });

    categoriesData.nile_cruises.slice(0, 2).forEach(cruise => {
      items.push({
        ...cruise,
        link: `/${cruise.categorySlug}/${cruise.subcategorySlug}/${cruise.slug}`,
        location: cruise.location.charAt(0).toUpperCase() + cruise.location.slice(1),
        city: cruise.location
      } as TourItem);
    });

    return items;
  };

  const tourItems = prepareTourItems();

  return (
    <section className="home-tours min-h-screen bg-[var(--main-grey)] pt-16">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--second-color)] mb-4">
            Explore Our Amazing Destinations
          </h2>
          <span className={`
            relative block h-1 w-40 mb-4 mx-auto rounded-md
            bg-gradient-to-r from-[var(--second-color)] via-[var(--main-color)] to-[var(--second-color)]
            before:content-[''] before:absolute before:top-1/2 before:left-1/2 
            before:-translate-x-1/2 before:-translate-y-1/2 before:w-4 before:h-4 
            before:bg-[url('/assets/images/pryamids-2.svg')] before:bg-contain 
            before:bg-no-repeat before:z-20
            after:content-[''] after:absolute after:top-1/2 after:left-1/2 
            after:-translate-x-1/2 after:-translate-y-1/2 after:w-[26px] after:h-[26px] 
            after:bg-[var(--main-grey)] after:rounded-full after:z-0
          `}></span>
          <p className="text-lg text-[var(--black-color)] opacity-70 max-w-2xl mx-auto">
            Discover breathtaking locations around the world and create unforgettable memories
          </p>
        </div>

        {/* Swiper */}
        <div className="pb-16">
        <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            loop={true}
            slidesPerView={1.15} // Show partial next slide on mobile
            spaceBetween={20}
            centeredSlides={true} // Center active slide for visual effect
            speed={700}
            watchOverflow={true} // ✅ Prevent overflow/cutoff issues
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { 
                slidesPerView: 1.15, 
                spaceBetween: 15,
                centeredSlides: true 
              },
              768: { 
                slidesPerView: 2, 
                spaceBetween: 25,
                centeredSlides: false 
              },
              1024: { 
                slidesPerView: 3, 
                spaceBetween: 35,
                centeredSlides: false 
              },
            }}
            navigation
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            className="!pb-12"
            // ✅ Add padding via CSS to prevent last slide cutoff (see styles below)
          >
            {tourItems.map((tour) => (
              <SwiperSlide key={tour.id} className="!h-auto !px-2">
                <Link href={tour.link} className="block">
                  {/* Constrain card width to prevent "thick/wide" issue */}
                  <div className="tour-card group bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] h-full flex flex-col hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-all duration-300 w-full max-w-sm mx-auto">
                    {/* Image Section */}
                    <div className="relative w-full h-[280px] overflow-hidden rounded-t-3xl">
                      <Image
                        src={tour.image || "/placeholder.svg"}
                        alt={tour.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />

                      {/* Favorite Button */}
                      <button
                        className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-20 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-110 ${
                          favorites[tour.id] 
                            ? 'bg-[var(--main-color)]' 
                            : 'bg-white/95 hover:bg-white'
                        }`}
                        onClick={(e) => toggleFavorite(tour.id, e)}
                        aria-label="Add to favorites"
                      >
                        <Heart
                          size={20}
                          fill={favorites[tour.id] ? '#fff' : 'none'}
                          color={favorites[tour.id] ? '#fff' : '#333'}
                          strokeWidth={2.5}
                        />
                      </button>

                      {/* Location Badge */}
                      <div className="absolute bottom-4 flex items-center gap-2 left-4 bg-[rgba(255,255,255,0.5)] backdrop-blur-sm text-[var(--second-color)] px-3 py-2 rounded-full text-xs font-semibold tracking-wide z-20">
                        <MapPin size={16} className="text-indigo-900" />
                        {tour.location}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 pt-7 flex-1 flex flex-col">
                      <h2 className="text-xl font-bold text-[var(--black-color)] leading-snug mb-3 min-h-[56px] line-clamp-2 group-hover:text-[var(--main-color)] transition-colors">
                        {tour.title}
                      </h2>

                      <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1 line-clamp-3">
                        {'short_description' in tour 
                          ? tour.short_description 
                          : 'description' in tour 
                          ? tour.description 
                          : `Experience an unforgettable journey with our ${tour.duration} tour.`}
                      </p>

                      {/* Footer */}
                      <div className="relative flex items-center justify-between pt-4 border-t-8 border-dotted border-gray-200">
                        <div className="absolute top-[-25px] w-10 h-10 bg-gray-200 rounded-full left-[-50px] z-10 shadow-inner shadow-[0_8px_30px_rgba(0,0,0,0.12)]"></div>
                        <div className="absolute top-[-25px] w-10 h-10 bg-gray-200 rounded-full right-[-50px] z-10 shadow-inner shadow-[0_8px_30px_rgba(0,0,0,0.12)]"></div>
                        
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">From</span>
                          <span className="text-3xl font-extrabold text-[var(--main-color)]">
                            ${tour.price_from}
                          </span>
                        </div>

                        <div className="btn-effect bg-[var(--second-color)] text-white border-none px-7 py-3 rounded-full text-sm font-bold cursor-pointer transition-all duration-300 uppercase tracking-wide hover:bg-[#1a1848] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(39,34,98,0.3)]">
                          Book Now
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
   .home-tours:hover .swiper-button-next,
   .home-tours:hover .swiper-button-prev {
    opacity: 1;
    visibility: visible;
   }
  
  /* Navigation Buttons */
  .swiper-button-next,
  .swiper-button-prev {
    width: 50px !important;
    height: 50px !important;
    background: var(--white-color) !important;
    border: 2px solid var(--main-color) !important;
    border-radius: 50% !important;
    color: var(--main-color) !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.3s ease !important;
    top: 50% !important;
    margin-top: -25px !important;
    opacity: 0;
    visibility: hidden;
    z-index: 30 !important;
  }

  .swiper-button-next { right: 10px !important; }
  .swiper-button-prev { left: 10px !important; }

  .swiper-button-next:after,
  .swiper-button-prev:after {
    font-size: 20px !important;
    font-weight: bold !important;
  }

  .swiper-button-next:hover,
  .swiper-button-prev:hover {
    background: var(--main-color) !important;
    color: var(--white-color) !important;
    box-shadow: 0 6px 20px rgba(227, 183, 94, 0.4) !important;
  }

  /* Pagination */
  .swiper-pagination { bottom: 0 !important; }
  .swiper-pagination-bullet {
    width: 12px !important;
    height: 12px !important;
    background: #ddd !important;
    opacity: 1 !important;
    transition: all 0.3s ease !important;
  }
  .swiper-pagination-bullet-active {
    background: var(--main-color) !important;
    width: 32px !important;
    border-radius: 6px !important;
  }

  /* ✅ Active slide center effect with scale & shadow */
  .swiper-slide {
    height: auto !important;
    transition: all 0.4s ease !important;
    opacity: 0.85 !important;
    transform: scale(0.97) !important;
  }
  .swiper-slide-active {
    opacity: 1 !important;
    transform: scale(1) !important;
    z-index: 10 !important;
  }
  .swiper-slide-active .tour-card {
    box-shadow: 0 20px 50px rgba(0,0,0,0.25) !important;
    transition: all 0.3s ease;
  }

  /* Keep slider fully inside viewport to prevent horizontal page scroll */
  .home-tours .swiper {
    padding-right: 12px !important;
    padding-left: 12px !important;
    width: 100% !important;
    margin: 0 !important;
  }

  /* ✅ Mobile: show partial next card */
  @media (max-width: 640px) {
    .swiper-slide { padding: 0 8px !important; }
  }

  /* ✅ Desktop: ensure all 3 cards fit without cutoff */
  @media (min-width: 1024px) {
    .home-tours .swiper {
      padding-right: 20px !important;
      padding-left: 20px !important;
    }
  }

  /* Responsive nav buttons */
  @media (max-width: 1024px) {
    .swiper-button-next { right: 5px !important; }
    .swiper-button-prev { left: 5px !important; }
  }
  @media (max-width: 768px) {
    .swiper-button-next,
    .swiper-button-prev {
      width: 40px !important;
      height: 40px !important;
    }
    .swiper-button-next:after,
    .swiper-button-prev:after { font-size: 16px !important; }
  }
`}</style>
    </section>
  );
}
