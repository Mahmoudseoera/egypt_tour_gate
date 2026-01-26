'use client';

import Image from 'next/image';
import '@/styles/animations.css';

interface HeroBanner {
  id: number;
  title: string;
  description: string;
  imageOne: string;
  imageTwo: string;
  BackgroundImg: string;
}

const heroBanner: HeroBanner = {
  id: 1,
  title: 'Egypt Tour Gate',
  description:
    'Discover the wonders of Egypt with our premium tour experiences. Explore ancient pyramids, vibrant cultures, and unforgettable memories.',
  imageOne:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
  imageTwo:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
  BackgroundImg:
    'https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=1600&auto=format&fit=crop',
};

export default function EgyptToursBanner() {
  return (
    <section className="relative w-full h-[80vh] md:h-[60vh]  lg:h-[70vh]  [clip-path:polygon(100%_0,_100%_95%,_50%_100%,_0_95%,_0_0)] overflow-hidden flex items-center">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={heroBanner.BackgroundImg}
          alt={heroBanner.title}
          fill
          className="object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-[url(/assets/images/banner-bg.png)] opacity-[.50] overlay-animated"/>
      </div>

      {/* Animated Overlay */}
      <div className="absolute inset-0 overlay-animated opacity-20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="text-left space-y-5 animate-slide-in-left">
            <div className="w-14 h-1 bg-[#e3b75e] rounded-full" />

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#272262] leading-tight">
              {heroBanner.title}
            </h1>

            <p className="text-base md:text-lg text-[#333] max-w-xl">
              {heroBanner.description}
            </p>

            <button className="inline-flex items-center gap-2 px-7 py-3 bg-[#e3b75e] text-[#272262] font-semibold rounded-lg hover:shadow-lg transition">
              Explore Tours
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>

          {/* Right Images */}
          <div className="flex justify-center gap-6">
            {/* Image 1 */}
            <div className="relative animate-floating">
              <div className="relative w-[100px] md:w-[200px] lg:w-[250px] h-[300px] md:h-[360px] rounded-(--corner-radius) overflow-hidden border-4 border-[#e3b75e] shadow-xl">
                <Image
                  src={heroBanner.imageOne}
                  alt="Tour Image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Image 2 */}
            <div className="relative animate-floating-delayed">
              <div className="relative  w-[100px] md:w-[200px] lg:w-[250px] h-[300px] md:h-[360px] rounded-[999px] overflow-hidden border-4 border-[#272262] shadow-xl">
                <Image
                  src={heroBanner.imageTwo}
                  alt="Tour Image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
