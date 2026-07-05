// lib/api/settingsApi.ts
// Matches: GET https://www.egypttoursgate.com/api/v1/get-settings?locale=en
//
// Real API response shape:
// {
//   "success": true,
//   "data": [ { ...SiteSettings fields... } ],
//   "message": "...",
//   "status": 200
// }

import { REVALIDATE, CACHE_TAGS } from "@/lib/cache/tags";

export interface SiteSettings {
  id?: number;
  language_id?: string;
  site_name?: string;
  // Header logo
  logo?: string;
  logo_alt?: string;
  logo_title?: string;
  // Footer logo (separate field in real API)
  footer_logo?: string;
  footer_logo_alt?: string;
  footer_logo_title?: string;
  // Contact
  email?: string;
  reservation_form_email?: string;
  contact_form_email?: string;
  tailormade_form_email?: string;
  phone?: string;
  mobile?: string;
  fax?: string | null;
  address?: string;
  // Meta
  small_desc?: string;
  // Media
  video?: string | null;
  video_thumb?: string | null;
  // Social
  gmail?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  pinterest?: string | null;
  snapchat?: string | null;
  trip_advisor?: string | null;
  whatsapp?: string | null;
}

export interface SiteSettingsApiResponse {
  success: boolean;
  data: SiteSettings[];
  message?: string;
  status?: number;
}

/**
 * Server-side fetch — call from a Next.js Server Component or route handler.
 * Goes through the same-origin proxy to avoid CORS: /api/settings → external API.
 */
export async function fetchSiteSettings(locale = "en"): Promise<SiteSettings | null> {
  const base = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1"
  ).replace(/\/+$/, "");

  try {
const res = await fetch(`${base}/get-settings?locale=${locale}`, {
  next: { revalidate: REVALIDATE.STANDARD, tags: [CACHE_TAGS.settings] },
});
    if (!res.ok) return null;
    const json: SiteSettingsApiResponse = await res.json();
    return json?.data?.[0] ?? null;
  } catch (error) {
    console.error("Failed to fetch site settings", error);
    return null;
  }
}
// ─── Social helpers ────────────────────────────────────────────────────────────

export interface SocialItem {
  icon: string;
  url: string;
  title: string;
}

/**
 * Convert SiteSettings → array of social items for SimpleSocialIcon.
 * Only includes platforms that have a non-null, non-empty URL.
 * TripAdvisor is included as a custom icon (font-awesome doesn't have it in free tier,
 * so we use fa-brands fa-tripadvisor which IS available in FA 6+).
 */
export function settingsToSocialItems(settings: SiteSettings | null): SocialItem[] {
  if (!settings) return [];

  const candidates: Array<{ icon: string; url: string | null | undefined; title: string }> = [
    { icon: "fa-brands fa-facebook-f",   url: settings.facebook,    title: "Facebook"    },
    { icon: "fa-brands fa-instagram",     url: settings.instagram,   title: "Instagram"   },
    { icon: "fa-brands fa-x-twitter",     url: settings.twitter,     title: "Twitter"     },
    { icon: "fa-brands fa-youtube",       url: settings.youtube,     title: "YouTube"     },
    { icon: "fa-brands fa-linkedin-in",   url: settings.linkedin,    title: "LinkedIn"    },
    { icon: "fa-brands fa-pinterest",     url: settings.pinterest,   title: "Pinterest"   },
    { icon: "fa-brands fa-snapchat",      url: settings.snapchat,    title: "Snapchat"    },
    { icon: "fa-brands fa-tripadvisor",   url: settings.trip_advisor, title: "TripAdvisor" },
    { icon: "fa-brands fa-whatsapp",      url: settings.whatsapp,    title: "WhatsApp"    },
  ];

  return candidates
    .filter((c): c is SocialItem => typeof c.url === "string" && c.url.trim().length > 0)
    .map((c) => ({ icon: c.icon, url: c.url, title: c.title }));
}

/**
 * Resolve the header logo URL.
 * The real API returns just the filename (e.g. "logo.png") —
 * prepend the storage base URL if it is not already absolute.
 */
export function resolveLogoUrl(
  filename: string | null | undefined,
  storageBase = "https://www.egypttoursgate.com/storage/"
): string {
  if (!filename) return "/assets/images/egypt-tour-gate-logo.png";
  if (filename.startsWith("http://") || filename.startsWith("https://") || filename.startsWith("/")) {
    return filename;
  }
  return `${storageBase}${filename}`;
}
