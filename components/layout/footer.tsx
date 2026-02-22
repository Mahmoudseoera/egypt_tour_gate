"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useGeneralData } from "@/lib/api/GeneralApi";
import SimpleSocialIcon, { SocialItem } from '@/components/layout/simpleSocialIcon';

// Static social data preserved exactly as provided
const socialData: SocialItem[] = [
  {
    icon: "fa-brands fa-facebook-f",
    url: "https://facebook.com  ",
    title: "Facebook"
  },
  {
    icon: "fa-brands fa-instagram",
    url: "https://instagram.com  ",
    title: "Instagram"
  },
  {
    icon: "fa-brands fa-x-twitter",
    url: "https://twitter.com  ",
    title: "Twitter"
  },
  {
    icon: "fa-brands fa-youtube",
    url: "https://youtube.com  ",
    title: "YouTube"
  }
];

function stripHtml(html: string) {
  if (typeof window === "undefined") return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

export default function Footer() {
  const { data, loading, error } = useGeneralData();
  const currentYear = new Date().getFullYear();

  // Unified content renderer with travel-themed styling
  const renderFooterContent = (isErrorState: boolean) => {
    const footerData = isErrorState ? null : data?.footer;
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand Column - Egyptian elegance */}
          <div className="space-y-6 lg:col-span-1">
            <Link 
              href="/" 
              className="inline-flex items-center group hover:opacity-90 transition-opacity"
              aria-label="Egypt Tour Gate homepage"
            >
              <div className="relative w-32 h-10">
                <Image
                  src="/assets/images/egypt-tour-gate-logo.png"
                  alt="Egypt Tour Gate Logo - Premium Nile Cruises & Pyramids Tours"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            
            <p className="text-white/85 text-sm leading-relaxed max-w-prose">
              Discover the wonders of ancient Egypt with expertly curated tours to the Pyramids, Nile cruises, and historic temples.
            </p>
            
            <div className="flex flex-col gap-1 space-y-3 pt-2 border-t border-[var(--main-color)]/15">
            <Link href="/">
            <div className="flex items-start gap-3 group">
                <div className="p-2 bg-[var(--main-color)]/10 rounded-full group-hover:bg-[var(--main-color)]/20 transition-colors">
                  <MapPin className="h-4 w-4 text-[var(--main-color)] mt-0.5" aria-hidden="true" />
                </div>
                <span className="text-white/90">
                  {isErrorState 
                    ? "Cairo, Egypt" 
                    : footerData?.site_address || "Cairo, Egypt"}
                </span>
              </div>
            </Link>

              <Link href="tel:+20212345678">
                <div className="flex items-start gap-3 group">
                  <div className="p-2 bg-[var(--main-color)]/10 rounded-full group-hover:bg-[var(--main-color)]/20 transition-colors">
                      <Phone className="h-4 w-4 text-[var(--main-color)] mt-0.5" aria-hidden="true" />
                    </div>
                    <span className="text-white/90">+20 2 1234 5678</span>
                </div>
              </Link>
              <Link href="mailto:info@egypttourgate.com">
              <div className="flex items-start gap-3 group">
                <div className="p-2 bg-[var(--main-color)]/10 rounded-full group-hover:bg-[var(--main-color)]/20 transition-colors">
                  <Mail className="h-4 w-4 text-[var(--main-color)] mt-0.5" aria-hidden="true" />
                </div>
                <span className="text-white/90">
                  {isErrorState ? "info@egypttourgaten.com" : "info@nilevoyages.com"}
                </span>
              </div>
              </Link>
            </div>
          </div>

          {/* Dynamic Categories - Preserved API structure with travel styling */}
          {isErrorState ? (
            <>
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-[var(--main-color)] rounded-r"></span>
                  Egypt Day Tours
                </h3>
                <ul className="space-y-2.5">
                  {["Cairo", "Luxor", "Hurghada", "Aswan"].map((item) => (
                    <li key={item}>
                      <Link 
                        href="#" 
                        className="flex items-center gap-2 text-white/80 hover:text-[var(--main-color)] transition-colors py-1 group"
                      >
                        <span className="w-1 h-1 bg-[var(--main-color)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-[var(--main-color)] rounded-r"></span>
                  Tour Packages
                </h3>
                <ul className="space-y-2.5">
                  {["Classic Packages", "Luxury Tours", "Family Trips"].map((item) => (
                    <li key={item}>
                      <Link 
                        href="#" 
                        className="flex items-center gap-2 text-white/80 hover:text-[var(--main-color)] transition-colors py-1 group"
                      >
                        <span className="w-1 h-1 bg-[var(--main-color)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-[var(--main-color)] rounded-r"></span>
                  Nile Cruises
                </h3>
                <ul className="space-y-2.5">
                  {["Luxor & Aswan", "Lake Nasser"].map((item) => (
                    <li key={item}>
                      <Link 
                        href="#" 
                        className="flex items-center gap-2 text-white/80 hover:text-[var(--main-color)] transition-colors py-1 group"
                      >
                        <span className="w-1 h-1 bg-[var(--main-color)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            // PRESERVED DYNAMIC CATEGORIES FROM API - with travel styling
            footerData?.footerCategories.map((category) => (
              <div key={category.id} className="space-y-4">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-[var(--main-color)] rounded-r"></span>
                  {category.name.en}
                </h3>
                <ul className="space-y-2.5">
                  {category.children.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={`/${category.slug}/${child.slug}`}
                        className="flex items-center gap-2 text-white/80 hover:text-[var(--main-color)] transition-colors py-1 group"
                      >
                        <span className="w-1 h-1 bg-[var(--main-color)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {child.name.en}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Bottom bar - Golden divider and copyright */}
        <div className="mt-12 pt-8 border-t border-[var(--main-color)]/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-white/70 text-sm text-center md:text-left max-w-2xl">
          © {currentYear}{" "}
          {isErrorState
            ? "Egypt Tour Gate. All rights reserved."
            : stripHtml(footerData?.copy_rights || "Egypt Tour Gate. All rights reserved.")}
        </p>
          
          <div 
            className="flex flex-wrap items-center justify-center gap-3 md:justify-end" 
            role="region" 
            aria-label="Follow us on social media"
          >
            <span className="text-white/70 text-sm hidden md:inline">Follow our journey:</span>
            <div className="flex gap-3">
              {socialData.map((item, index) => (
                <div 
                  key={index} 
                  className="group relative w-10 h-10 rounded-full overflow-hidden bg-white/10 hover:bg-[var(--main-color)] transition-all duration-300"
                >
                  <SimpleSocialIcon
                    item={item}
                    className="text-xl text-white group-hover:text-[var(--second-color)] transition-colors duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  // LOADING STATE - Travel-themed with golden spinner
  if (loading) {
    return (
      <footer 
        aria-live="polite" 
        aria-busy="true"
        className="relative bg-[var(--second-color)] text-white pt-16 pb-10 overflow-hidden"
      >
        {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22none%22/><path d=%22M20,20 Q40,5 60,20 T100,20 L100,100 L0,100 Z%22 fill=%22%23e3b75e%22 opacity=%220.03%22/></svg>')]"></div> */}
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-[var(--main-color)] border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-[var(--main-color)] rounded-full"></div>
              </div>
            </div>
            <p className="text-white/85 text-lg font-medium">Crafting your perfect Egyptian journey...</p>
            <p className="text-[var(--main-color)]/80 text-sm mt-1">Loading tour destinations, Nile routes & ancient wonders</p>
          </div>
        </div>
      </footer>
    );
  }

  // MAIN FOOTER - Travel-optimized design with all dynamic values preserved
  return (
    <footer 
      aria-label="Site footer - Egypt Tour Gate premium travel experiences"
      className="relative bg-[var(--second-color)] text-white pt-16 pb-10 overflow-hidden"
    >
      {/* Subtle decorative pattern */}
      {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22none%22/><path d=%22M20,20 Q40,5 60,20 T100,20 L100,100 L0,100 Z%22 fill=%22%23e3b75e%22 opacity=%220.03%22/></svg>')]"></div> */}
      
      {/* Golden top accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[var(--main-color)]"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        {renderFooterContent(!!error || !data)}
        
      </div>
      
      {/* Floating decorative element - subtle and elegant */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--main-color)]/5 rounded-full blur-2xl"></div>
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-[var(--main-color)]/3 rounded-full blur-3xl"></div>
    </footer>
  );
}