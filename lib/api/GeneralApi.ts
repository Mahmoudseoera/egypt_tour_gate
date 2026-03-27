import { API_BASE_URL } from "@/lib/api/client";
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from "@/lib/i18n/config";

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
  };
  message?: string;
}

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
      categories: normalizeCategories(f.categories),
    },
  };
}

const FALLBACK_GENERAL_DATA: GeneralData = {
  header: {
    logo: { image: "", alt: "", title: "" },
    categories: [],
    languages: [
      { slug: "en", name: "English" },
      { slug: "de", name: "Deutsch" },
      { slug: "fr", name: "Français" },
      { slug: "pl", name: "Polski" },
      { slug: "pt", name: "Português" },
    ],
    info: {},
  },
  footer: {
    categories: [],
    info: {},
  },
};

export async function getGeneralData(locale: string = DEFAULT_LOCALE): Promise<GeneralData> {
  const safeLocale: SupportedLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;

  try {
    const upstream = await fetch(`${API_BASE_URL}/general-data?locale=${safeLocale}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      next: { revalidate: 3600, tags: [`general-${safeLocale}`] },
      signal: AbortSignal.timeout(6000),
    });

    if (!upstream.ok) {
      throw new Error(`Backend responded with ${upstream.status} ${upstream.statusText}`);
    }

    const raw: RawApiResponse = await upstream.json();
    return normalizeResponse(raw);
  } catch (error) {
    console.error("[getGeneralData] failed, falling back:", error);
    return FALLBACK_GENERAL_DATA;
  }
}
