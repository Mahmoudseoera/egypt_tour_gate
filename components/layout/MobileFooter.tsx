// components/layout/MobileFooter.tsx
'use client';
import { useT } from "@/lib/hooks/useTranslate";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { type SiteSettings, type SiteSettingsApiResponse } from '@/lib/api/settingsApi';

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function toWhatsAppHref(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (raw.startsWith('http')) return raw;
  const digits = raw.replace(/[^\d]/g, '');
  return `https://wa.me/${digits}`;
}

function toTelHref(raw: string | null | undefined): string | null {
  if (!raw) return null;
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
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
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


      {/* ── Markup ──────────────────────────────────────────────────────── */}
      <nav id="mobileFixedFooter" aria-label={t("mobile_navigation")}>
        <div className="mob-nav-row">

          {/* WhatsApp */}
          {whatsappHref && (
            <NavItem
              href={whatsappHref}
              label={t("whatsapp")}
              active={false}
              icon={<WhatsAppIcon />}
              external
            />
          )}

          {/* Call */}
          {phoneHref && (
            <NavItem
              href={phoneHref}
              label={t("mobile")}
              active={false}
              icon={<PhoneIcon />}
              external
            />
          )}

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
