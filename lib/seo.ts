import type { Metadata } from "next";
import { buildLocalizedPath, routing, type AppLocale } from "@/lib/i18n/routing";

export const SITE_URL = "https://www.egypttoursgate.com";
export const SITE_NAME = "Egypt Tours Gate";
export const DEFAULT_SEO_IMAGE = `${SITE_URL}/assets/images/egypt-tour-gate-logo.png`;
export const TWITTER_HANDLE = "@Egypttoursgate1";

type SeoTagMap = Record<string, string>;

type BuildSeoMetadataInput = {
  seoHtml?: string | null;
  title?: string;
  description?: string;
  keywords?: string | string[];
  path: string;
  locale?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

function normalizePath(path: string) {
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

export function absoluteUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl) return SITE_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}

export function stripHtml(value?: string | null): string {
  if (!value) return "";
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateSeoText(value: string, maxLength = 160): string {
  const clean = stripHtml(value);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}…`;
}

function decodeAttribute(value: string): string {
  return value
    .replace(/&quot;/gi, '"')
    .replace(/&#34;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function getAttribute(tag: string, name: string): string | undefined {
  const pattern = new RegExp(`${name}\\s*=\\s*(["'])(.*?)\\1`, "i");
  const match = tag.match(pattern);
  return match?.[2] ? decodeAttribute(match[2].trim()) : undefined;
}

export function parseApiSeoHtml(seoHtml?: string | null): SeoTagMap {
  if (!seoHtml) return {};
  const tags: SeoTagMap = {};
  const titleMatch = seoHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch?.[1]) tags.title = stripHtml(titleMatch[1]);

  const metaMatches = seoHtml.match(/<meta\b[^>]*>/gi) ?? [];
  metaMatches.forEach((tag) => {
    const key = getAttribute(tag, "property") || getAttribute(tag, "name");
    const content = getAttribute(tag, "content");
    if (key && content) tags[key.toLowerCase()] = content;
  });

  return tags;
}

export function localizedAlternates(path: string) {
  const normalizedPath = normalizePath(path);
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      absoluteUrl(buildLocalizedPath(normalizedPath, locale as AppLocale)),
    ])
  ) as Record<string, string>;
}

export function buildSeoMetadata({
  seoHtml,
  title,
  description,
  keywords,
  path,
  locale = routing.defaultLocale,
  image,
  type = "website",
  noIndex = false,
}: BuildSeoMetadataInput): Metadata {
  const parsedSeo = parseApiSeoHtml(seoHtml);
  const canonicalPath = normalizePath(path);
  const canonical = absoluteUrl(canonicalPath);
  const seoTitle = parsedSeo.title || parsedSeo["og:title"] || parsedSeo["twitter:title"] || title || SITE_NAME;
  const seoDescription = truncateSeoText(
    parsedSeo.description ||
      parsedSeo["og:description"] ||
      parsedSeo["twitter:description"] ||
      description ||
      "Discover Egypt tours, Nile cruises, day trips, and tailor-made travel packages with Egypt Tours Gate."
  );
  const seoKeywords = parsedSeo.keywords || keywords;
  const seoImage = absoluteUrl(
    parsedSeo["og:image"] || parsedSeo["twitter:image"] || image || DEFAULT_SEO_IMAGE
  );
  const alternates = localizedAlternates(canonicalPath);

  return {
    metadataBase: new URL(SITE_URL),
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    alternates: {
      canonical,
      languages: {
        "x-default": canonical,
        ...alternates,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: parsedSeo["og:title"] || seoTitle,
      description: parsedSeo["og:description"] || seoDescription,
      url: canonical,
      siteName: parsedSeo["og:site_name"] || SITE_NAME,
      type: (parsedSeo["og:type"] as "website" | "article" | undefined) || type,
      locale,
      alternateLocale: routing.locales.filter((item) => item !== locale),
      images: [
        {
          url: seoImage,
          width: Number(parsedSeo["og:image:width"] || 1200),
          height: Number(parsedSeo["og:image:height"] || 630),
          alt: seoTitle,
        },
      ],
    },
    twitter: {
      card: (parsedSeo["twitter:card"] as "summary" | "summary_large_image" | undefined) || "summary_large_image",
      site: parsedSeo["twitter:site"] || TWITTER_HANDLE,
      creator: parsedSeo["twitter:creator"] || TWITTER_HANDLE,
      title: parsedSeo["twitter:title"] || seoTitle,
      description: parsedSeo["twitter:description"] || seoDescription,
      images: [seoImage],
    },
    other: {
      googlebot: "index, follow, max-image-preview:large",
      "theme-color": "#ffffff",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_SEO_IMAGE,
    description:
      "Egypt Tours Gate offers Egypt tours, day trips, Nile cruises, and custom travel packages with expert local guides.",
    sameAs: [
      "https://www.facebook.com/EgyptToursGate",
      "https://twitter.com/Egypttoursgate1",
      "https://www.instagram.com/egypttoursgate/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      areaServed: "EG",
      availableLanguage: ["English", "German", "French", "Polish", "Arabic"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en",
    isFamilyFriendly: true,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function travelAgencySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_SEO_IMAGE,
    image: DEFAULT_SEO_IMAGE,
    priceRange: "Starting From 35$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "EG",
      addressLocality: "Giza",
      addressRegion: "Giza Governorate",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      bestRating: 5,
      ratingValue: 5,
      reviewCount: 255,
    },
  };
}

export function breadcrumbSchema(items: Array<{ label: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function collectionPageSchema(input: {
  name: string;
  description: string;
  path: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.image ? absoluteUrl(input.image) : DEFAULT_SEO_IMAGE,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

export function tourSchema(input: {
  name: string;
  description: string;
  path: string;
  image?: string;
  price?: number;
  city?: string;
  duration?: string;
  code?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.image ? absoluteUrl(input.image) : DEFAULT_SEO_IMAGE,
    identifier: input.code,
    touristType: "Travelers interested in Egypt tours",
    itinerary: input.city
      ? {
          "@type": "ItemList",
          itemListElement: [{ "@type": "TouristAttraction", name: input.city }],
        }
      : undefined,
    offers: input.price
      ? {
          "@type": "Offer",
          price: input.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: absoluteUrl(input.path),
        }
      : undefined,
  };
}
