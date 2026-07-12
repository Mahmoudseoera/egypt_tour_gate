import { REVALIDATE, CACHE_TAGS, pageTag } from "@/lib/cache/tags";
import type { ApiSeo } from "@/lib/seo";

function seoTagForEndpoint(endpoint: string): string {
  if (!endpoint) return CACHE_TAGS.homepage;                 // home page seo
  if (endpoint === "contact") return CACHE_TAGS.contact;     // contact page seo
  if (endpoint.includes("tailor-made")) return pageTag("tailor-made");
  return CACHE_TAGS.pages;
}


export async function fetchSeoFromEndpoint(endpoint: string, locale = "en"): Promise<ApiSeo | null> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1").replace(/\/+$/, "");
  const url = `${base}/${endpoint}?locale=${locale}`;
  try {
const res = await fetch(url, {
      next: { revalidate: REVALIDATE.FAST, tags: [CACHE_TAGS.seo, seoTagForEndpoint(endpoint)] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const seo = json?.data?.seo;
    if (!seo || typeof seo !== "object" || Array.isArray(seo)) return null;

    return {
      title: typeof seo.title === "string" ? seo.title : null,
      description: typeof seo.description === "string" ? seo.description : null,
      keywords: typeof seo.keywords === "string" || Array.isArray(seo.keywords) ? seo.keywords : null,
    };
  } catch {
    return null;
  }
}
