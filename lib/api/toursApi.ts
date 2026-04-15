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
}

export interface ApiTourDetails extends ApiTourListItem {
  description?: string;
  highlights?: string[];
  itinerary?: Array<{ day?: number; title: string; description: string }>;
  included?: string[];
  excluded?: string[];
  images?: string[];
  pricing?: Array<{ category: string; price: number }>;
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

  // Combine duration + duration_type if both are present (e.g. "9 Day")
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
    // real API uses small_desc — added as first candidate
    short_description:
      item.small_desc ??
      item.short_description ??
      item.summary ??
      item.description ??
      "",
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

export async function getGeneralCategories(locale?: string): Promise<AnyObj[]> {
  const l = normalizeLocale(locale);
  const response = await apiGet<any>(withLocale("/general-data", l), {
    next: { revalidate: 3600, tags: ["general"] },
  });
  const data = pickData(response);
  return asArray(data?.header?.categories ?? data?.header?.headerCategories);
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
  const response = await apiGet<any>(withLocale(`/categories/${slug}`, l), {
    next: { revalidate: 3600, tags: [`category:${slug}`] },
  });
  const data = pickData(response);

  // Normalize: expose `subs` so the page can use a single field name,
  // and expose plain `desc` / `second_title` for the description.
  const raw = data?.category ?? data;
  if (!raw || typeof raw !== "object") return null;

  return {
    ...raw,
    // Unify subcategory field — real API returns `subCategories`
    subs: asArray(raw.subs ?? raw.subCategories ?? raw.sub_categories),
    // Plain-text description stripped of HTML
    plainDesc: raw.desc ? stripHtml(raw.desc) : "",
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
  const response = await apiGet<any>(withLocale(`/sub-category/${slug}`, l), {
    next: { revalidate: 3600, tags: [`subcategory:${slug}`] },
  });
  const data = pickData(response);
  // real API: data IS the subcategory object directly (id, name, slug, desc, tours…)
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
  const response = await apiGet<any>(withLocale(`/tour/${slug}`, l), {
    next: { revalidate: 3600, tags: [`tour:${slug}`] },
  });
  const data = pickData(response);
  const raw = data?.tour ?? data;
  if (!raw || typeof raw !== "object") return null;

  const highlights = pickStringArray(
    raw.highlights ?? raw.tour_highlights ?? raw.key_highlights
  );
  const included = pickStringArray(
    raw.included ?? raw.includes ?? raw.inclusions
  );
  const excluded = pickStringArray(
    raw.excluded ?? raw.excludes ?? raw.exclusions
  );

  const itineraryRaw = asArray(
    raw.itinerary ?? raw.plan ?? raw.days ?? raw.program
  );
  const itinerary = itineraryRaw
    .map((day, index) => ({
      day: Number(day?.day ?? day?.day_number ?? index + 1),
      title: day?.title ?? day?.name ?? day?.day ?? "",
      description: day?.description ?? day?.content ?? day?.text ?? "",
    }))
    .filter((day) => day.title || day.description);

  const images = asArray(raw.images ?? raw.gallery ?? raw.media?.images)
    .map((img) =>
      typeof img === "string" ? img : img?.image ?? img?.url ?? ""
    )
    .filter(Boolean);

  const pricing = asArray(raw.pricing ?? raw.price_table ?? raw.prices)
    .map((row) => ({
      category: row?.category ?? row?.name ?? "",
      price: parsePrice(row?.price ?? row?.amount),
    }))
    .filter((row) => row.category || row.price);

  return {
    ...mapTour(raw, slug),
    description: raw.desc
      ? stripHtml(raw.desc)
      : raw.description ?? raw.short_description ?? "",
    highlights,
    itinerary,
    included,
    excluded,
    images,
    pricing,
  };
}
