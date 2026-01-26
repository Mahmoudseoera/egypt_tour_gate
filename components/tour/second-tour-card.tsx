"use client";

import Image from "next/image";
import { MapPin, Calendar, Star } from "lucide-react";

interface TourCardProps {
  image: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  duration: string;
  location: string;
  ctaText?: string;
  onCta?: () => void;
}

export default function SecondTourCard({
  image,
  title,
  description,
  price,
  rating,
  reviewCount,
  duration,
  location,
  ctaText = "Book Now",
  onCta,
}: TourCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 max-w-sm second-tour-card">
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden group">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-gold px-4 py-2 rounded-lg shadow-md">
          <p className="text-navy font-bold text-lg">${price}</p>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-navy mb-2 line-clamp-2 leading-relaxed h-[calc(1.5*2em)]">
          {title}
        </h3>

        <p className="text-black text-sm mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(rating)
                    ? "fill-gold text-gold"
                    : "text-grey-light"
                }
              />
            ))}
          </div>
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-xs text-grey-light">
            ({reviewCount} reviews)
          </span>
        </div>

        <div className="space-y-2 mb-6 border-t border-grey-light pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={18} className="text-gold" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={18} className="text-gold" />
            <span>{location}</span>
          </div>
        </div>

        <button
          onClick={onCta}
          className="w-full bg-navy hover:bg-gold text-white hover:text-navy font-bold py-3 px-4 rounded-lg transition-all"
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
}
