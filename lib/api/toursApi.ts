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
  return {
    id: Number(item.id ?? 0),
    slug: item.slug ?? fallbackSlug,
    title: item.title ?? item.name ?? "",
    image: item.image ?? item.media?.image ?? "",
    price_from: parsePrice(item.price_from ?? item.price ?? item.start_from),
    rating: Number(item.rating ?? 0),
    duration: item.duration ?? "",
    location: item.location ?? item.city ?? item.sub_category_name ?? "",
    short_description: item.short_description ?? item.summary ?? item.description ?? "",
  };
}

export async function getGeneralCategories(locale?: string): Promise<AnyObj[]> {
  const l = normalizeLocale(locale);
  const response = await apiGet<any>(withLocale("/general-data", l), {
    next: { revalidate: 3600, tags: ["general"] },
  });
  const data = pickData(response);
  return asArray(data?.header?.categories ?? data?.header?.headerCategories);
}

export async function getCategoryBySlug(slug: string, locale?: string): Promise<AnyObj | null> {
  const l = normalizeLocale(locale);
  const response = await apiGet<any>(withLocale(`/categories/${slug}`, l), {
    next: { revalidate: 3600, tags: [`category:${slug}`] },
  });
  const data = pickData(response);
  return data?.category ?? data;
}

export async function getSubcategoryBySlug(slug: string, locale?: string): Promise<AnyObj | null> {
  const l = normalizeLocale(locale);
  const response = await apiGet<any>(withLocale(`/sub-category/${slug}`, l), {
    next: { revalidate: 3600, tags: [`subcategory:${slug}`] },
  });
  const data = pickData(response);
  return data?.sub_category ?? data?.subcategory ?? data;
}

export async function getToursBySubcategory(slug: string, locale?: string): Promise<ApiTourListItem[]> {
  const l = normalizeLocale(locale);
  const response = await apiGet<any>(withLocale(`/sub-category/${slug}`, l), {
    next: { revalidate: 3600, tags: [`subcategory:${slug}`, "tours"] },
  });
  const data = pickData(response);
  const rawTours = asArray(
    data?.tours ?? data?.items ?? data?.sub_category?.tours ?? data?.subcategory?.tours
  );
  return rawTours.map((item) => mapTour(item, item?.slug ?? ""));
}

export async function getTourBySlug(slug: string, locale?: string): Promise<ApiTourDetails | null> {
  const l = normalizeLocale(locale);
  const response = await apiGet<any>(withLocale(`/tour/${slug}`, l), {
    next: { revalidate: 3600, tags: [`tour:${slug}`] },
  });
  const data = pickData(response);
  const raw = data?.tour ?? data;
  if (!raw || typeof raw !== "object") return null;
  return {
    ...mapTour(raw, slug),
    description: raw.description ?? raw.short_description ?? "",
  };
}
