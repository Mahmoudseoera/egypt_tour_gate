import type { HomeApiResponse, HomeSections, PageSeoScripts } from "./homeTypes";
import { cache } from "react";
import { REVALIDATE, CACHE_TAGS } from "@/lib/cache/tags";

async function fetchHomeSectionsFn(locale: string = "en"): Promise<HomeSections | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) return null;

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const url = `${normalizedBase}?locale=${locale}`;

  try {
    let res: Response | null = null;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      res = await fetch(url, { next: {
    revalidate: REVALIDATE.FAST, // homepage sections change often — keep 300s
    tags: [CACHE_TAGS.homepage, CACHE_TAGS.tours, CACHE_TAGS.blog],
  }, });
      if (res.status !== 429 || attempt === 3) break;
      await new Promise((resolve) => setTimeout(resolve, attempt * 600));
    }
    if (!res?.ok) return null;
    const json: HomeApiResponse = await res.json();
    return json.success ? (json.data?.sections ?? null) : null;
  } catch {
    return null;
  }
}

export const fetchHomeSections = cache(fetchHomeSectionsFn);

/**
 * Every static page's <title>/meta/OG markup is bundled inside this same
 * general sections payload, under sections.seo.<page>_page_scripts
 * (confirmed from the live API response — not a guess). We reuse the
 * already-cached fetchHomeSections() call rather than a second endpoint;
 * React's cache() dedupes this across every generateMetadata() call within
 * the same request, so calling it from multiple pages costs nothing extra.
 */
export async function getPageSeoHtml(
  locale: string,
  key: keyof PageSeoScripts
): Promise<string | null> {
  const sections = await fetchHomeSections(locale);
  return sections?.seo?.[key] ?? null;
}