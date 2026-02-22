'use client'
import Providers from '../components/providers'
import EgyptToursBanner  from '../components/home/hero-banner'
import TestimonialSlider from "../components/testimonails/testimonials-card";
import SecondTourCard from "../components/tour/second-tour-card";
import  DestinationGrid  from "../components/home/destination-grid";
import FAQSection from "../components/layout/faq";
import RoavioAboutSection from "../components/home/about";
import TravelServicesSection from "../components/home/services";
import PartnersMarquee from "../components/home/partners";
import TravelBlogSection from "../components/home/blog-section";
import TravelTourSlider from "../components/home/tours-section"
import categoriesData from "@/lib/api/categories";
const { nile_cruises } = categoriesData;

import "@/styles/home.css";

export default function Home() {
  return (
    <Providers>
      <main className="min-h-screen bg-light">
        <EgyptToursBanner />
        <RoavioAboutSection />
        
        <section 
  className="first-tours max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8" 
  id="tours-section"
>
  <div className="text-center mb-12"> 
    <div className="inline-block mb-4">
      <h2 className="text-3xl md:text-4xl font-bold text-[var(--second-color)] mb-4">
        Explore Our Amazing Tours
      </h2>
      <span className="relative block h-1 w-40 bg-gradient-to-r from-[var(--second-color)] via-[var(--main-color)] to-[var(--second-color)] mx-auto rounded-md before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:bg-[url('/assets/images/pryamids-2.svg')] before:bg-contain before:bg-no-repeat before:z-20 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[26px] after:h-[26px] after:bg-white after:rounded-full after:z-0">
      </span>
    </div>
    <p className="text-lg text-[var(--black-color)] opacity-70 max-w-2xl mx-auto">
      Discover unforgettable travel experiences tailored just for you
    </p>
  </div>

  {/* Grid Container */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {nile_cruises.map((tour) => (
      <SecondTourCard
        key={tour.id}
        id={tour.id}
        image={tour.image}
        title={tour.title}
        description={tour.description}
        price={tour.price_from}
        rating={tour.rating}
        reviewCount={tour.reviewCount}
        duration={tour.duration}
        location={tour.location}
        slug={tour.slug}
        categorySlug={tour.categorySlug}
        subcategorySlug={tour.subcategorySlug}
      />
    ))}
  </div>
</section>
        
        <div className="animate-on-scroll">
          <DestinationGrid />
        </div>
        <div className="animate-on-scroll">
          <TravelServicesSection />
        </div>
        <div className="animate-on-scroll">
          <TestimonialSlider />
        </div>
        <div className="animate-on-scroll">
          <TravelTourSlider />
        </div>
        <div className="animate-on-scroll">
          <TravelBlogSection />
        </div>
        <div className="animate-on-scroll">
          <FAQSection />
        </div>
        <div className="animate-on-scroll">
          <PartnersMarquee />
        </div>
      </main>
    </Providers>
  )
}