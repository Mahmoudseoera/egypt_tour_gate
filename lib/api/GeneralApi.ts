"use client";

import { useEffect, useState } from "react";
import { routing, type AppLocale } from "@/lib/i18n/routing";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CategoryMedia {
  image: string;
  title: string;
  alt: string;
}

export interface SubCategory {
  name: string;
  slug: string;
  media?: CategoryMedia;
}

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
  categories: Category[];
}

export interface GeneralData {
  header: HeaderData;
  footer: FooterData;
}

// ─── Raw API types ────────────────────────────────────────────────────────────

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

// ─── Normalizers ──────────────────────────────────────────────────────────────

function normalizeMedia(raw?: RawMedia): CategoryMedia | undefined {
  if (!raw) return undefined;
  return { image: raw.image ?? "", title: raw.title ?? "", alt: raw.alt ?? "" };
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
  return { image: raw?.image ?? "", alt: raw?.alt ?? "", title: raw?.title ?? "" };
}

function normalizeInfo(raw?: RawInfo): ContactInfo {
  return { phone: raw?.phone, email: raw?.email, address: raw?.address };
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
      categories: normalizeCategories(f.categories),
    },
  };
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────
//
// ❌ كان بيبعت مباشرة للـ external API من البراوزر → CORS error
//    fetch("https://www.egypttoursgate.com/api/v1/general-data?locale=de")
//
// ✅ دلوقتي بيبعت للـ proxy route الداخلي (same origin → مفيش CORS)
//    fetch("/api/general?locale=de")
//    اللي بدوره بيبعت للـ external API من الـ server

const generalDataCache = new Map<AppLocale, GeneralData>();
const generalDataRequests = new Map<AppLocale, Promise<GeneralData>>();

async function fetchGeneralData(locale: AppLocale): Promise<GeneralData> {
  const cached = generalDataCache.get(locale);
  if (cached) return cached;

  const inFlight = generalDataRequests.get(locale);
  if (inFlight) return inFlight;

  const request = fetch(`/api/general?locale=${locale}`, {
    cache: "force-cache",
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch general data [${locale}]: ${res.status} ${res.statusText}`);
      }

      const raw: RawApiResponse = await res.json();
      const normalized = normalizeResponse(raw);
      generalDataCache.set(locale, normalized);
      return normalized;
    })
    .finally(() => {
      generalDataRequests.delete(locale);
    });

  generalDataRequests.set(locale, request);
  return request;
}

// ─── React hook ───────────────────────────────────────────────────────────────

export interface UseGeneralDataResult {
  data: GeneralData | null;
  loading: boolean;
  error: string | null;
}

export function useGeneralData(
  locale: AppLocale = routing.defaultLocale
): UseGeneralDataResult {
  const [data, setData] = useState<GeneralData | null>(() => generalDataCache.get(locale) ?? null);
  const [loading, setLoading] = useState(() => !generalDataCache.has(locale));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cached = generalDataCache.get(locale);
        if (cached) {
          setData(cached);
          setLoading(false);
          setError(null);
          return;
        }

        setLoading(true);
        setError(null);
        const result = await fetchGeneralData(locale);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [locale]);

  return { data, loading, error };
}
