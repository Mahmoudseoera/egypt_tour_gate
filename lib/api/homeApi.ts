import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from "@/lib/i18n/config";
import type { HomeApiResponse, HomeSections } from "./homeTypes";

/**
 * Fetches all home page sections from the API.
 * Uses Next.js data cache (revalidate every 5 minutes) and locale-aware requests.
 */
export async function fetchHomeSections(locale: string = DEFAULT_LOCALE): Promise<HomeSections | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    console.error(
      "[fetchHomeSections] NEXT_PUBLIC_API_BASE_URL is not set in .env.local"
    );
    return null;
  }

  const safeLocale: SupportedLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const url = `${normalizedBase}?locale=${safeLocale}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300, tags: [`home-${safeLocale}`] },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error(
        `[fetchHomeSections] API responded with status ${res.status} (${res.statusText})`
      );
      return null;
    }

    const json: HomeApiResponse = await res.json();

    if (!json.success || !json.data?.sections) {
      console.error("[fetchHomeSections] Unexpected API response shape", json);
      return null;
    }

    return json.data.sections;
  } catch (err) {
    console.error(`[fetchHomeSections] Network / parse error for locale=${safeLocale}:`, err);
    return null;
  }
}
