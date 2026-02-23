'use client';

import Image from 'next/image';
import Link from 'next/link';
import '@/styles/animations.css';

interface HeroBanner {
  id: number;
  title: string;
  description: string;
  imageOne: string;
  imageTwo: string;
  backgroundImg: string;
}

const heroBanner: HeroBanner = {
  id: 1,
  title: 'Egypt Tour Gate',
  description:
    'Discover the wonders of Egypt with our premium tour experiences. Explore ancient pyramids, vibrant cultures, and unforgettable memories.',
  imageOne:
    '/assets/images/tours/9-Days-Marsa-Alam-Holiday-With-A-Tour-To-Pyramids-And-Old-Cairo-Egypt-Tours-Portal-webp.webp',
  imageTwo:
    '/assets/images/tours/luxurytours-webp.webp',
  backgroundImg:
    'https://images.unsplash.com/photo-1539768942893-daf53e448371?q=80&w=1600&auto=format&fit=crop',
};

// ─── Badge content — easy to update ───────────────────────────────────────────
const badgeContent = {
  brandLine: 'Egypt Tour Gate',
  titleLine: 'Traveler',
  subLine:   'Bright Ideas in Travel',
  yearLine:  '2025 WINNER',
};
// ─────────────────────────────────────────────────────────────────────────────

export default function EgyptToursBanner() {
  return (
    <>
      <section className="hero-section">

        {/* ── Full-width background image ── */}
        <div className="hero-bg-img">
          <Image
            src={heroBanner.backgroundImg}
            alt="Egypt background"
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        {/* ── Light warm overlay ── */}
        <div className="hero-overlay" />

        {/* ── Animated glow layers (light, no dark) ── */}
        <div className="hero-glow-layer" />
        <div className="hero-glow-layer-2" />

        {/* ── Subtle dot grid ── */}
        <div className="hero-grid" />

        {/* ── Decorative SVG shapes ── */}
        <div className="hero-decoratives">

          {/* Dashed flight paths */}
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1400 800" preserveAspectRatio="none">
            <path d="M 80 120 Q 400 60, 700 200 Q 1000 340, 1350 150"
              stroke="rgba(196,151,62,0.3)" strokeWidth="2" strokeDasharray="12,16" fill="none" className="shape-dash"/>
            <path d="M 0 400 Q 350 300, 600 450 Q 900 600, 1400 380"
              stroke="rgba(196,151,62,0.18)" strokeWidth="2" strokeDasharray="10,18" fill="none" className="shape-dash" style={{animationDelay:'3s'}}/>
            <path d="M 1400 600 Q 1000 500, 700 620 Q 400 740, 0 600"
              stroke="rgba(39,34,98,0.12)" strokeWidth="1.5" strokeDasharray="8,20" fill="none" className="shape-dash" style={{animationDelay:'6s'}}/>
          </svg>

          {/* ✈ Airplane 1 — top left */}
          <div className="absolute top-[10%] left-[5%] plane-1" style={{opacity:0.5}}>
            <svg width="52" height="52" viewBox="0 0 100 100">
              <path d="M75 45 L25 28 L18 35 L45 48 L20 58 L25 65 L48 58 L58 80 L65 77 L55 52 L82 56 Z" fill="#c4973e"/>
            </svg>
          </div>

          {/* ✈ Airplane 2 — mid right */}
          <div className="absolute top-[38%] right-[7%] plane-2" style={{opacity:0.3}}>
            <svg width="38" height="38" viewBox="0 0 100 100">
              <path d="M75 45 L25 28 L18 35 L45 48 L20 58 L25 65 L48 58 L58 80 L65 77 L55 52 L82 56 Z" fill="#272262"/>
            </svg>
          </div>

          {/* 🔺 Pyramids large — bottom left */}
          <div className="absolute bottom-[22%] left-[2%] pyramid-pulse shape-float-r">
            <svg width="88" height="68" viewBox="0 0 120 90">
              <polygon points="60,5 108,85 12,85" fill="none" stroke="#c4973e" strokeWidth="2" opacity="0.65"/>
              <polygon points="60,22 94,85 26,85" fill="rgba(196,151,62,0.1)" stroke="#c4973e" strokeWidth="1.5" opacity="0.45"/>
              <line x1="60" y1="5" x2="60" y2="85" stroke="rgba(196,151,62,0.25)" strokeWidth="1" strokeDasharray="3,5"/>
              <line x1="12" y1="85" x2="108" y2="85" stroke="#c4973e" strokeWidth="1.5" opacity="0.35"/>
            </svg>
          </div>

          {/* 🔺 Pyramids small — bottom right */}
          <div className="absolute bottom-[18%] right-[14%] pyramid-pulse shape-float" style={{animationDelay:'1.5s'}}>
            <svg width="60" height="50" viewBox="0 0 120 90">
              <polygon points="60,10 104,80 16,80" fill="none" stroke="#272262" strokeWidth="2" opacity="0.28"/>
              <polygon points="60,28 88,80 32,80" fill="rgba(39,34,98,0.07)" stroke="#272262" strokeWidth="1" opacity="0.25"/>
            </svg>
          </div>

          {/* 🦅 Sphinx — lower left */}
          <div className="absolute bottom-[32%] left-[16%] shape-float" style={{opacity:0.28, animationDelay:'2s'}}>
            <svg width="76" height="48" viewBox="0 0 160 100">
              <ellipse cx="80" cy="76" rx="58" ry="18" fill="rgba(196,151,62,0.1)" stroke="#c4973e" strokeWidth="1.5"/>
              <rect x="96" y="32" width="34" height="44" rx="8" fill="rgba(196,151,62,0.08)" stroke="#c4973e" strokeWidth="1.5"/>
              <ellipse cx="113" cy="32" rx="17" ry="17" fill="rgba(196,151,62,0.12)" stroke="#c4973e" strokeWidth="1.5"/>
              <line x1="106" y1="28" x2="120" y2="28" stroke="#c4973e" strokeWidth="1" opacity="0.5"/>
              <circle cx="109" cy="31" r="1.8" fill="#c4973e" opacity="0.55"/>
              <circle cx="117" cy="31" r="1.8" fill="#c4973e" opacity="0.55"/>
              <rect x="32" y="70" width="24" height="11" rx="5" fill="rgba(196,151,62,0.1)" stroke="#c4973e" strokeWidth="1.5"/>
              <rect x="60" y="72" width="20" height="9" rx="4" fill="rgba(196,151,62,0.08)" stroke="#c4973e" strokeWidth="1.5"/>
            </svg>
          </div>

          {/* ☀ Sun — top right area */}
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

          {/* ☂ Umbrella — top center desktop */}
          <div className="absolute top-[9%] left-[28%] umbrella-anim hidden md:block" style={{opacity:0.28}}>
            <svg width="52" height="52" viewBox="0 0 100 100">
              <path d="M50 22 A28 28 0 0 1 78 50 L22 50 A28 28 0 0 1 50 22 Z" fill="none" stroke="#c4973e" strokeWidth="2.5"/>
              <line x1="50" y1="50" x2="50" y2="84" stroke="#c4973e" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M50 84 Q54 89, 50 91 Q46 89, 50 84" fill="#c4973e" opacity="0.6"/>
              {[26,38,62,74].map((x,i) => (
                <line key={i} x1={x} y1="50" x2="50" y2="22" stroke="rgba(196,151,62,0.35)" strokeWidth="1"/>
              ))}
            </svg>
          </div>

          {/* 🌊 Waves — bottom right */}
          <div className="absolute bottom-[33%] right-[2%] shape-float-r" style={{opacity:0.25}}>
            <svg width="76" height="38" viewBox="0 0 160 80">
              <path d="M5 18 Q25 4, 45 18 Q65 32, 85 18 Q105 4, 125 18 Q145 32, 160 18" fill="none" stroke="#272262" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M5 38 Q25 24, 45 38 Q65 52, 85 38 Q105 24, 125 38 Q145 52, 160 38" fill="none" stroke="#272262" strokeWidth="2" strokeLinecap="round" opacity="0.65"/>
              <path d="M5 56 Q25 42, 45 56 Q65 70, 85 56 Q105 42, 125 56" fill="none" stroke="#272262" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
            </svg>
          </div>

          {/* ♦ Diamond accents */}
          <div className="absolute top-[22%] right-[19%] shape-float" style={{opacity:0.18, animationDelay:'2s'}}>
            <svg width="28" height="28" viewBox="0 0 40 40">
              <rect x="8" y="8" width="24" height="24" fill="none" stroke="#c4973e" strokeWidth="2" transform="rotate(45 20 20)"/>
            </svg>
          </div>
          <div className="absolute bottom-[42%] left-[11%] shape-float-r" style={{opacity:0.14, animationDelay:'1s'}}>
            <svg width="20" height="20" viewBox="0 0 40 40">
              <rect x="8" y="8" width="24" height="24" fill="rgba(196,151,62,0.12)" stroke="#c4973e" strokeWidth="2" transform="rotate(45 20 20)"/>
            </svg>
          </div>

          {/* Gold sparkle dots */}
          {[
            {top:'15%', left:'22%',  delay:'0s'},
            {top:'55%', left:'8%',   delay:'0.7s'},
            {top:'25%', right:'25%', delay:'1.2s'},
            {bottom:'35%', left:'38%', delay:'0.4s'},
            {top:'70%',  right:'30%', delay:'1.8s'},
          ].map((pos, i) => (
            <div key={i} className="hero-dot wave-dot-anim"
              style={{
                top: pos.top, left: pos.left,
                right: (pos as any).right, bottom: (pos as any).bottom,
                animationDelay: pos.delay,
              }}
            />
          ))}

        </div>


        {/* ── Pendulum Badge ── */}
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


        {/* ── Main Content ── */}
        <div className="hero-content">
          <div className="hero-inner">

            {/* Text */}
            <div className="hero-left animate-slide-in-left">

              <div className="hero-label-row">
                <span className="hero-label-line" />
                <span className="hero-label-text">Premium Egypt Travel</span>
                <span className="hero-label-line" />
              </div>

              <h1 className="hero-title">{heroBanner.title}</h1>

              <p className="hero-desc">{heroBanner.description}</p>

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

            {/* Photos */}
            <div className="hero-right">

              <div className="photo-wrapper-1 animate-floating">
                <div className="photo-ring" />
                <div className="photo-frame photo-frame-1">
                  <Image src={heroBanner.imageOne} alt="Egypt Tour" fill className="object-cover"/>
                  <div className="photo-shimmer overlay-animated opacity-10" />
                </div>
              </div>

              <div className="photo-wrapper-2 animate-floating-delayed">
                <div className="photo-ring photo-ring-2" />
                <div className="photo-frame photo-frame-2">
                  <Image src={heroBanner.imageTwo} alt="Luxury Tour" fill className="object-cover"/>
                  <div className="photo-shimmer overlay-animated opacity-10" />
                </div>
              </div>

            </div>
          </div>
        </div>


        {/* ── Scroll Indicator ── */}
        <Link href="#tours-section" className="scroll-indicator bottom-0 md:bottom-2" aria-label="Scroll to tours">
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
