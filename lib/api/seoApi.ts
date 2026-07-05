import { REVALIDATE, CACHE_TAGS, pageTag } from "@/lib/cache/tags";

function seoTagForEndpoint(endpoint: string): string {
  if (!endpoint) return CACHE_TAGS.homepage;                 // home page seo
  if (endpoint === "contact") return CACHE_TAGS.contact;     // contact page seo
  if (endpoint.includes("tailor-made")) return pageTag("tailor-made");
  return CACHE_TAGS.pages;
}


export async function fetchSeoHtmlFromEndpoint(endpoint: string, locale = "en"): Promise<string | null> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1").replace(/\/+$/, "");
  const url = `${base}/${endpoint}?locale=${locale}`;
  try {
const res = await fetch(url, {
      next: { revalidate: REVALIDATE.FAST, tags: [CACHE_TAGS.seo, seoTagForEndpoint(endpoint)] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (
      json?.data?.seo ||
      json?.data?.sections?.seo ||
      json?.data?.sections?.contact_section?.seo ||
      json?.data?.sections?.tailor_made_section?.seo ||
      null
    );
  } catch {
    return null;
  }
}
