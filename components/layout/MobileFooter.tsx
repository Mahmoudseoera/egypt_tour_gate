// components/layout/MobileFooter.tsx
'use client';
import { useT } from "@/lib/hooks/useTranslate";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { type SiteSettings, type SiteSettingsApiResponse } from '@/lib/api/settingsApi';

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function toWhatsAppHref(raw: string | null | undefined): string {
  if (!raw) return 'https://wa.me/201110008407';
  if (raw.startsWith('http')) return raw;
  const digits = raw.replace(/[^\d]/g, '');
  return `https://wa.me/${digits}`;
}

function toTelHref(raw: string | null | undefined): string {
  if (!raw) return 'tel:+201110008407';
  const clean = raw.trim();
  return clean.startsWith('tel:') ? clean : `tel:${clean}`;
}

/* ── Client-side settings fetch ───────────────────────────────────────────── */

async function loadSettings(locale = 'en'): Promise<SiteSettings | null> {
  try {
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://www.egypttoursgate.com/api/v1')
      .replace(/\/+$/, '');
    const res = await fetch(`${base}/get-settings?locale=${locale}`);
    if (!res.ok) return null;
    const json: SiteSettingsApiResponse = await res.json();
    return json?.data?.[0] ?? null;
  } catch {
    return null;
  }
}

/* ── SVG Icons ────────────────────────────────────────────────────────────── */

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.91-1.14a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ContactIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/* ── NavItem sub-component ────────────────────────────────────────────────── */

interface NavItemProps {
  href: string;
  label: string;
  active: boolean;
  icon: React.ReactNode;
  external?: boolean;
}

function NavItem({ href, label, active, icon, external }: NavItemProps) {
  const inner = (
    <span className="mob-nav-inner" data-active={active}>
      <span className="mob-nav-pill" aria-hidden="true" />
      <span className="mob-nav-icon">{icon}</span>
      <span className="mob-nav-label">{label}</span>
      {active && <span className="mob-nav-bar" aria-hidden="true" />}
    </span>
  );

  if (external) {
    return (
      <a href={href} rel="noopener noreferrer"
        aria-label={label} className="mob-nav-btn">
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={label} className="mob-nav-btn">
      {inner}
    </Link>
  );
}

/* ── Component ────────────────────────────────────────────────────────────── */

export default function MobileFooter() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const t = useT("common");
  useEffect(() => {
    loadSettings('en').then(setSettings).catch(() => {});
  }, []);

  // Strip locale prefix so active check works across all locales
  const cleanPath = pathname.replace(/^\/(en|de|fr|pl)/, '') || '/';
  const isActive = (href: string) =>
    href === '/' ? cleanPath === '/' : cleanPath.startsWith(href);

  const whatsappHref = toWhatsAppHref(settings?.whatsapp);
  const phoneHref    = toTelHref(settings?.phone ?? settings?.mobile);

  return (
    <>
      {/* ── Scoped styles ───────────────────────────────────────────────── */}
      <style>{`
        /* Container */
        #mobileFixedFooter {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 999;
          background: #ffffff;
          border-top: 1px solid #e9edf5;
          box-shadow: 0 -6px 28px rgba(39, 61, 127, 0.09);
          /* Safe-area inset for iOS */
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        @media (max-width: 767px) {
          #mobileFixedFooter {
            display: flex;
          }
        }

        /* Inner row */
        .mob-nav-row {
          display: flex;
          align-items: stretch;
          width: 100%;
          height: 62px;
        }

        /* Each button */
        .mob-nav-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        /* Inner wrapper — positions pill, icon, label, bar */
        .mob-nav-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          position: relative;
          padding: 6px 10px 4px;
          border-radius: 12px;
          min-width: 52px;
          transition: transform 0.18s cubic-bezier(.34,1.56,.64,1);
        }

        /* Pill background — only visible when active */
        .mob-nav-pill {
          position: absolute;
          inset: 0;
          border-radius: 12px;
          background: rgba(39, 34, 98, 0.072);
          opacity: 0;
          transform: scale(0.7);
          transition:
            opacity 0.22s ease,
            transform 0.22s cubic-bezier(.34,1.56,.64,1);
          pointer-events: none;
        }

        [data-active="true"] .mob-nav-pill {
          opacity: 1;
          transform: scale(1);
        }

        /* Icon */
        .mob-nav-icon {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          color: #9ca3af;
          transition: color 0.2s ease, transform 0.2s cubic-bezier(.34,1.56,.64,1);
        }

        .mob-nav-icon svg {
          width: 100%;
          height: 100%;
        }

        [data-active="true"] .mob-nav-icon {
          color: #272262;
          transform: translateY(-1px);
        }

        /* Press feedback for inactive items */
        .mob-nav-btn:active .mob-nav-inner:not([data-active="true"]) {
          transform: scale(0.92);
        }

        /* Label */
        .mob-nav-label {
          position: relative;
          z-index: 1;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: #9ca3af;
          white-space: nowrap;
          transition: color 0.2s ease, font-weight 0.2s ease;
          font-family: 'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        [data-active="true"] .mob-nav-label {
          color: #272262;
          font-weight: 700;
        }

        /* Gold indicator bar */
        .mob-nav-bar {
          position: relative;
          z-index: 1;
          display: block;
          width: 20px;
          height: 2.5px;
          border-radius: 999px;
          background: #f2b705;
          margin-top: 1px;
          animation: barPop 0.28s cubic-bezier(.34,1.56,.64,1) both;
        }

        @keyframes barPop {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
      `}</style>

      {/* ── Markup ──────────────────────────────────────────────────────── */}
      <nav id="mobileFixedFooter" aria-label="Mobile navigation">
        <div className="mob-nav-row">

          {/* WhatsApp */}
          <NavItem
            href={whatsappHref}
            label="WhatsApp"
            active={false}
            icon={<WhatsAppIcon />}
            external
          />

          {/* Call */}
          <NavItem
            href={phoneHref}
            label= {t("mobile")}
            active={false}
            icon={<PhoneIcon />}
            external
          />

          {/* Home */}
          <NavItem
            href="/"
            label={t("home")}
            active={isActive('/')}
            icon={<HomeIcon />}
          />

          {/* Contact */}
          <NavItem
            href="/contact"
            label={t("contact")}
            active={isActive('/contact')}
            icon={<ContactIcon />}
          />

          {/* Book Now */}
          <NavItem
            href="/tailor-made"
            label={t("tailormade")}
            active={isActive('/tailor-made')}
            icon={<BookIcon />}
          />

        </div>
      </nav>
    </>
  );
}
