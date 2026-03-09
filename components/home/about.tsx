import { Check } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import type { AboutSection } from "@/lib/api/homeTypes";

interface RoavioAboutSectionProps {
  aboutData?: AboutSection | null;
}

export default function RoavioAboutSection({ aboutData }: RoavioAboutSectionProps) {
  const features = [
    { id: 1, text: "Destination Search & Filters" },
    { id: 2, text: "Online Booking System" },
    { id: 3, text: "Blog & Travel Guides" },
    { id: 4, text: "Live Chat Support" },
    { id: 5, text: "Pricing & Discounts" },
    { id: 6, text: "Reviews & Ratings" },
  ];

  const rawDesc  = aboutData?.about_desc ?? "";
  const cleanDesc = rawDesc.replace(/<[^>]+>/g, "").trim();
  const title    = aboutData?.about_title    ?? "Awesome Tips That Makes Your Travel Beautiful";
  const subTitle = aboutData?.about_sub_title ?? "Travel Essentials Tips";
  const desc     = cleanDesc || "We believe travel is more than just a trip—it's an experience that shapes your life.";
  const title2   = aboutData?.about_title2   ?? "A Time to Travel And Find Breathtaking Landscapes For Relax";

  const styles = `
    .roavio-image-zoom { transition: transform 0.6s cubic-bezier(0.4,0,0.2,1); }
    .roavio-card-hover:hover .roavio-image-zoom { transform: scale(1.08); }
    .roavio-icon-float { animation: roavio-float 3s ease-in-out infinite; }
    @keyframes roavio-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    .roavio-check-pulse { animation: roavio-pulse 2s ease-in-out infinite; }
    @keyframes roavio-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:.9} }
    .roavio-feature-fade { animation: roavio-fade-in 0.6s ease-out forwards; opacity:0; }
    .roavio-feature-fade:nth-child(1){animation-delay:.1s}
    .roavio-feature-fade:nth-child(2){animation-delay:.2s}
    .roavio-feature-fade:nth-child(3){animation-delay:.3s}
    .roavio-feature-fade:nth-child(4){animation-delay:.4s}
    .roavio-feature-fade:nth-child(5){animation-delay:.5s}
    .roavio-feature-fade:nth-child(6){animation-delay:.6s}
    @keyframes roavio-fade-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="bg-white py-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold text-[var(--main-color)] uppercase tracking-wider mb-2">{subTitle}</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[var(--second-color)] mb-4 leading-tight">
                {title.split('<br')[0]}
                <br className="hidden md:block"/>
                <span className="text-gray-900">Egypt Tour Gate</span>
              </h2>
              <p className="text-gray-600 text-lg">
                We are started with 2005s, <span className="text-[var(--main-color)] font-semibold">20+ years of experience</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 roavio-card-hover">
                <div className="rounded-3xl overflow-hidden h-50 lg:h-full">
                  <Image src="/assets/images/tours/Pyramids-in-Egypt-webp.webp" alt="Pyramids" className="w-full h-full object-cover roavio-image-zoom" width={800} height={800}/>
                </div>
              </div>
              <div className="col-span-1 bg-gray-900 rounded-3xl p-2 md:p-8 flex flex-col justify-center items-center text-white h-50 lg:h-full">
                <div className="roavio-icon-float mb-2 md:mb-6">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-white">
                    <path d="M32 8C24.5 8 18 12.5 18 18C18 23.5 24.5 32 32 40C39.5 32 46 23.5 46 18C46 12.5 39.5 8 32 8Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="32" cy="18" r="4" fill="currentColor"/>
                    <path d="M32 56C32 56 12 44 12 28C12 22 16 16 24 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M32 56C32 56 52 44 52 28C52 22 48 16 40 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Trusted & Secure</h3>
                <p className="text-gray-300 text-sm text-center">Your safety and trust are our top priorities.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="roavio-card-hover">
              <div className="rounded-3xl overflow-hidden h-96">
                <Image src="/assets/images/tours/Egypt Budget Tours-webp.webp" alt={title2} className="w-full h-full object-cover roavio-image-zoom" width={800} height={800}/>
              </div>
            </div>
            <div className="space-y-8">
              <h3 className="text-xl font-semibold text-[var(--second-color)]">{title2}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{desc}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center gap-3 roavio-feature-fade">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-[#e3b75e] flex items-center justify-center roavio-check-pulse">
                        <Check className="w-4 h-4 text-white" strokeWidth={3}/>
                      </div>
                    </div>
                    <span className="text-gray-700 text-base font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
              <div>
                <Link href="/about-us" className="btn-effect !bg-[var(--second-color)] !text-white font-bold !py-4 !px-8 rounded-full text-lg transition-all duration-300 shadow-lg">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
