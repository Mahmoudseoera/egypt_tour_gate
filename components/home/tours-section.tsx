"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MapPin } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Tour {
  id: number;
  image: string;
  title: string;
  description: string;
  price: string;
  city: string;
}

const tours: Tour[] = [
  {
    id: 1,
    image: "/assets/images/tours/106896752__MG_7633-final_Pompeys_Pillar-webp.webp",
    title: 'From its medieval origins to the digital era',
    description: '40 impressive UNESCO World Heritage sites which bear witness to over 2,000 years of the city history.',
    price: '145$',
    city: 'Venice'
  },
  {
    id: 2,
    image: "/assets/images/tours/grand-egyptian-museum-opening-(2)-webp.webp",
    title: 'Discover Ancient Wonders',
    description: 'Explore breathtaking archaeological sites and immerse yourself in rich cultural heritage spanning millennia.',
    price: '199$',
    city: 'Paris'
  },
  {
    id: 3,
    image: "/assets/images/tours/camel front of giza pyramids.jpg",
    title: 'European Cultural Journey',
    description: 'Experience the finest museums, galleries, and historic landmarks across iconic European destinations.',
    price: '175$',
    city: 'Rome'
  },
  {
    id: 4,
    image: "/assets/images/tours/Pyramids-in-Egypt-webp.webp",
    title: 'Magical City Exploration',
    description: 'Discover the enchanting streets and historical monuments of this beautiful European capital.',
    price: '165$',
    city: 'Barcelona'
  },
  {
    id: 5,
    image: "/assets/images/tours/great-pyramid-webp.webp",
    title: 'Mediterranean Paradise',
    description: 'Experience the stunning coastline and rich cultural heritage of Mediterranean destinations.',
    price: '210$',
    city: 'Athens'
  }
];

export default function TravelTourSlider() {
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  const toggleFavorite = (id: number) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="min-h-screen bg-[var(--main-grey)] py-16">
      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-12">
        
        <h2 className="text-4xl md:text-3xl font-bold text-[var(--second-color)] mb-4">
        Explore Our Amazing Destinations
        </h2>
          <span
            className={`
              relative block h-1 w-40 mb-4 mx-auto rounded-md
              bg-gradient-to-r from-[var(--second-color)] via-transparent to-[var(--second-color)]

              before:content-['']
              before:absolute
              before:top-1/2
              before:left-1/2
              before:-translate-x-1/2
              before:-translate-y-1/2
              before:w-4
              before:h-4
              before:bg-[url('/assets/images/pryamids-2.svg')]
              before:bg-contain
              before:bg-no-repeat
              before:z-20

              after:content-['']
              after:absolute
              after:top-1/2
              after:left-1/2
              after:-translate-x-1/2
              after:-translate-y-1/2
              after:w-[26px]
              after:h-[26px]
              after:bg-white
              after:rounded-full
              after:z-0
            `}
          ></span>

<p className="text-lg text-[var(--black-color)] opacity-70 max-w-2xl mx-auto">
          Discover breathtaking locations around the world and create unforgettable memories
        </p>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          loop={true}
          slidesPerView={1}
          speed={700}
          // autoplay={{
          //   delay: 3500,
          //   disableOnInteraction: false,
          // }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          spaceBetween={30}
          navigation
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          className="py-16 pb-16 group"
        >
          {tours.map((tour) => (
            <SwiperSlide key={tour.id}>
              <div className="tour-card group bg-white rounded-3xl overflow-visible shadow-[0_8px_30px_rgba(0,0,0,0.12)] h-full flex flex-col relative">
                {/* Image Section */}
                <div className="relative w-full h-[280px] overflow-hidden rounded-t-3xl">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-400 hover:scale-110"
                  />

                  {/* Favorite Button */}
                  <button
                    className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-20 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-110 ${
                      favorites[tour.id] 
                        ? 'bg-[var(--main-color)]' 
                        : 'bg-white/95 hover:bg-white'
                    }`}
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

                  {/* City Badge */}
                  <div className="absolute bottom-4 flex items-center gap-2 left-4 bg-[rgba(255,255,255,0.5)] text-[var(--second-color)]  px-3 py-2 rounded-full text-xs font-semibold tracking-wide z-20">
                  <MapPin size={16} className="text-indigo-900 "/>
                    {tour.city}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 pt-7 flex-1 flex flex-col overflow-hidden">
                  <h2 className=" text-xl font-bold text-[var(--black-color)] leading-snug mb-3 min-h-[56px]">
                    {tour.title}
                  </h2>

                  <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1 line-clamp-3">
                    {tour.description}
                  </p>

                  {/* Footer */}
                  <div className="relative flex items-center justify-between pt-4 border-t-8 border border-dotted border-gray-200">
                  {/* Ticket Divider */}
                {/* Ticket Shape Decorations */}
                <div className="absolute top-[-25px] w-10 h-10 bg-gray-200 rounded-full left-[-50px] z-10 shadow-inner shadow-[0_8px_30px_rgba(0,0,0,0.12)]"></div>
                <div className="absolute top-[-25px] w-10 h-10 bg-gray-200 rounded-full right-[-50px] z-10 shadow-inner shadow-[0_8px_30px_rgba(0,0,0,0.12)]"></div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                        Price
                      </span>
                      <span className="text-3xl font-extrabold text-[var(--main-color)]">
                        {tour.price}
                      </span>
                    </div>

                    <button className="bg-[var(--second-color)] text-white border-none px-7 py-3 rounded-full text-sm font-bold cursor-pointer transition-all duration-300 uppercase tracking-wide hover:bg-[#1a1848] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(39,34,98,0.3)]">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        /* Swiper Navigation Buttons */
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
        }

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

        /* Swiper Pagination */
        .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          background: #ddd !important;
          opacity: 1 !important;
        }

        .swiper-pagination-bullet-active {
          background: var(--main-color) !important;
          width: 32px !important;
          border-radius: 6px !important;
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .swiper-button-next {
            right: 10px !important;
          }
          
          .swiper-button-prev {
            left: 10px !important;
          }
        }

        @media (max-width: 768px) {
          .swiper-button-next,
          .swiper-button-prev {
            width: 40px !important;
            height: 40px !important;
          }

          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}