'use client';

import Image from 'next/image';
import Link from 'next/link';
import '@/styles/animations.css';
import type { SliderItem } from '@/lib/api/homeTypes';

// ─── Static fallback data ──────────────────────────────────────────────────
const fallback = {
  title: 'Egypt Tour Gate',
  description:
    'Discover the wonders of Egypt with our premium tour experiences. Explore ancient pyramids, vibrant cultures, and unforgettable memories.',
  imageOne: '/assets/images/tours/9-Days-Marsa-Alam-Holiday-With-A-Tour-To-Pyramids-And-Old-Cairo-Egypt-Tours-Portal-webp.webp',
  imageTwo: '/assets/images/tours/luxurytours-webp.webp',
  backgroundImg: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=1600&auto=format&fit=crop',
};

const badgeContent = {
  brandLine: 'Egypt Tour Gate',
  titleLine: 'Traveler',
  subLine: 'Bright Ideas in Travel',
  yearLine: '2025 WINNER',
};

// ─── Props ────────────────────────────────────────────────────────────────
interface EgyptToursBannerProps {
  /** Slider items from the home API. Falls back to static content if empty. */
  sliderData?: SliderItem[];
}

export default function EgyptToursBanner({ sliderData = [] }: EgyptToursBannerProps) {
  // Use first slider item from the API when available
  const firstSlide = sliderData[0];

  const title = firstSlide?.title;
  // Strip HTML tags from the API description
  const description = firstSlide?.description.replace(/<[^>]+>/g, '').trim();
  const imageOne = firstSlide?.media?.image_url ?? fallback.imageOne;

  return (
    <>
      <section className="hero-section">

        {/* Full-width background image */}
        <div className="hero-bg-img">
          <Image
            src={fallback.backgroundImg}
            alt={firstSlide?.media?.image_alt ?? title}
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        <div className="hero-overlay" />
        <div className="hero-glow-layer" />
        <div className="hero-glow-layer-2" />
        <div className="hero-grid" />

        {/* Decorative SVG shapes */}
        <div className="hero-decoratives">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1400 800" preserveAspectRatio="none">
            <path d="M 80 120 Q 400 60, 700 200 Q 1000 340, 1350 150"
              stroke="rgba(196,151,62,0.3)" strokeWidth="2" strokeDasharray="12,16" fill="none" className="shape-dash"/>
            <path d="M 0 400 Q 350 300, 600 450 Q 900 600, 1400 380"
              stroke="rgba(196,151,62,0.18)" strokeWidth="2" strokeDasharray="10,18" fill="none" className="shape-dash" style={{animationDelay:'3s'}}/>
            <path d="M 1400 600 Q 1000 500, 700 620 Q 400 740, 0 600"
              stroke="rgba(39,34,98,0.12)" strokeWidth="1.5" strokeDasharray="8,20" fill="none" className="shape-dash" style={{animationDelay:'6s'}}/>
          </svg>

          <div className="absolute top-[10%] left-[5%] plane-1" style={{opacity:0.5}}>
            <svg width="52" height="52" viewBox="0 0 100 100">
              <path d="M75 45 L25 28 L18 35 L45 48 L20 58 L25 65 L48 58 L58 80 L65 77 L55 52 L82 56 Z" fill="#c4973e"/>
            </svg>
          </div>
          <div className="absolute top-[38%] right-[7%] plane-2" style={{opacity:0.3}}>
            <svg width="38" height="38" viewBox="0 0 100 100">
              <path d="M75 45 L25 28 L18 35 L45 48 L20 58 L25 65 L48 58 L58 80 L65 77 L55 52 L82 56 Z" fill="#272262"/>
            </svg>
          </div>
          <div className="absolute bottom-[22%] left-[2%] pyramid-pulse shape-float-r">
            <svg width="88" height="68" viewBox="0 0 120 90">
              <polygon points="60,5 108,85 12,85" fill="none" stroke="#c4973e" strokeWidth="2" opacity="0.65"/>
              <polygon points="60,22 94,85 26,85" fill="rgba(196,151,62,0.1)" stroke="#c4973e" strokeWidth="1.5" opacity="0.45"/>
            </svg>
          </div>
          <div className="absolute top-[8%] right-[5%] shape-spin" style={{opacity:0.2}}>
            <svg width="66" height="66" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="16" fill="#c4973e" opacity="0.8"/>
              {[0,45,90,135,180,225,270,315].map((deg, i) => (
                <line key={i} x1="50" y1="26" x2="50" y2="15"
                  stroke="#c4973e" strokeWidth="3" strokeLinecap="round"
                  transform={`rotate(${deg} 50 50)`} opacity="0.7"/>
              ))}
            </svg>
          </div>
          {[
            {top:'15%', left:'22%', delay:'0s'},
            {top:'55%', left:'8%', delay:'0.7s'},
            {top:'25%', right:'25%', delay:'1.2s'},
            {bottom:'35%', left:'38%', delay:'0.4s'},
            {top:'70%', right:'30%', delay:'1.8s'},
          ].map((pos, i) => (
            <div key={i} className="hero-dot wave-dot-anim"
              style={{ top: pos.top, left: pos.left, right: (pos as any).right, bottom: (pos as any).bottom, animationDelay: pos.delay }}
            />
          ))}
        </div>

        {/* Pendulum Badge */}
        <div className="pendulum-wrapper">
          <div className="pendulum-string" />
          <div className="pendulum-box">
            <span className="badge-brand">{badgeContent.brandLine}</span>
            <span className="badge-title">{badgeContent.titleLine}</span>
            <div className="badge-divider" />
            <span className="badge-sub">{badgeContent.subLine}</span>
            <span className="badge-year">{badgeContent.yearLine}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="hero-content">
          <div className="hero-inner">
            <div className="hero-left animate-slide-in-left">
              <div className="hero-label-row">
                <span className="hero-label-line" />
                <span className="hero-label-text">Premium Egypt Travel</span>
                <span className="hero-label-line" />
              </div>
              <h1 className="hero-title">{title}</h1>
              <p className="hero-desc">{description}</p>
              <div className="hero-btns">
                <Link href="/contact" className="btn-primary">
                  Explore Tours
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </Link>
                <Link href="#tours-section" className="btn-secondary">
                  View Tours
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </Link>
              </div>
            </div>

            <div className="hero-right">
              <div className="photo-wrapper-1 animate-floating">
                <div className="photo-ring" />
                <div className="photo-frame photo-frame-1">
                  <Image src={fallback.imageOne} alt="Egypt Tour" fill className="object-cover"/>
                  <div className="photo-shimmer overlay-animated opacity-10" />
                </div>
              </div>
              <div className="photo-wrapper-2 animate-floating-delayed">
                <div className="photo-ring photo-ring-2" />
                <div className="photo-frame photo-frame-2">
                  <Image src={fallback.imageTwo} alt="Luxury Tour" fill className="object-cover"/>
                  <div className="photo-shimmer overlay-animated opacity-10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <Link href="#tours-section" className="scroll-indicator bottom-3 md:bottom-4" aria-label="Scroll to tours">
          <span className="scroll-label">Scroll</span>
          <div className="scroll-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="#c4973e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </Link>
      </section>
    </>
  );
}
