// components/PartnersMarquee.tsx
import Image from "next/image";
import type { Partner } from "@/lib/api/homeTypes";
import FallbackImage from "@/components/shared/fallback-image";

interface PartnersProps {
  partners: Partner[];
}

export default function PartnersMarquee({ partners = [] }: PartnersProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="overflow-hidden relative py-8">
        <div className="flex animate-marquee gap-6 md:gap-4 lg:gap-8 hover:pause">
          {partners.map((img, index) => (
            <div key={`first-${index}`} className="flex-shrink-0">
              <FallbackImage
                src={img.image}
                alt={img.img_alt}
                width={150}
                height={70}
                className="object-cover transition-transform duration-300 hover:-translate-y-1 hover:scale-105 hover:paused"
              />
            </div>
          ))}
          {partners.map((img, index) => (
            <div key={`second-${index}`} className="flex-shrink-0 mx-4">
              <FallbackImage
                src={img.image}
                alt={img.img_alt}
                width={150}
                height={70}
                className="object-cover transition-transform duration-300 hover:-translate-y-1 hover:scale-105 hover:paused"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
