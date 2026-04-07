import type { HomeApiResponse, HomeSections } from "./homeTypes";

/**
 * Fetches all home page sections from the API.
 *
 * Usage (Server Component):
 *   const data = await fetchHomeSections();
 *
 * The base URL is read from NEXT_PUBLIC_API_BASE_URL (e.g. http://127.0.0.1:8000/api/v1/).
 */
export async function fetchHomeSections(locale: string = "en"): Promise<HomeSections | null> {
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
    const res = await fetch(url, {
      cache: "no-store",
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
    console.error("[fetchHomeSections] Network / parse error:", err);
    return null;
  }
}
