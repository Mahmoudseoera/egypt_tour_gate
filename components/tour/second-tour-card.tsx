// components/tour/second-tour-card.tsx
"use client";
import { useT } from "@/lib/hooks/useTranslate";
import { StaticImageData } from "next/image";
import { MapPin, Calendar, Star, Heart } from "lucide-react";
import Link from "next/link";
import FallbackImage from "@/components/shared/fallback-image";
import { useFavourites, type FavouriteTour } from "@/lib/hooks/useFavourites";

interface TourCardProps {
  id: number;
  image?: string | StaticImageData;
  title: string;
  description?: string;
  price: number;
  rating: number;
  reviewCount?: number;
  duration: string;
  location: string;
  slug: string;
  categorySlug: string;
  subcategorySlug?: string;
}

export default function SecondTourCard({
  id,
  image,
  title,
  description,
  price,
  rating,
  reviewCount = 0,
  duration,
  location,
  slug,
  categorySlug,
  subcategorySlug,
}: TourCardProps) {
  const { isFavourite, toggle } = useFavourites();
  const t = useT("common");
  const safeDescription =
    description?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() ||
    `Discover ${title} and customize your ideal Egypt experience.`;

  const tourLink = subcategorySlug
    ? `/${categorySlug}/${subcategorySlug}/${slug}`
    : `/${categorySlug}/${slug}`;

  // Build the object we'll persist — only serialisable fields
  const tourData: FavouriteTour = {
    id,
    title,
    slug,
    categorySlug,
    subcategorySlug,
    // StaticImageData is not serialisable; only persist string URLs
    image: typeof image === "string" ? image : undefined,
    price,
    duration,
    location,
    description: safeDescription,
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 max-w-sm mx-auto">
      {/* Image */}
      <Link href={tourLink} className="relative h-56 w-full block">
        <FallbackImage
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform group-hover:scale-110 duration-300"
        />
        <div className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.2)] backdrop-blur-lg">
          <p className="text-navy font-bold text-lg">${price}</p>
        </div>
      </Link>

      <div className="p-6">
        <Link href={tourLink}>
          <h3 className="text-lg text-left font-bold text-navy mb-2 line-clamp-2 hover:text-gold transition h-[calc(1.5*2em)]">
            {title}
          </h3>
        </Link>

        <p className="text-sm text-black line-clamp-2 mb-4">{safeDescription}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.floor(rating)
                  ? "fill-gold text-gold"
                  : "text-grey-light text-gray-300 fill-gray-300"
              }
            />
          ))}
          <span className="text-sm">{reviewCount > 0 && `(${reviewCount})`}</span>
        </div>

        {/* Info */}
        <div className="flex justify-between text-sm mb-4 border-t pt-4">
          <span className="flex items-center gap-2">
            <Calendar size={16} className="text-gold" />
            {duration}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-gold" />
            {location}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href={tourLink}
            className="flex-1 !bg-navy !text-white text-center py-3 hover:bg-gold hover:text-navy transition btn-effect !rounded-md"
          >
            {t("book_now")}
          </Link>

          <button
            onClick={() => toggle(tourData)}
            aria-label={isFavourite(id) ? "Remove from favourites" : "Add to favourites"}
            className={`w-11 h-11 flex items-center justify-center rounded-md transition ${
              isFavourite(id) ? "bg-red-500" : "bg-gray-100"
            }`}
          >
            <Heart
              size={20}
              fill={isFavourite(id) ? "#fff" : "none"}
              color={isFavourite(id) ? "#fff" : "#333"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
