// components/PartnersMarquee.tsx
import Image from "next/image";
import React from "react";

const partners = [
"partner-logo1.jpeg",
"partner-logo2.jpeg",
"partner-logo3.jpeg",
"partner-logo4.jpeg",
"partner-logo5.jpeg",
"partner-logo6.jpeg",
];

const PartnersMarquee = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="overflow-hidden relative py-8">
        <div className="flex animate-marquee gap-6 md:gap-4 lg-gap-8 hover:pause">
          {partners.map((img, index) => (
            <div key={`first-${index}`} className="flex-shrink-0">
              <Image
                src={`/assets/images/partners-section/${img}`}
                alt={img.split(".")[0]}
                width={150}
                height={70}
                className="object-cover transition-transform duration-300 hover:-translate-y-1 hover:scale-105"
              />
            </div>
          ))}
          {partners.map((img, index) => (
            <div key={`second-${index}`} className="flex-shrink-0 mx-4">
              <Image
                src={`/assets/images/partners-section/${img}`}
                alt={img.split(".")[0]}
                width={150}
                height={70}
                className="object-cover transition-transform duration-300 hover:-translate-y-1 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersMarquee;
