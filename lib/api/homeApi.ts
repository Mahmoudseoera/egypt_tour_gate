import type { HomeApiResponse, HomeSections } from "./homeTypes";

type HomeCacheEntry = {
  expiresAt: number;
  data: HomeSections | null;
};

const HOME_CACHE_TTL_MS = 5 * 60 * 1000;
const homeCache = new Map<string, HomeCacheEntry>();
const inFlight = new Map<string, Promise<HomeSections | null>>();

/**
 * Fetches all home page sections from the API.
 *
 * Usage (Server Component):
 *   const data = await fetchHomeSections();
 *
 * The base URL is read from NEXT_PUBLIC_API_BASE_URL (e.g. http://127.0.0.1:8000/api/v1/).
 */
export async function fetchHomeSections(locale: string = "en"): Promise<HomeSections | null> {
  const now = Date.now();
  const cached = homeCache.get(locale);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const running = inFlight.get(locale);
  if (running) return running;

  const task = (async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    console.error(
      "[fetchHomeSections] NEXT_PUBLIC_API_BASE_URL is not set in .env.local"
    );
    return null;
  }

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const url = `${normalizedBase}?locale=${locale}`;

  try {
    let res: Response | null = null;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      res = await fetch(url, {
        next: { revalidate: 300, tags: [`home:${locale}`] },
      });
      if (res.status !== 429 || attempt === 3) break;
      await new Promise((resolve) => setTimeout(resolve, attempt * 600));
    }

    if (!res) return null;

    if (!res.ok) {
      console.error(
        `[fetchHomeSections] API responded with status ${res.status} (${res.statusText})`
      );
      if (cached) {
        return cached.data;
      }
      return null;
    }

    const json: HomeApiResponse = await res.json();

    if (!json.success || !json.data?.sections) {
      console.error("[fetchHomeSections] Unexpected API response shape", json);
      return null;
    }

    homeCache.set(locale, {
      data: json.data.sections,
      expiresAt: Date.now() + HOME_CACHE_TTL_MS,
    });
    return json.data.sections;
  } catch (err) {
    console.error("[fetchHomeSections] Network / parse error:", err);
    if (cached) {
      return cached.data;
    }
    return null;
  }
  })();

  inFlight.set(locale, task);
  try {
    return await task;
  } finally {
    inFlight.delete(locale);
  }
}
