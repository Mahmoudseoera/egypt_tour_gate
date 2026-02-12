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
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
    name: "Mahmoud Arafat",
    role: "Developer",
    image: "/assets/images/testimonials/testimonial-img1.jpg",
  },
  {
    id: 2,
    quote:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
    name: "Omnia Arafat",
    role: "Designer",
    image: "/assets/images/testimonials/testimonial-img2.jpg",
  },
  {
    id: 3,
    quote:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
    name: "Hussein Mohamed",
    role: "Designer",
    image: "/assets/images/testimonials/testimonial-img3.jpg",
  },
  {
    id: 4,
    quote:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
    name: "Yasser Ali",
    role: "Designer",
    image: "/assets/images/testimonials/testimonial-img4.jpg",
  },
];

export default function TestimonialSlider() {
  return (
    <section className="max-w-7xl mx-auto py-16">
    <div className="container mx-auto">
              {/* Header */}
              <div className="text-center mb-12"> 
        <div className="inline-block mb-4">
        <h2 className="text-4xl md:text-3xl font-bold text-[var(--second-color)] mb-4">
        What Peoples Say About Us
        </h2>
          <span
        className="relative block h-1 w-40 bg-gradient-to-r from-[var(--second-color)] via-[transparent] to-[var(--second-color)] mx-auto relative block  w-40 mx-auto rounded-md

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
        ">
        </span>

        </div>
        <p className="text-lg text-[var(--black-color)] opacity-70 max-w-2xl mx-auto">
        Discover unforgettable travel experiences tailored just for you
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

    <p className="text-sm text-gray-600 leading-relaxed mb-8 relative z-10 line-clamp-3 overflow-hidden h-[85px] m-0">
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
