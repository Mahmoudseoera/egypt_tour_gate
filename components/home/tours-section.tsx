"use client";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { useT } from "@/lib/hooks/useTranslate";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import FallbackImage from "@/components/shared/fallback-image";
import type { ApiTour, SecondToursSection } from "@/lib/api/homeTypes";
import { useFavourites, type FavouriteTour } from "@/lib/hooks/useFavourites";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface TravelTourSliderProps {
  /** Tours from the API second_tours_section. Falls back to static data when empty. */
  SecondToursSection?: SecondToursSection | null;
  apiTours?: ApiTour[];
}

type SliderItem = {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  location: string;
  link: string;
  slug: string;
  categorySlug: string;
  subcategorySlug?: string;
  duration: string;
};

export default function TravelTourSlider({
  SecondToursSection,
  apiTours = [],
}: TravelTourSliderProps) {
  const t = useT("common");
  const { isFavourite, toggle } = useFavourites();

  const toggleFavorite = (tour: SliderItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favouriteTour: FavouriteTour = {
      id: tour.id,
      title: tour.title,
      slug: tour.slug,
      categorySlug: tour.categorySlug,
      subcategorySlug: tour.subcategorySlug,
      image: tour.image,
      price: tour.price,
      duration: tour.duration,
      location: tour.location,
      description: tour.description,
    };
    toggle(favouriteTour);
  };
   const heading = SecondToursSection?.title?.trim() || "Explore Amazing Tours";
   const descripation = SecondToursSection?.description?.trim()  ||
    "Discover unforgettable travel tours experiences tailored just for you";
  const tourItems: SliderItem[] =
    apiTours.length > 0
      ? apiTours.map((t) => ({
          id: t.id,
          image: t.media.image || "/placeholder.svg",
          title: t.name,
          description: t.small_desc,
          price: t.price_after_discount,
          location: t.city,
          link: `/${t.subCategory.categorySlug}/${t.subCategory.subCategorySlug}/${t.slug}`,
          slug: t.slug,
          categorySlug: t.subCategory.categorySlug,
          subcategorySlug: t.subCategory.subCategorySlug,
          duration: `${t.duration} ${t.duration_type}`,
        }))
      : [];

  return (
    <section className="home-tours min-h-screen bg-[var(--main-grey)] pt-16">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-5">
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--second-color)] mb-4">
            {heading}
          </h2>
          <span className="relative block h-1 w-40 mb-4 mx-auto rounded-md bg-gradient-to-r from-[var(--second-color)] via-[var(--main-color)] to-[var(--second-color)] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:bg-[url('/assets/images/pryamids-2.svg')] before:bg-contain before:bg-no-repeat before:z-20 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[26px] after:h-[26px] after:bg-[var(--main-grey)] after:rounded-full after:z-0" />
          <p className="text-lg text-[var(--black-color)] opacity-70 max-w-7xl mx-auto">
           {descripation}
          </p>
        </div>

        <div className="pb-16">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            loop={true}
            slidesPerView={1.15}
            spaceBetween={20}
            centeredSlides={true}
            speed={700}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              640: {
                slidesPerView: 1.15,
                spaceBetween: 15,
                centeredSlides: true,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 25,
                centeredSlides: false,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 35,
                centeredSlides: false,
              },
            }}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            className="!pb-12"
          >
            {tourItems.map((tour) => (
              <SwiperSlide key={tour.id} className="!h-auto !px-2">
                <Link href={tour.link} className="block">
                  <div className="tour-card group bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] h-full flex flex-col hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-all duration-300 w-full max-w-sm mx-auto">
                    <div className="relative w-full h-[280px] overflow-hidden rounded-t-3xl">
                      {/* <Image src={tour.image} alt={tour.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width:768px) 100vw,(max-width:1024px) 50vw,33vw"/> */}
                      <FallbackImage
                        src={tour.image || "/placeholder.svg"}
                        alt={tour.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width:768px) 100vw,(max-width:1024px) 50vw,33vw"
                      />
                      <button
                        className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center z-20 shadow transition-all duration-300 hover:scale-110 ${isFavourite(tour.id) ? "bg-[var(--main-color)]" : "bg-white/95 hover:bg-white"}`}
                        onClick={(e) => toggleFavorite(tour, e)}
                        aria-label={
                          isFavourite(tour.id)
                            ? "Remove from favourites"
                            : "Add to favourites"
                        }
                      >
                        <Heart
                          size={20}
                          fill={isFavourite(tour.id) ? "#fff" : "none"}
                          color={isFavourite(tour.id) ? "#fff" : "#333"}
                          strokeWidth={2.5}
                        />
                      </button>
                      <div className="absolute bottom-4 flex items-center gap-2 left-4 bg-[rgba(255,255,255,0.5)] backdrop-blur-sm text-[var(--second-color)] px-3 py-2 rounded-full text-xs font-semibold z-20">
                        <MapPin size={16} className="text-indigo-900" />{" "}
                        {tour.location}
                      </div>
                    </div>
                    <div className="p-6 pt-7 flex-1 flex flex-col">
                      <h2 className="text-xl font-bold text-[var(--black-color)] leading-snug mb-3 min-h-[56px] line-clamp-2 group-hover:text-[var(--main-color)] transition-colors">
                        {tour.title}
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1 line-clamp-3">
                        {tour.description}
                      </p>
                      <div className="relative flex items-center justify-between pt-4 border-t-8 border-dotted border-gray-200">
                        <div className="absolute top-[-25px] w-10 h-10 bg-gray-200 rounded-full left-[-50px] z-10" />
                        <div className="absolute top-[-25px] w-10 h-10 bg-gray-200 rounded-full right-[-50px] z-10" />
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                            {t("starts_from")}
                          </span>
                          <span className="text-3xl font-extrabold text-[var(--main-color)]">
                            ${tour.price}
                          </span>
                        </div>
                        <div className="btn-effect bg-[var(--second-color)] text-white px-7 py-3 rounded-full text-sm font-bold uppercase tracking-wide hover:bg-[#1a1848]">
                          {t("book_now")}
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
    </section>
  );
}
