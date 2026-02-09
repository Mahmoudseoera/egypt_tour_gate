"use client";
import { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { MapPin, Calendar, Star, Heart } from "lucide-react";
import Link from "next/link";

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
  tourLink: string;
}
export default function SecondTourCard({
  id,
  image,
  title,
  description,
  price,
  rating,
  reviewCount,
  duration,
  location,
  tourLink,
}: TourCardProps) {
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = sessionStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const toggleFavorite = (tourId: number) => {
    setFavorites(prev => {
      let updated: number[];
      if (prev.includes(tourId)) {
        
        updated = prev.filter(id => id !== tourId);
      } else {
        
        updated = [...prev, tourId];
      }
      sessionStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 max-w-sm mx-auto">

      {/* Image */}
      <Link href={tourLink} className="relative h-56 w-full block group">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-gold px-4 py-2 rounded-lg">
          <p className="text-navy font-bold text-lg">${price}</p>
        </div>
      </Link>

      <div className="p-6">
        <Link href={tourLink}>
          <h3 className="text-xl font-bold text-navy mb-2 line-clamp-2 hover:text-gold transition">
            {title}
          </h3>
        </Link>

        <p className="text-sm text-black line-clamp-2 mb-4">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < Math.floor(rating) ? "fill-gold text-gold" : "text-grey-light"}
            />
          ))}
          <span className="text-sm">({reviewCount})</span>
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
            className="flex-1 bg-navy text-white text-center py-3 rounded-lg hover:bg-gold hover:text-navy transition"
          >
            Book Now
          </Link>

          <button
            onClick={() => toggleFavorite(id)}
            className={`w-11 h-11 flex items-center justify-center rounded-md transition
              ${favorites[id] ? "bg-red-500" : "bg-gray-100 hover:bg-gray-200"}
            `}
          >
            <Heart
              size={20}
              fill={favorites[id] ? "#fff" : "none"}
              color={favorites[id] ? "#fff" : "#333"}
            />
          </button>
        </div>
      </div>
    </div>
  );

}
