export interface SiteSettings {
  site_name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  small_desc?: string;
  facebook?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  pinterest?: string | null;
  whatsapp?: string | null;
}

export async function fetchSiteSettings(locale = "en"): Promise<SiteSettings | null> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1").replace(/\/+$/, "");
  const res = await fetch(`${base}/get-settings?locale=${locale}`, { next: { revalidate: 3600, tags: ["settings"] } });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.[0] ?? null;
}

export function settingsToSocialItems(settings: SiteSettings | null) {
  if (!settings) return [];
  return [
    settings.facebook ? { icon: "fa-brands fa-facebook-f", url: settings.facebook, title: "Facebook" } : null,
    settings.instagram ? { icon: "fa-brands fa-instagram", url: settings.instagram, title: "Instagram" } : null,
    settings.twitter ? { icon: "fa-brands fa-x-twitter", url: settings.twitter, title: "Twitter" } : null,
    settings.youtube ? { icon: "fa-brands fa-youtube", url: settings.youtube, title: "YouTube" } : null,
    settings.linkedin ? { icon: "fa-brands fa-linkedin-in", url: settings.linkedin, title: "LinkedIn" } : null,
    settings.pinterest ? { icon: "fa-brands fa-pinterest", url: settings.pinterest, title: "Pinterest" } : null,
  ].filter(Boolean);
}
