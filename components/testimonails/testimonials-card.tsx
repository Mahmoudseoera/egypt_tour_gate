"use client";

import Image from "next/image";
import { Quote } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    name: "Mahmoud Arafat",
    role: "Developer",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    quote:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    name: "Omnia Arafat",
    role: "Designer",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    quote:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    name: "Hussein Mohamed",
    role: "Designer",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    quote:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
    name: "Yasser Ali",
    role: "Designer",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  },
];

export default function TestimonialSlider() {
  return (
    <section className="max-w-7xl mx-auto py-16">
    <div className="container mx-auto">
       {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <div className="h-1 w-20 bg-[var(--main-color)] mx-auto"></div>
        </div>
        <h2 className="text-4xl md:text-3xl font-bold text-[var(--second-color)] mb-4">
        What Peoples Say About Us
        </h2>
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
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      }}
      spaceBetween={30}
      navigation
      pagination={{ 
        clickable: true ,
      dynamicBullets: true,
    }}
      className="py-20"
    >
      {testimonials.map((item) => (
        <SwiperSlide key={item.id}>
  <div className="relative bg-white rounded-2xl p-7 h-full shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] border border-gray-100">
    
    {/* Quote Background */}
    <Quote
      size={80}
      className="absolute top-6 right-6 text-blue-100 opacity-40"
    />

    <p className="text-sm text-gray-600 leading-relaxed mb-8 relative z-10">
      {item.quote}
    </p>

    <div className="flex items-center gap-4 mt-auto">
      <div className="w-12 h-12 rounded-full overflow-hidden border">
        <Image
          src={item.image}
          alt={item.name}
          width={48}
          height={48}
          className="object-cover"
        />
      </div>

      <div>
        <h6 className="font-semibold text-sm text-gray-900">
          {item.name}
        </h6>
        <span className="text-xs text-gray-500">
          {item.role}
        </span>
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
