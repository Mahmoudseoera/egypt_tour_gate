// lib/api/aboutApi.ts
// Fetches data from: GET /api/v1/about-us?locale=en
// ⚠️  No dependency on homeApi or homeTypes — completely standalone.

import type { AboutApiResponse, AboutPageSections } from "./aboutTypes";
import { REVALIDATE, CACHE_TAGS } from "@/lib/cache/tags";

/**
 * Server-side fetcher for the About page.
 *
 * Usage (Server Component):
 *   const sections = await fetchAboutSections(locale);
 */
export async function fetchAboutSections(
  locale: string = "en"
): Promise<AboutPageSections | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_ABOUT;

  // Fallback: derive from the general base URL if the about-specific var isn't set
  const rawBase =
    baseUrl ??
    (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(
      /\/home\/?$/,
      "/about-us"
    );

  if (!rawBase) {
    console.error(
      "[fetchAboutSections] No API base URL found. " +
        "Set NEXT_PUBLIC_API_BASE_URL_ABOUT (e.g. https://www.egypttoursgate.com/api/v1/about-us)"
    );
    return null;
  }

  // Strip trailing slashes then append locale query param
  const url = `${rawBase.replace(/\/+$/, "")}?locale=${locale}`;

  try {
    const res = await fetch(url, {
      // ISR: revalidate every hour; tag so you can purge on-demand
       next: { revalidate: REVALIDATE.STANDARD, tags: [CACHE_TAGS.about, CACHE_TAGS.pages] },

    });

    if (!res.ok) {
      console.error(
        `[fetchAboutSections] API responded ${res.status} ${res.statusText} — url: ${url}`
      );
      return null;
    }

    const json: AboutApiResponse = await res.json();

    if (!json.success || !json.data?.sections) {
      console.error("[fetchAboutSections] Unexpected response shape:", json);
      return null;
    }

    return json.data.sections;
  } catch (err) {
    console.error("[fetchAboutSections] Network / parse error:", err);
    return null;
  }
}
