// app/page.tsx  — Server Component (no 'use client')
import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo";
import { fetchSeoHtmlFromEndpoint } from "@/lib/api/seoApi";
import Providers from "../../components/providers";
import EgyptToursBanner from "../../components/home/hero-banner";
import TestimonialSlider from "../../components/testimonails/testimonials-card";
import SecondTourCard from "../../components/tour/second-tour-card";
import DestinationGrid from "../../components/home/destination-grid";
import FAQSection from "../../components/layout/faq";
import RoavioAboutSection from "../../components/home/about";
import TravelServicesSection from "../../components/home/services";
import PartnersMarquee from "../../components/home/partners";
import TravelBlogSection from "../../components/home/blog-section"; 
import TravelTourSlider from "../../components/home/tours-section";
import { fetchHomeSections } from "@/lib/api/homeApi";
import type { HomeSections } from "@/lib/api/homeTypes";
import "@/styles/home.css";
export const revalidate = 300;

type PageProps = {
  params: Promise<{ 
    locale: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  const seoHtml = await fetchSeoHtmlFromEndpoint("", locale);
  const baseSeo = buildSeoMetadata({
    seoHtml,
    title: "Egypt Tours: Best Vacations, Trips, and Tours to Egypt",
    description:
      "Egypt Tours from all countries are made for you. Visit Egypt, explore Egypt trips, enjoy Nile cruises, and discover the Egypt Pyramids.",
    keywords:
      "Egypt tours, Egypt trips, Egypt vacations, Egypt travel, tours to Egypt, Egypt holidays, Nile cruises",
    path: "/",
    locale,
    type: "website",
    image: "/assets/images/egypt-tour-gate-logo.png",
  });

  return {
    ...baseSeo,
    title: baseSeo.title,
    description: baseSeo.description,
    keywords: baseSeo.keywords,
    authors: [{ name: "Egypt Tours Gate", url: "https://www.egypttoursgate.com" }],
    creator: "Egypt Tours Gate",
    publisher: "Egypt Tours Gate",
    category: "travel",
    applicationName: "Egypt Tours Gate",
    openGraph: {
      ...baseSeo.openGraph,
      title: baseSeo.openGraph?.title || "Egypt Tours: Best Vacations, Trips, and Tours to Egypt",
      description: baseSeo.openGraph?.description || "Egypt Tours from all countries are made for you. Visit Egypt, explore Egypt trips, enjoy Nile cruises, and discover the Egypt Pyramids.",
      url: baseSeo.openGraph?.url || "https://www.egypttoursgate.com",
      siteName: "Egypt Tours Gate",
      type: "website",
      images: baseSeo.openGraph?.images || [
        {
          url: "https://www.egypttoursgate.com/assets/images/egypt-tour-gate-logo.png",
          width: 1200,
          height: 630,
          alt: "Egypt Tours Gate",
        }
      ],
    },
    twitter: {
      ...baseSeo.twitter,
      card: "summary_large_image",
      title: baseSeo.twitter?.title || "Egypt Tours: Best Vacations, Trips, and Tours to Egypt",
      description: baseSeo.twitter?.description || "Egypt Tours from all countries are made for you. Visit Egypt, explore Egypt trips, enjoy Nile cruises, and discover the Egypt Pyramids.",
      creator: "@Egypttoursgate1",
      site: "@Egypttoursgate1",
      images: baseSeo.twitter?.images || ["https://www.egypttoursgate.com/assets/images/egypt-tour-gate-logo.png"],
    },
    alternates: {
      ...baseSeo.alternates,
      canonical: baseSeo.alternates?.canonical || "https://www.egypttoursgate.com",
    },
    robots: {
      ...((baseSeo.robots as any) || {}),
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: "your-google-verification-code",
    },
  };
}

export default async function Home({ params }: PageProps) {
  // ── Server-side data fetch ─────────────────────────────────────────────────
  const { locale } = await params;
  const sections: HomeSections | null = await fetchHomeSections(locale);

  // ── Derived slices ─────────────────────────────────────────────────────────
  const sliderData         = sections?.sliders_section                      ?? [];
  const aboutData          = sections?.about_section                        ?? null;
  const firstTours         = sections?.first_tours_section?.tours           ?? [];
  const reviewsSection     = sections?.reviews_section;
  const secondTours        = sections?.second_tours_section?.tours          ?? [];
  const secondToursSection = sections?.second_tours_section;
  const articles           = sections?.articles_section?.articles           ?? [];
  const articleSection     = sections?.articles_section;
  const partners           = sections?.partners_section?.partners           ?? []; // ← snake_case key, .partners field
  const faqs               = sections?.faq_section?.faqs                    ?? [];

  return (
    <Providers>
      <main className="min-h-screen bg-light">

        {/* ── Hero Banner ─────────────────────────────────────────────────── */}
        <EgyptToursBanner sliderData={sliderData} />

        {/* ── About ───────────────────────────────────────────────────────── */}
        <RoavioAboutSection aboutData={aboutData} />

        {/* ── First Tours Grid ────────────────────────────────────────────── */}
        <section
          className="first-tours max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8"
          id="tours-section"
        >
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--second-color)] mb-4">
                {sections?.first_tours_section?.title || "Explore Our Amazing Tours"}
              </h2>
              <span className="relative block h-1 w-40 bg-gradient-to-r from-[var(--second-color)] via-[var(--main-color)] to-[var(--second-color)] mx-auto rounded-md before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:bg-[url('/assets/images/pryamids-2.svg')] before:bg-contain before:bg-no-repeat before:z-20 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[26px] after:h-[26px] after:bg-white after:rounded-full after:z-0" />
            </div>
            <p className="text-lg text-[var(--black-color)] opacity-70 max-w-7xl mx-auto">
              {sections?.first_tours_section?.description || "Explore Our Amazing Tours"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {firstTours.map((tour) => (
              <SecondTourCard
                key={tour.id}
                id={tour.id}
                image={tour.media.image}
                title={tour.name}
                description={tour.small_desc}
                price={tour.price_after_discount}
                rating={5}
                reviewCount={0}
                duration={`${tour.duration} ${tour.duration_type}`}
                location={tour.city}
                slug={tour.slug}
                categorySlug={tour.subCategory.categorySlug}
                subcategorySlug={tour.subCategory.subCategorySlug}
              />
            ))}
          </div>
        </section>

        {/* ── Destination Grid ────────────────────────────────────────────── */}
        <div className="animate-on-scroll">
          <DestinationGrid
            tagCategoriesSection={sections?.tag_categories_section ?? null}
          />
        </div>

        {/* ── Services ────────────────────────────────────────────────────── */}
        <div className="animate-on-scroll">
          <TravelServicesSection whyChooseSection={sections?.why_choose_section ?? null} />
        </div>

        {/* ── Testimonials ────────────────────────────────────────────────── */}
        <div className="animate-on-scroll">
          <TestimonialSlider reviewsSection={reviewsSection} />
        </div>

        {/* ── Second Tours Swiper ─────────────────────────────────────────── */}
        <div className="animate-on-scroll">
          <TravelTourSlider apiTours={secondTours} SecondToursSection={secondToursSection} />
        </div>

        {/* ── Blog Section ────────────────────────────────────────────────── */}
        <div className="animate-on-scroll">
          <TravelBlogSection apiArticles={articles} articlesSection={articleSection} />
        </div>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <div className="animate-on-scroll">
          <FAQSection faqs={faqs} faqSection={sections?.faq_section ?? null} />
        </div>

        {/* ── Partners ────────────────────────────────────────────────────── */}
        <div className="animate-on-scroll">
          <PartnersMarquee partners={partners} />
        </div>

      </main>
    </Providers>
  );
}
