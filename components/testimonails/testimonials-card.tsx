"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { Review } from "@/lib/api/homeTypes";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ─── Static fallback data ──────────────────────────────────────────────────
const staticTestimonials = [
  { id: 1, quote: "The tour was excellent, Rasha was amazing — very informative. We had the best service and strongly recommend this company!", name: "Amazing Egypt Tour", role: "Verified Traveler", image: "/assets/images/testimonials/testimonial-img1.jpg" },
  { id: 2, quote: "This was our first trip to Egypt and we are very impressed with all organization and professionalism. Our guides were excellent!", name: "Our first Egypt tour", role: "Verified Traveler", image: "/assets/images/testimonials/testimonial-img2.jpg" },
  { id: 3, quote: "We would sincerely like to thank Egypt Tours Gate for providing a safe, comprehensive, and memorable tourist experience of Egypt.", name: "Jim D", role: "Verified Traveler", image: "/assets/images/testimonials/testimonial-img3.jpg" },
  { id: 4, quote: "One of our favorite highlights was unwinding at the Siwa Oasis. We will never forget our cruise down the Nile either!", name: "Sarah M", role: "Verified Traveler", image: "/assets/images/testimonials/testimonial-img4.jpg" },
];

interface TestimonialSliderProps {
  /** Reviews from the home API. Falls back to static data when empty. */
  reviews?: Review[];
}

export default function TestimonialSlider({ reviews = [] }: TestimonialSliderProps) {
  // Prefer API data; fall back to static when API returns nothing
  const items = reviews.length > 0
    ? reviews.map((r, i) => ({
        id: r.id,
        quote: r.description,
        name: r.name,
        role: "Verified Traveler",
        image: r.media?.image ?? staticTestimonials[i % staticTestimonials.length].image,
      }))
    : staticTestimonials;

  return (
    <section className="max-w-7xl mx-auto py-16">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--second-color)] mb-4">
              What Peoples Say About Us
            </h2>
            <span className="relative block h-1 w-40 bg-gradient-to-r from-[var(--second-color)] via-[var(--main-color)] to-[var(--second-color)] mx-auto rounded-md before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:bg-[url('/assets/images/pryamids-2.svg')] before:bg-contain before:bg-no-repeat before:z-20 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[26px] after:h-[26px] after:bg-white after:rounded-full after:z-0" />
          </div>
          <p className="text-lg text-[var(--black-color)] opacity-70 max-w-2xl mx-auto">
            Discover unforgettable travel experiences tailored just for you
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          loop={true}
          slidesPerView={1}
          speed={700}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}
          spaceBetween={30}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          className="py-20"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="relative bg-white rounded-2xl p-7 h-full shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] border border-gray-100">
                <Quote size={80} className="absolute bottom-6 right-6 text-blue-100 opacity-40"/>
                <p className="text-sm text-gray-600 leading-relaxed mb-8 relative z-10 line-clamp-3 overflow-hidden h-[85px] m-0"
                   dangerouslySetInnerHTML={{ __html: item.quote }} />
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full overflow-hidden border">
                    <Image src={item.image} alt={item.name} width={48} height={48} className="object-cover"/>
                  </div>
                  <div>
                    <h6 className="font-semibold text-sm text-gray-900">{item.name}</h6>
                    <span className="text-xs text-gray-500">{item.role}</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
