import type { HomeApiResponse, HomeSections } from "./homeTypes";
import { cache } from "react";

async function fetchHomeSectionsFn(locale: string = "en"): Promise<HomeSections | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) return null;

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const url = `${normalizedBase}?locale=${locale}`;

  try {
    let res: Response | null = null;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      res = await fetch(url, { next: { revalidate: 300, tags: ["home", "tours", "blogs"] } });
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
