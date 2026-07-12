//lib/api/toursApi.ts
import { apiGet } from "@/lib/api/client";
import { routing, type AppLocale } from "@/lib/i18n/routing";
import { REVALIDATE, CACHE_TAGS, categoryTag, subcategoryTag, tourTag } from "@/lib/cache/tags";
import type { ApiSeo } from "@/lib/seo";

type AnyObj = Record<string, any>;

export interface ApiTourListItem {
  id: number;
  slug: string;
  title: string;
  image: string;
  price_from: number;
  price_after_discount: number;
  rating: number;
  duration: string;
  location: string;
  short_description?: string;
  seo?: ApiSeo;

  media?: {
    image?: string;
    title?: string;
    alt?: string;
  };

  categorySlug?: string;
  subCategorySlug?: string;

  href?: string;
}

/** A single price row derived from pricing_tables[].prices entries */
export interface PricingTableRow {
  category: string;   // e.g. "1", "2-4", "5-8" (pax group label)
  price: number;
  currency: string;
}

/** A full pricing table block (type "daily" | "hotel", with optional hotels array) */
export interface PricingTable {
  id: number;
  type: string;
  title: string;
  rows: PricingTableRow[];
}

/** Related article shape returned by related_articles */
export interface RelatedArticle {
  id: number;
  name: string;
  slug: string;
  small_desc?: string;
  date?: string;
  media?: { image: string; title?: string; alt?: string };
  blog_category?: { name: string; slug: string };
}

export interface ApiTourDetails extends ApiTourListItem {
  description?: string;
  highlights?: string[];
  itinerary?: Array<{ day?: number; title: string; description: string }>;
  included?: string[];
  excluded?: string[];
  images?: string[];
  /** Legacy flat pricing (kept for backward compat) */
  pricing?: Array<{ category: string; price: number }>;
  /** Rich pricing tables from pricing_tables API field */
  pricingTables?: PricingTable[];
  /** Related tours from related_tours API field */
  relatedTours?: ApiTourListItem[];
  /** Related articles from related_articles API field */
  relatedArticles?: RelatedArticle[];
  /** Tour code */
  code?: string;
}

function normalizeLocale(locale?: string): AppLocale {
  const nextLocale = (locale ?? routing.defaultLocale) as AppLocale;
  return routing.locales.includes(nextLocale) ? nextLocale : routing.defaultLocale;
}

// ─── Slug normalization ────────────────────────────────────────────────────────
// Two independent problems collapse into one fix here:
//
// 1. Unicode normalization mismatch (NFC vs NFD): the same visible character
//    (e.g. "è") can be encoded as a single codepoint (NFC) or as a base letter
//    plus a combining accent (NFD). Next.js route params and API JSON slugs can
//    arrive in different forms even though they render identically, which makes
//    strict `===` / `Array.find()` comparisons silently fail for non-ASCII slugs.
//
// 2. Accidental multi-round percent-/UTF-8 encoding ("Mojibake") picked up
//    somewhere in the chain (browser address bar, clipboard, build step). We
//    defensively decode until the string stops changing, then re-normalize.
//
// Applying this once, at the boundary where slugs enter this module (from
// `params` or from the API response), means every downstream `===` comparison
// and every fetch URL built from a slug operates on one canonical form.
export function normalizeSlug(input: unknown): string {
  if (typeof input !== "string" || input.length === 0) return "";

  let value = input;

  // Repeatedly attempt decodeURIComponent in case the slug was percent-encoded
  // more than once before reaching us. Stop as soon as decoding throws (already
  // plain) or stops changing the string (fully decoded).
  for (let i = 0; i < 3; i += 1) {
    if (!/%[0-9A-Fa-f]{2}/.test(value)) break;
    try {
      const decoded = decodeURIComponent(value);
      if (decoded === value) break;
      value = decoded;
    } catch {
      break;
    }
  }

  // Collapse to a single canonical Unicode form so byte-for-byte comparisons
  // between route params and API data behave consistently.
  return value.normalize("NFC");
}

function withLocale(path: string, locale: AppLocale): string {
  const q = locale === routing.defaultLocale ? "" : `?locale=${locale}`;
  return `${path}${q}`;
}

function pickData(payload: AnyObj): AnyObj {
  return payload?.data ?? payload ?? {};
}

function asArray(input: unknown): any[] {
  return Array.isArray(input) ? input : [];
}

function parsePrice(input: unknown): number {
  if (typeof input === "number") return input;
  if (typeof input === "string") {
    const cleaned = input.replace(/[^\d.]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function mapTour(item: AnyObj, fallbackSlug: string): ApiTourListItem {

  const categorySlug =
    item.subCategory?.categorySlug ??
    item.subCategory?.category?.slug ??
    "";

  const subCategorySlug =
    item.subCategory?.subCategorySlug ??
    item.subCategory?.subCategory?.slug ??
    "";

  return {
    id: Number(item.id ?? 0),
    slug: item.slug ?? fallbackSlug,

    title: item.title ?? item.name ?? "",
    
    image: item.image ?? item.media?.image ?? "",

    price_from: parsePrice(
      item.price_from ??
      item.price_after_discount ??
      item.price
    ),
    price_after_discount: item.price_after_discount ?? item.price_from ,
    rating: Number(item.rating ?? 0),

    duration:
      item.duration && item.duration_type
        ? `${item.duration} ${item.duration_type}`
        : "",

    location: item.location ?? item.city ?? "",

    short_description:
      item.small_desc ??
      item.short_description ??
      "",
    seo: item.seo && typeof item.seo === "object" ? item.seo as ApiSeo : undefined,

    categorySlug,
    subCategorySlug,

    href:
      categorySlug && subCategorySlug && item.slug
        ? `/${categorySlug}/${subCategorySlug}/${item.slug}`
        : `/${item.slug}`,

    media: item.media
      ? {
          image: item.media.image ?? "",
          title: item.media.title ?? "",
          alt: item.media.alt ?? "",
        }
      : undefined,
  };
}

function pickStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        const obj = item as AnyObj;
        return obj.title ?? obj.name ?? obj.text ?? obj.description ?? "";
      }
      return "";
    })
    .filter((v) => typeof v === "string" && v.trim().length > 0);
}

// ─── Strip HTML tags from description strings ─────────────────────────────────
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parse HTML inclusion/exclusion blocks into plain-text bullet arrays.
 * The real API returns these as an HTML string with <li> items.
 * Strategy:
 *   1. If the input is already a string[], return cleaned items.
 *   2. If it's an HTML string, extract <li> text nodes.
 *   3. If it's a plain string (no HTML), split by newline as fallback.
 */
function pickHtmlList(input: unknown): string[] {
  if (!input) return [];

  // Already an array — use existing pickStringArray logic
  if (Array.isArray(input)) return pickStringArray(input);

  if (typeof input !== "string" || !input.trim()) return [];

  // Extract <li> inner text
  const liMatches = input.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
  if (liMatches && liMatches.length > 0) {
    return liMatches
      .map((li) => stripHtml(li))
      .filter((s) => s.length > 0);
  }

  // Fallback: strip all HTML and split by newline
  const plain = stripHtml(input);
  return plain
    .split(/\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export async function getGeneralCategories(locale?: string): Promise<AnyObj[]> {
  const l = normalizeLocale(locale);

  let response: any;
  try {
  response = await apiGet<any>(withLocale("/general-data", l), {
    next: {
      revalidate: REVALIDATE.STANDARD,
      tags: [CACHE_TAGS.general, CACHE_TAGS.header, CACHE_TAGS.footer, CACHE_TAGS.categories],
    },
  });
  } catch (error) {
    // Critical path: this runs inside `generateStaticParams` for every locale.
    // If it throws, Next.js aborts static generation for that locale entirely
    // (no pages, not even a 404 fallback). A transient 429/network failure
    // from the backend's rate limiter should not be able to do that — degrade
    // to "no categories for this build pass" instead, and let ISR/on-demand
    // revalidation fill them in once the backend recovers.
    console.warn(`[getGeneralCategories] fetch failed for locale "${l}":`, String(error));
    return [];
  }

  const data = pickData(response);
  const categories = asArray(data?.header?.categories ?? data?.header?.headerCategories);

  // Normalize category + nested sub-category slugs to a single canonical Unicode
  // form (NFC). This array is matched against route params via strict `===` in
  // the category/subcategory pages, so any NFC/NFD mismatch between this API
  // response and `params.categorySlug` / `params.subcategorySlug` would silently
  // fail the lookup and trigger notFound() — even though the data itself exists.
  return categories.map((category: AnyObj) => ({
    ...category,
    slug: normalizeSlug(category?.slug),
    subs: asArray(category?.subs).map((sub: AnyObj) => ({
      ...sub,
      slug: normalizeSlug(sub?.slug),
    })),
  }));
}

// ─── Category page ────────────────────────────────────────────────────────────
// Real API: GET /categories/{slug}
// Response shape: { success, data: { id, name, slug, second_title, desc, media, seo, subCategories[] } }
// Note: subcategories are under `subCategories` (not `subs`).
export async function getCategoryBySlug(
  slug: string,
  locale?: string
): Promise<AnyObj | null> {
  const l = normalizeLocale(locale);
  const cleanSlug = normalizeSlug(slug);

  let response: any;
  try {
response = await apiGet<any>(withLocale(`/categories/${cleanSlug}`, l), {
  next: {
    revalidate: REVALIDATE.STANDARD,
    tags: [categoryTag(cleanSlug), CACHE_TAGS.categories],
  },
});
  } catch (error) {
    // A throttled/failed fetch here must not crash the build. Callers
    // (`getCategoryData`, `generateStaticParams`) already treat `null` as
    // "not found" and fall back accordingly.
    console.warn(`[getCategoryBySlug] fetch failed for "${cleanSlug}" (${l}):`, String(error));
    return null;
  }

  const data = pickData(response);

  // Normalize: expose `subs` so the page can use a single field name,
  // and expose plain `desc` / `second_title` for the description.
  const raw = data?.category ?? data;
  if (!raw || typeof raw !== "object") return null;

  return {
    ...raw,
    slug: normalizeSlug(raw.slug) || cleanSlug,
    // Unify subcategory field — real API returns `subCategories`
    subs: asArray(raw.subs ?? raw.subCategories ?? raw.sub_categories).map(
      (sub: AnyObj) => ({ ...sub, slug: normalizeSlug(sub?.slug) })
    ),
    // Plain-text description stripped of HTML
    plainDesc: raw.desc ,
  };
}

// ─── Subcategory page ─────────────────────────────────────────────────────────
// Real API: GET /sub-category/{slug}
// Response shape: { success, data: { id, name, slug, second_title, desc, media, seo, tours[] } }
// Tours are at data.tours (after pickData unwraps the outer `data` key).
export async function getSubcategoryBySlug(
  slug: string,
  locale?: string
): Promise<AnyObj | null> {
  const l = normalizeLocale(locale);
  const cleanSlug = normalizeSlug(slug);

  let response: any;
  try {
    response = await apiGet<any>(withLocale(`/sub-category/${cleanSlug}`, l), {
      next: {
  revalidate: REVALIDATE.STANDARD,
  tags: [subcategoryTag(cleanSlug), CACHE_TAGS.tours],
},
    });
  } catch (error) {
    // SubcategoryPage's getPageData() already merges this with a header-stub
    // fallback (`subcategoryFromHeader`) and treats `null` as "not found".
    // A throttled fetch during build must degrade to that path, not crash.
    console.warn(`[getSubcategoryBySlug] fetch failed for "${cleanSlug}" (${l}):`, String(error));
    return null;
  }

  const data = pickData(response);
  // real API: data IS the subcategory object directly (id, name, slug, desc, tours…)
  const raw = data?.sub_category ?? data?.subcategory ?? data;
  if (!raw || typeof raw !== "object") return null;

  return {
    ...raw,
    slug: normalizeSlug(raw.slug) || cleanSlug,
    plainDesc: raw.desc,
  };
}

export async function getToursBySubcategory(
  slug: string,
  locale?: string
): Promise<ApiTourListItem[]> {
  const l = normalizeLocale(locale);
  const cleanSlug = normalizeSlug(slug);

  let response: any;
  try {
    response = await apiGet<any>(withLocale(`/sub-category/${cleanSlug}`, l), {
      next: {
  revalidate: REVALIDATE.STANDARD,
  tags: [subcategoryTag(cleanSlug), CACHE_TAGS.tours],
},
    });
  } catch (error) {
    // SubcategoryPage already renders a "No tours found" message when this
    // array is empty — that's the correct degraded state for a throttled
    // build-time fetch, instead of crashing the whole page.
    console.warn(`[getToursBySubcategory] fetch failed for "${cleanSlug}" (${l}):`, String(error));
    return [];
  }

  const data = pickData(response);
  // real API: tours live at data.tours (after pickData unwraps outer `data`)
  const raw =
    data?.sub_category ?? data?.subcategory ?? data;
  const rawTours = asArray(
    raw?.tours ?? data?.tours ?? data?.items
  );
  return rawTours.map((item) => mapTour(item, item?.slug ?? ""));
}

export async function getTourBySlug(
  slug: string,
  locale?: string
): Promise<ApiTourDetails | null> {
  const l = normalizeLocale(locale);
  const cleanSlug = normalizeSlug(slug);

  let response: any;
  try {
    response = await apiGet<any>(withLocale(`/tour/${cleanSlug}`, l), {
      next: {
  revalidate: REVALIDATE.STANDARD,
  tags: [tourTag(cleanSlug), CACHE_TAGS.tours],
},
    });
  } catch (error) {
    // TourDetailPage already calls notFound() when this returns null.
    console.warn(`[getTourBySlug] fetch failed for "${cleanSlug}" (${l}):`, String(error));
    return null;
  }

  const data = pickData(response);
  const raw = data?.tour ?? data;
  if (!raw || typeof raw !== "object") return null;

  const highlights = pickStringArray(
    raw.highlights ?? raw.tour_highlights ?? raw.key_highlights
  );

  // ── Inclusion / Exclusion — raw API returns HTML strings ──────────────────
  // Strip HTML tags so UI renders clean plain-text bullet lists.
  const included = pickHtmlList(
    raw.included ?? raw.includes ?? raw.inclusions ?? raw.inclusion
  );
  const excluded = pickHtmlList(
    raw.excluded ?? raw.excludes ?? raw.exclusions ?? raw.exclusion
  );

  // ── Itinerary — real API returns items with `desc` (HTML) field ───────────
  const itineraryRaw = asArray(
    raw.itinerary ?? raw.plan ?? raw.days ?? raw.program
  );
  const itinerary = itineraryRaw
    .map((day, index) => ({
      day: Number(day?.day ?? day?.day_number ?? index + 1),
      title: day?.title ?? day?.name ?? day?.day ?? "",
      // real API uses `desc` (HTML) — strip tags; fallback to plain fields
      description: stripHtml(
        day?.desc ?? day?.description ?? day?.content ?? day?.text ?? ""
      ),
    }))
    .filter((day) => day.title || day.description);

  // ── Gallery images ────────────────────────────────────────────────────────
  // API returns gallery as [{id, type, image: "https://…/file name.jpg", title, alt}]
  // Some filenames contain spaces — encodeURI fixes that without breaking the protocol.
  // encodeURI(decodeURI(url)) is idempotent: safe to call on already-encoded URLs.
  function safeUrl(url: string): string {
    try { return encodeURI(decodeURI(url)); } catch { return url; }
  }

  // gallery[] is the canonical source; fall back to images[] or media.image
  const galleryRaw = asArray(raw.gallery);
  const images: string[] =
    galleryRaw.length > 0
      ? galleryRaw
          .map((img) => {
            const src =
              typeof img === "string"
                ? img
                : (img as AnyObj)?.image ?? (img as AnyObj)?.url ?? "";
            return src ? safeUrl(src) : "";
          })
          .filter(Boolean)
      : asArray(raw.images ?? raw.media?.images)
          .map((img) => {
            const src = typeof img === "string" ? img : (img as AnyObj)?.image ?? "";
            return src ? safeUrl(src) : "";
          })
          .filter(Boolean);

  // Last resort — use the tour cover image so gallery is never empty
  if (images.length === 0 && raw.media?.image) {
    images.push(safeUrl(String(raw.media.image)));
  }

  // ── Legacy flat pricing (backward compat) ─────────────────────────────────
  const pricing = asArray(raw.pricing ?? raw.price_table ?? raw.prices)
    .map((row) => ({
      category: row?.category ?? row?.name ?? "",
      price: parsePrice(row?.price ?? row?.amount),
    }))
    .filter((row) => row.category || row.price);

  // ── Rich pricing_tables (real API) ────────────────────────────────────────
  // Shape: [{ id, type, title, prices: { first: { title, price, currency }, second: … } }]
  const pricingTables: PricingTable[] = asArray(
    raw.pricing_tables ?? raw.pricingTables
  ).map((table) => {
    const pricesObj: Record<string, { title?: string; price?: unknown; currency?: string }> =
      table?.prices && typeof table.prices === "object" ? table.prices : {};
    const rows: PricingTableRow[] = Object.values(pricesObj)
      .filter((entry) => entry && typeof entry === "object")
      .map((entry) => ({
        category: String(entry.title ?? ""),
        price: parsePrice(entry.price),
        currency: String(entry.currency ?? "USD"),
      }))
      .filter((row) => row.category || row.price > 0);

    return {
      id: Number(table?.id ?? 0),
      type: String(table?.type ?? "daily"),
      title: String(table?.title ?? "Prices Per Person"),
      rows,
    };
  });

  // ── Related tours (real API field: related_tours) ─────────────────────────
  const relatedTours: ApiTourListItem[] = asArray(
    raw.related_tours ?? raw.relatedTours
  ).map((item) => mapTour(item, item?.slug ?? ""));

  // ── Related articles (real API field: related_articles) ───────────────────
  const relatedArticles: RelatedArticle[] = asArray(
    raw.related_articles ?? raw.relatedArticles
  ).map((item) => ({
    id: Number(item?.id ?? 0),
    name: item?.name ?? item?.title ?? "",
    slug: item?.slug ?? "",
    small_desc: item?.small_desc ?? item?.short_description ?? "",
    date: item?.date ?? item?.created_at ?? "",
    media: item?.media
      ? {
          image: item.media.image ?? item.media.image_url ?? "",
          title: item.media.title ?? "",
          alt: item.media.alt ?? "",
        }
      : undefined,
    blog_category: item?.blog_category
      ? { name: item.blog_category.name ?? "", slug: item.blog_category.slug ?? "" }
      : undefined,
  }));

  return {
    ...mapTour(raw, cleanSlug),
    code: raw.code ?? undefined,
    description: raw.desc
      ? stripHtml(raw.desc)
      : raw.description ?? raw.short_description ?? "",
    highlights,
    itinerary,
    included,
    excluded,
    images,
    pricing,
    pricingTables,
    relatedTours,
    relatedArticles,
  };
}
