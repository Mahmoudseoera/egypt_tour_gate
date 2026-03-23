// lib/api/GeneralApi.ts
// Rebuilt to match the real backend API:
//   GET http://127.0.0.1:8000/api/v1/general-data?locale=en
//
// Real API response structure:
//   data.header.categories[].name          → string
//   data.header.categories[].slug          → string
//   data.header.categories[].subs[]        → { name, slug, media? }
//   data.header.languages[]                → { name, slug }
//   data.header.info                       → { phone, email, address }
//   data.header.logo                       → { image, alt, title }
//   data.footer.logo                       → { image, alt, title }
//   data.footer.info                       → { phone, email, address }
//   data.footer.categories[].name          → string
//   data.footer.categories[].slug          → string
//   data.footer.categories[].subs[]        → { name, slug }

"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@/lib/i18n/config";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface CategoryMedia {
  image: string;
  title: string;
  alt: string;
}

/** A sub-category as returned by the real API */
export interface SubCategory {
  name: string;
  slug: string;
  media?: CategoryMedia;
}

/** A top-level category as returned by the real API */
export interface Category {
  name: string;
  slug: string;
  subs: SubCategory[];
}

export interface Logo {
  image: string;
  alt: string;
  title: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
}

export interface Language {
  name: string;
  slug: string;
}

export interface HeaderData {
  logo: Logo;
  categories: Category[];
  languages: Language[];
  info: ContactInfo;
}

export interface FooterData {
  logo?: Logo;
  info?: ContactInfo;
  /** The footer categories use the same shape as header categories */
  categories: Category[];
}

export interface GeneralData {
  header: HeaderData;
  footer: FooterData;
}

// ─── Raw API types (what actually comes back from the server) ──────────────────

interface RawMedia {
  image?: string;
  title?: string;
  alt?: string;
}

interface RawSub {
  name?: string;
  slug?: string;
  media?: RawMedia;
}

interface RawCategory {
  name?: string;
  slug?: string;
  subs?: RawSub[];
}

interface RawLogo {
  image?: string;
  alt?: string;
  title?: string;
}

interface RawInfo {
  phone?: string;
  email?: string;
  address?: string;
}

interface RawLanguage {
  name?: string;
  slug?: string;
}

interface RawHeader {
  logo?: RawLogo;
  categories?: RawCategory[];
  languages?: RawLanguage[];
  info?: RawInfo;
}

interface RawFooter {
  logo?: RawLogo;
  info?: RawInfo;
  categories?: RawCategory[];
}

interface RawApiResponse {
  success?: boolean;
  data?: {
    header?: RawHeader;
    footer?: RawFooter;
    general?: unknown;
  };
  message?: string;
}

// ─── Normalizers ───────────────────────────────────────────────────────────────

function normalizeMedia(raw?: RawMedia): CategoryMedia | undefined {
  if (!raw) return undefined;
  return {
    image: raw.image ?? "",
    title: raw.title ?? "",
    alt: raw.alt ?? "",
  };
}

function normalizeSubs(raw?: RawSub[]): SubCategory[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s) => ({
    name: s.name ?? "",
    slug: s.slug ?? "",
    media: normalizeMedia(s.media),
  }));
}

function normalizeCategories(raw?: RawCategory[]): Category[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((c) => ({
    name: c.name ?? "",
    slug: c.slug ?? "",
    subs: normalizeSubs(c.subs),
  }));
}

function normalizeLogo(raw?: RawLogo): Logo {
  return {
    image: raw?.image ?? "",
    alt: raw?.alt ?? "",
    title: raw?.title ?? "",
  };
}

function normalizeInfo(raw?: RawInfo): ContactInfo {
  return {
    phone: raw?.phone,
    email: raw?.email,
    address: raw?.address,
  };
}

function normalizeLanguages(raw?: RawLanguage[]): Language[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((l) => l.slug && l.name)
    .map((l) => ({ name: l.name!, slug: l.slug! }));
}

function normalizeResponse(raw: RawApiResponse): GeneralData {
  if (!raw.success || !raw.data) {
    throw new Error(`API error: ${raw.message ?? "Unknown error"}`);
  }

  const { header: h = {}, footer: f = {} } = raw.data;

  return {
    header: {
      logo: normalizeLogo(h.logo),
      categories: normalizeCategories(h.categories),
      languages: normalizeLanguages(h.languages),
      info: normalizeInfo(h.info),
    },
    footer: {
      logo: f.logo ? normalizeLogo(f.logo) : undefined,
      info: normalizeInfo(f.info),
      // The real API uses `categories` inside footer too
      categories: normalizeCategories(f.categories),
    },
  };
}

// ─── Next.js proxy fetcher (avoids browser CORS) ──────────────────────────────
// Make sure you have: app/api/general/route.ts (see below)

async function fetchGeneralData(locale: SupportedLocale): Promise<GeneralData> {
  const res = await fetch(`/api/general?locale=${locale}`, {
    // Next.js App Router fetch options
    next: { revalidate: 3600, tags: ['general'] },
  });

  if (!res.ok) {
    throw new Error(`Proxy fetch failed: ${res.status} ${res.statusText}`);
  }

  const raw: RawApiResponse = await res.json();
  return normalizeResponse(raw);
}

// ─── React hook ────────────────────────────────────────────────────────────────

export interface UseGeneralDataResult {
  data: GeneralData | null;
  loading: boolean;
  error: string | null;
}

export function useGeneralData(
  locale: SupportedLocale = DEFAULT_LOCALE
): UseGeneralDataResult {
  const [data, setData] = useState<GeneralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchGeneralData(locale);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [locale]);

  return { data, loading, error };
}
