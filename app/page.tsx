'use client'
// Home Page //
import Providers from '../components/providers'
import EgyptToursBanner  from '../components/home/hero-banner'
import TestimonialSlider from "../components/testimonails/testimonials-card";
import SecondTourCard from "../components/tour/second-tour-card";
import { secondTours } from '../lib/api/tours'
import  DestinationGrid  from "../components/home/destination-grid";
import FAQSection from "../components/layout/faq";
import RoavioAboutSection from "../components/home/about";
import TravelServicesSection from "../components/home/services";
import PartnersMarquee from "../components/home/partners";
import TravelBlogSection from "../components/home/blog-section";
import TravelTourSlider from "../components/home/tours-section"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// style css for home page //
import "@/styles/home.css";
export default function Home() {
  return (

    <Providers>
      <main className="min-h-screen bg-light">
        
        <EgyptToursBanner />

        <RoavioAboutSection />

      <section className="first-tours max-w-7xl mx-auto py-16 animate-on-scroll">

        {/* Header */}
        <div className="text-center mb-12">
        <div className="inline-block mb-4">
        <h2 className="text-4xl md:text-3xl font-bold text-[var(--second-color)] mb-4">
        Explore Our Amazing Tours
        </h2>
          <span className="relative block h-1 w-40 bg-gradient-to-r from-indigo-900 to-amber-400 mx-auto rounded-md before:content-[''] before:absolute     relative block h-10 w-40 mx-auto rounded-md
    before:absolute before:inset-0
    before:bg-[url('/assets/images/pyramids.svg')]
    before:bg-center before:bg-no-repeat before:bg-contain"></span>
        </div>
        <p className="text-lg text-[var(--black-color)] opacity-70 max-w-2xl mx-auto">
        Discover unforgettable travel experiences tailored just for you
        </p>
      </div>

        {/* Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {secondTours.map((tour) => (
            <SecondTourCard
              key={tour.id}
              image={tour.image}
              title={tour.title}
              description={tour.description}
              price={tour.price}
              rating={tour.rating}
              reviewCount={tour.reviewCount}
              duration={tour.duration}
              location={tour.location}
              ctaText="Book Now"
              onCta={() =>
                alert(`Booking tour: ${tour.title}`)
              }
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
