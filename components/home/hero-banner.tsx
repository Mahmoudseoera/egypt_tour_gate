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
  brandLine: 'Condé Nast',
  titleLine: 'Traveler',
  subLine:   'Bright Ideas in Travel',
  yearLine:  '2023 WINNER',
};
// ─────────────────────────────────────────────────────────────────────────────

export default function EgyptToursBanner() {
  return (
    <>
      <style jsx global>{`

        /* ============================================================
           SECTION SHELL
        ============================================================ */
        .hero-section {
          position: relative;
          width: 100%;
          min-height: 88svh;
          overflow: hidden;
          display: flex;
          align-items: center;
          clip-path: polygon(100% 0, 100% 93%, 50% 100%, 0 93%, 0 0);
        }
        @media (min-width: 768px)  { .hero-section { min-height: 70vh; } }
        @media (min-width: 1024px) { .hero-section { min-height: 80vh; } }


        /* ============================================================
           FULL-WIDTH BACKGROUND IMAGE + LIGHT OVERLAY
        ============================================================ */
        .hero-bg-img {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero-bg-img img {
          object-fit: cover;
          object-position: center;
        }

        /*
          Light overlay:
          — white-ish tint so the design stays LIGHT
          — gold radial glow pulses subtly (the "glow animation")
          — no dark overlay that kills readability
        */
        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          /* base: very light warm white so bg photo reads softly through */
          background: rgba(255, 252, 245, 0.82);
        }

        /* Animated gold glow that breathes — keeps it light & lively */
        @keyframes glowPulse {
          0%   { opacity: 0; }
          50%  { opacity: 1; }
          100% { opacity: 0; }
        }

        .hero-glow-layer {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            radial-gradient(ellipse 70% 60% at 15% 50%,  rgba(227,183,94,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 50% at 85% 20%,  rgba(227,183,94,0.12) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 60% 85%,  rgba(39,34,98,0.07)   0%, transparent 60%);
          animation: glowPulse 6s ease-in-out infinite;
        }

        /* Second glow layer offset in time so they alternate smoothly */
        .hero-glow-layer-2 {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            radial-gradient(ellipse 55% 55% at 80% 55%,  rgba(227,183,94,0.14) 0%, transparent 70%),
            radial-gradient(ellipse 45% 45% at 25% 20%,  rgba(39,34,98,0.06)   0%, transparent 65%);
          animation: glowPulse 6s ease-in-out infinite;
          animation-delay: 3s;
        }

        /* Very subtle dot grid */
        .hero-grid {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          opacity: 0.06;
          background-image:
            radial-gradient(circle, rgba(39,34,98,1) 1px, transparent 1px);
          background-size: 32px 32px;
        }


        /* ============================================================
           PENDULUM BADGE  — self-contained box, easy to edit content
        ============================================================ */
        @keyframes pendulum {
          0%   { transform: rotate(-20deg); }
          50%  { transform: rotate(20deg); }
          100% { transform: rotate(-20deg); }
        }

        /* Entire column (string + box) swings as one from top */
        .pendulum-wrapper {
          position: absolute;
          top: 0;
          right: 2.5rem;
          z-index: 40;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform-origin: top center;
          animation: pendulum 3.2s ease-in-out infinite;
        }
        @media (max-width: 640px) {
          .pendulum-wrapper { right: 1rem; }
        }

        /* String */
        .pendulum-string {
          width: 2px;
          height: 56px;
          background: linear-gradient(to bottom, #c4973e, rgba(196,151,62,0.1));
          flex-shrink: 0;
        }
        @media (max-width: 640px) { .pendulum-string { height: 36px; } }

        /* Badge box — golden card */
        .pendulum-box {
          position: relative;
          width: 108px;
          border-radius: 12px;
          padding: 10px 10px 10px;
          background: linear-gradient(145deg, #e3b75e 0%, #d09a38 60%, #c4973e 100%);
          box-shadow:
            0 8px 28px rgba(196,151,62,0.55),
            0 2px 8px rgba(0,0,0,0.18),
            inset 0 1px 2px rgba(255,255,255,0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2px;
          overflow: hidden;
        }
        @media (max-width: 640px) {
          .pendulum-box { width: 78px; padding: 7px; border-radius: 8px; }
        }

        /* Shine sweep animation */
        @keyframes badgeShine {
          0%   { transform: translateX(-160%) rotate(25deg); }
          55%  { transform: translateX(160%) rotate(25deg); }
          100% { transform: translateX(160%) rotate(25deg); }
        }
        .pendulum-box::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent);
          animation: badgeShine 3.2s ease-in-out infinite;
          pointer-events: none;
        }

        /* Badge typography */
        .badge-brand  {
          font-size: 6.5px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #1c1747; line-height: 1.3;
        }
        .badge-title  {
          font-size: 15px; font-weight: 900;
          font-style: italic; letter-spacing: -0.02em;
          color: #1c1747; line-height: 1;
        }
        .badge-divider {
          width: 60%; height: 1px;
          background: rgba(28,23,71,0.25);
          margin: 2px 0;
        }
        .badge-sub    {
          font-size: 5.5px; font-weight: 700;
          text-transform: uppercase; color: #1c1747;
          letter-spacing: 0.06em; line-height: 1.5;
        }
        .badge-year   {
          font-size: 6px; font-weight: 900;
          letter-spacing: 0.1em;
          color: rgba(28,23,71,0.75);
          margin-top: 1px;
        }
        @media (max-width: 640px) {
          .badge-title { font-size: 11px; }
          .badge-brand { font-size: 5px; }
          .badge-sub   { font-size: 4px; }
          .badge-year  { font-size: 4.5px; }
        }


        /* ============================================================
           LAYOUT
        ============================================================ */
        .hero-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 5rem 1.25rem 5.5rem;
        }
        @media (min-width: 768px)  { .hero-content { padding: 3.5rem 2rem 5rem; } }

        .hero-inner {
          display: grid;
          gap: 2rem;
          align-items: center;
        }
        @media (min-width: 768px) {
          .hero-inner { grid-template-columns: 1fr 1fr; gap: 3rem; }
        }

        /* Text side */
        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          text-align: center;
          order: 2;
        }
        @media (min-width: 768px) { .hero-left { text-align: left; order: 1; } }


        /* ============================================================
           TEXT — dark navy on light bg = excellent contrast
        ============================================================ */
        .hero-label-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          justify-content: center;
        }
        @media (min-width: 768px) { .hero-label-row { justify-content: flex-start; } }

        .hero-label-line {
          display: block; width: 2.5rem; height: 3px;
          border-radius: 9999px; background: #e3b75e; flex-shrink: 0;
        }
        .hero-label-text {
          font-size: 0.65rem; font-weight: 800;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #c4973e;   /* warm gold — visible on light bg */
        }

        /* Title: deep navy, very high contrast on light/white overlay */
        .hero-title {
          font-size: clamp(1.9rem, 5vw, 3.2rem);
          font-weight: 900;
          line-height: 1.13;
          color: #1c1747;  /* dark navy — contrast 12:1+ on light bg */
          margin: 0;
        }

        /* Gold accent word inside title */
        .hero-title-gold { color: #c4973e; }

        /* Description: medium navy */
        .hero-desc {
          font-size: clamp(0.88rem, 2vw, 1rem);
          line-height: 1.78;
          color: #3a3670;  /* medium navy — still high contrast on light bg */
          max-width: 30rem;
          margin: 0 auto;
        }
        @media (min-width: 768px) { .hero-desc { margin: 0; } }


        /* ============================================================
           BUTTONS — navy/gold contrast on light bg
        ============================================================ */
        .hero-btns {
          display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center;
        }
        @media (min-width: 768px) { .hero-btns { justify-content: flex-start; } }

        /* Primary: gold bg + dark navy text */
        .btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.8rem 1.7rem; border-radius: 0.75rem;
          font-weight: 800; font-size: 0.875rem;
          background: #e3b75e; color: #1c1747;
          border: none; text-decoration: none;
          box-shadow: 0 6px 22px rgba(196,151,62,0.45);
          transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
        }
        .btn-primary:hover {
          background: #d09a38; color: #1c1747;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(196,151,62,0.55);
        }

        /* Secondary: navy border + navy text on transparent */
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.8rem 1.7rem; border-radius: 0.75rem;
          font-weight: 700; font-size: 0.875rem;
          background: rgba(28,23,71,0.07);
          color: #1c1747; /* dark navy — great on light bg */
          border: 1.5px solid rgba(28,23,71,0.3);
          text-decoration: none;
          transition: background 0.25s, border-color 0.25s, transform 0.25s;
        }
        .btn-secondary:hover {
          background: rgba(28,23,71,0.12);
          border-color: rgba(28,23,71,0.5);
          color: #1c1747;
          transform: translateY(-2px);
        }


        /* ============================================================
           PHOTOS — bigger, small border-radius
        ============================================================ */
        .hero-right {
          display: flex; justify-content: center;
          align-items: flex-end; gap: 1.5rem;
          order: 1;
        }
        @media (min-width: 768px) { .hero-right { order: 2; } }

        .photo-wrapper-1 { position: relative; margin-bottom: 2.5rem; }
        .photo-wrapper-2 { position: relative; margin-top: 2.5rem; }

        /* Small border-radius (not pill), larger size */
        .photo-frame {
          border-radius: 16px;          /* small, clean radius */
          overflow: hidden;
          position: relative;
          transition: border-radius 0.5s ease, transform 0.4s ease;
          box-shadow: 0 20px 60px rgba(28,23,71,0.22), 0 4px 12px rgba(0,0,0,0.12);
        }
        .photo-frame:hover {
          border-radius: 24px;
          transform: scale(1.02);
        }

        /* Bigger dimensions */
        .photo-frame-1 {
          width: clamp(145px, 24vw, 250px);
          height: clamp(220px, 38vw, 390px);
          border: 3px solid rgba(227,183,94,0.65);
        }
        .photo-frame-2 {
          width: clamp(125px, 20vw, 215px);
          height: clamp(190px, 32vw, 330px);
          border: 3px solid rgba(39,34,98,0.3);
        }

        /* Pulsing glow rings */
        @keyframes pingRing {
          0%   { opacity: 0.35; transform: scale(1); }
          50%  { opacity: 0.1;  transform: scale(1.07); }
          100% { opacity: 0.35; transform: scale(1); }
        }
        .photo-ring {
          position: absolute; inset: -10px;
          border-radius: 20px;
          border: 2px solid #e3b75e;
          animation: pingRing 3s ease-in-out infinite;
          pointer-events: none;
        }
        .photo-ring-2 {
          border-color: #272262;
          animation-delay: 1.5s;
        }

        .photo-shimmer {
          position: absolute; inset: 0;
          border-radius: inherit; pointer-events: none;
        }


        /* ============================================================
           DECORATIVE SHAPES  (unchanged, all kept)
        ============================================================ */
        .hero-decoratives {
          position: absolute; inset: 0;
          pointer-events: none; overflow: hidden;
          z-index: 4;
        }

        @keyframes floatShape    { 0%,100% { transform:translateY(0px) rotate(0deg); }   50% { transform:translateY(-16px) rotate(4deg); } }
        @keyframes floatShapeRev { 0%,100% { transform:translateY(0px) rotate(0deg); }   50% { transform:translateY(-10px) rotate(-3deg); } }
        @keyframes spinSlow      { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes dashMove      { to { stroke-dashoffset:-200; } }
        @keyframes pyramidPulse  { 0%,100% { opacity:0.22; } 50% { opacity:0.48; } }
        @keyframes waveDot       { 0%,100% { transform:scale(1); opacity:0.55; } 50% { transform:scale(1.6); opacity:1; } }
        @keyframes planeMove     { 0%,100% { transform:translateX(0) translateY(0); } 50% { transform:translateX(28px) translateY(-14px); } }
        @keyframes planeMove2    { 0%,100% { transform:scaleX(-1) translateX(0px); } 50% { transform:scaleX(-1) translateX(18px) translateY(10px); } }
        @keyframes umbrellaSwing { 0%,100% { transform:rotate(-5deg); } 50% { transform:rotate(5deg); } }

        .shape-float    { animation: floatShape    5s ease-in-out infinite; }
        .shape-float-r  { animation: floatShapeRev 4.5s ease-in-out infinite; }
        .shape-spin     { animation: spinSlow      20s linear infinite; }
        .shape-dash     { animation: dashMove      8s linear infinite; }
        .pyramid-pulse  { animation: pyramidPulse  4s ease-in-out infinite; }
        .wave-dot-anim  { animation: waveDot       2.2s ease-in-out infinite; }
        .plane-1        { animation: planeMove     7s ease-in-out infinite; }
        .plane-2        { animation: planeMove2    9s ease-in-out infinite; }
        .umbrella-anim  { animation: umbrellaSwing 4s ease-in-out infinite; }

        .hero-dot {
          position: absolute;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #e3b75e;
        }


        /* ============================================================
           SCROLL INDICATOR
        ============================================================ */
        @keyframes scrollBounce {
          0%,100% { transform:translateY(0); opacity:0.75; }
          50%      { transform:translateY(7px); opacity:1; }
        }

        .scroll-indicator {
          position: absolute; bottom: 3.5rem;
          left: 50%; transform: translateX(-50%);
          z-index: 20;
          display: flex; flex-direction: column;
          align-items: center; gap: 0.3rem;
          text-decoration: none;
        }
        .scroll-label {
          font-size: 0.58rem; font-weight: 800;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: #c4973e;
        }
        .scroll-pill {
          display: flex; align-items: center; justify-content: center;
          width: 2.2rem; height: 2.2rem; border-radius: 9999px;
          border: 1.5px solid rgba(196,151,62,0.6);
          background: rgba(227,183,94,0.15);
          animation: scrollBounce 1.5s ease-in-out infinite;
        }

      `}</style>

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
        <Link href="#tours-section" className="scroll-indicator" aria-label="Scroll to tours">
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
