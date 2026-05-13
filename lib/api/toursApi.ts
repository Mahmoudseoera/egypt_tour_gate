import { apiGet } from "@/lib/api/client";
import { routing, type AppLocale } from "@/lib/i18n/routing";

type AnyObj = Record<string, any>;

export interface ApiTourListItem {
  id: number;
  slug: string;
  title: string;
  image: string;
  price_from: number;
  rating: number;
  duration: string;
  location: string;
  short_description?: string;
  seo?: string;
  media?: { image?: string; title?: string; alt?: string };
}

export interface PricingTableRow {
  category: string;
  price: number;
  currency: string;
}

export interface PricingTable {
  id: number;
  type: string;
  title: string;
  rows: PricingTableRow[];
}

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
  pricing?: Array<{ category: string; price: number }>;
  pricingTables?: PricingTable[];
  relatedTours?: ApiTourListItem[];
  relatedArticles?: RelatedArticle[];
  code?: string;
}

function normalizeLocale(locale?: string): AppLocale {
  const nextLocale = (locale ?? routing.defaultLocale) as AppLocale;
  return routing.locales.includes(nextLocale) ? nextLocale : routing.defaultLocale;
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
  const candidatePrice =
    item.price_from ??
    item.price_after_discount ??
    item.price_before_discount ??
    item.price ??
    item.start_from ??
    item.start_price ??
    item.from_price ??
    item.cost;

  const rawDuration = item.duration ?? "";
  const durationType = item.duration_type ?? "";
  const duration =
    rawDuration && durationType
      ? `${rawDuration} ${durationType}`
      : rawDuration || durationType || "";

  return {
    id: Number(item.id ?? 0),
    slug: item.slug ?? fallbackSlug,
    title: item.title ?? item.name ?? "",
    image: item.image ?? item.media?.image ?? "",
    price_from: parsePrice(candidatePrice),
    rating: Number(item.rating ?? 0),
    duration,
    location: item.location ?? item.city ?? item.sub_category_name ?? "",
    short_description:
      item.small_desc ??
      item.short_description ??
      item.summary ??
      item.description ??
      "",
    seo: item.seo ?? "",
    media: item.media
      ? {
          image: item.media.image ?? item.media.image_url ?? "",
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

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickHtmlList(input: unknown): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return pickStringArray(input);
  if (typeof input !== "string" || !input.trim()) return [];

  const liMatches = input.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
  if (liMatches && liMatches.length > 0) {
    return liMatches
      .map((li) => stripHtml(li))
      .filter((s) => s.length > 0);
  }

  const plain = stripHtml(input);
  return plain
    .split(/\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export async function getGeneralCategories(locale?: string): Promise<AnyObj[]> {
  const l = normalizeLocale(locale);
  const response = await apiGet<any>(withLocale("/general-data", l), {
    next: { revalidate: 3600, tags: ["general"] },
  });
  const data = pickData(response);
  return asArray(data?.header?.categories ?? data?.header?.headerCategories);
}

export async function getCategoryBySlug(
  slug: string,
  locale?: string
): Promise<AnyObj | null> {
  const l = normalizeLocale(locale);
  const response = await apiGet<any>(withLocale(`/categories/${slug}`, l), {
    next: { revalidate: 3600, tags: [`category:${slug}`] },
  });
  const data = pickData(response);

  const raw = data?.category ?? data;
  if (!raw || typeof raw !== "object") return null;

  return {
    ...raw,
    subs: asArray(raw.subs ?? raw.subCategories ?? raw.sub_categories),
    plainDesc: raw.desc ? stripHtml(raw.desc) : "",
  };
}

export async function getSubcategoryBySlug(
  slug: string,
  locale?: string
): Promise<AnyObj | null> {
  const l = normalizeLocale(locale);
  const response = await apiGet<any>(withLocale(`/sub-category/${slug}`, l), {
    next: { revalidate: 3600, tags: [`subcategory:${slug}`] },
  });
  const data = pickData(response);
  const raw = data?.sub_category ?? data?.subcategory ?? data;
  if (!raw || typeof raw !== "object") return null;

  return {
    ...raw,
    plainDesc: raw.desc ? stripHtml(raw.desc) : "",
  };
}

export async function getToursBySubcategory(
  slug: string,
  locale?: string
): Promise<ApiTourListItem[]> {
  const l = normalizeLocale(locale);
  const response = await apiGet<any>(withLocale(`/sub-category/${slug}`, l), {
    next: { revalidate: 3600, tags: [`subcategory:${slug}`, "tours"] },
  });
  const data = pickData(response);
  const raw = data?.sub_category ?? data?.subcategory ?? data;
  const rawTours = asArray(raw?.tours ?? data?.tours ?? data?.items);
  return rawTours.map((item) => mapTour(item, item?.slug ?? ""));
}

export async function getTourBySlug(
  slug: string,
  locale?: string
): Promise<ApiTourDetails | null> {
  const l = normalizeLocale(locale);
  const response = await apiGet<any>(withLocale(`/tour/${slug}`, l), {
    next: { revalidate: 3600, tags: [`tour:${slug}`] },
  });
  const data = pickData(response);
  const raw = data?.tour ?? data;
  if (!raw || typeof raw !== "object") return null;

  const highlights = pickStringArray(
    raw.highlights ?? raw.tour_highlights ?? raw.key_highlights
  );

  const included = pickHtmlList(
    raw.included ?? raw.includes ?? raw.inclusions ?? raw.inclusion
  );
  const excluded = pickHtmlList(
    raw.excluded ?? raw.excludes ?? raw.exclusions ?? raw.exclusion
  );

  const itineraryRaw = asArray(
    raw.itinerary ?? raw.plan ?? raw.days ?? raw.program
  );
  const itinerary = itineraryRaw
    .map((day, index) => ({
      day: Number(day?.day ?? day?.day_number ?? index + 1),
      title: day?.title ?? day?.name ?? day?.day ?? "",
      description: stripHtml(
        day?.desc ?? day?.description ?? day?.content ?? day?.text ?? ""
      ),
    }))
    .filter((day) => day.title || day.description);

  // ── FIX #4: Gallery images ────────────────────────────────────────────────
  // The real API returns `gallery` as an array of objects:
  //   { id, type, image, title, alt }
  // Previously the code looked for raw.images / raw.gallery as plain string[].
  // Now we correctly map raw.gallery[].image → string URLs.
  // Fallback chain: gallery → images → media.images → [media.image]
  const galleryRaw = asArray(raw.gallery ?? raw.images ?? raw.media?.images);
  const images: string[] = galleryRaw
    .map((img) => {
      if (typeof img === "string") return img;
      // gallery objects from real API: { image, url, src }
      if (img && typeof img === "object") {
        return (img as AnyObj).image ?? (img as AnyObj).url ?? (img as AnyObj).src ?? "";
      }
      return "";
    })
    .filter(Boolean);

  // Final fallback: if gallery is empty, use the tour cover image
  const finalImages =
    images.length > 0
      ? images
      : [raw.media?.image ?? raw.image].filter(Boolean) as string[];

  const pricing = asArray(raw.pricing ?? raw.price_table ?? raw.prices)
    .map((row) => ({
      category: row?.category ?? row?.name ?? "",
      price: parsePrice(row?.price ?? row?.amount),
    }))
    .filter((row) => row.category || row.price);

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

  const relatedTours: ApiTourListItem[] = asArray(
    raw.related_tours ?? raw.relatedTours
  ).map((item) => mapTour(item, item?.slug ?? ""));

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
    ...mapTour(raw, slug),
    code: raw.code ?? undefined,
    description: raw.desc
      ? stripHtml(raw.desc)
      : raw.description ?? raw.short_description ?? "",
    highlights,
    itinerary,
    included,
    excluded,
    images: finalImages,  // ← fixed gallery
    pricing,
    pricingTables,
    relatedTours,
    relatedArticles,
  };
}
