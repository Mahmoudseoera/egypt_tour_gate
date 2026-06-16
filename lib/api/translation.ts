// lib/api/translation.ts
export type TranslationMessages = Record<string, string>;

export interface TranslationEditorResponse {
  success: boolean;
  data: Record<string, string | null>[];
  message: string;
  status: number;
}

/**
 * Merge all objects from data[] and drop any key whose value is null/undefined.
 * next-intl requires every message value to be a non-null string.
 */
function toMessages(json: TranslationEditorResponse | null): TranslationMessages {
  if (!json?.success) return {};
  if (!Array.isArray(json.data) || json.data.length === 0) return {};

  const merged = Object.assign({}, ...json.data) as Record<string, string | null>;

  const clean: TranslationMessages = {};
  for (const [k, v] of Object.entries(merged)) {
    if (typeof v === "string") clean[k] = v;
  }
  return clean;
}

export async function fetchTranslationEditor(
  locale = "en"
): Promise<TranslationEditorResponse | null> {
  const base = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1"
  ).replace(/\/+$/, "");

  try {
    const url = `${base}/get-translation-editor?locale=${locale}`;
    const res = await fetch(url, {
      // Use no-store so each locale always gets its own fresh response.
      // next-intl calls this from request.ts per-request anyway, so there
      // is no value in caching here — caching caused the locale-switch bug
      // where the cached `en` response was returned for `de`/`fr`/`pl`.
      next: { revalidate: 3600, tags: ["translation"] },
      headers: {
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as TranslationEditorResponse;

    if (process.env.NODE_ENV !== "production") {
      // Keep logs small: we just want to verify backend returns localized values.
      const inquire = Array.isArray(json.data) && json.data[0] ? json.data[0].inquire : undefined;
      const home = Array.isArray(json.data) && json.data[0] ? json.data[0].home : undefined;
      console.log(`[i18n] translation fetched`, { locale, url, success: json.success, home, inquire });
    }

    return json;
  } catch {
    return null;
  }
}

export async function fetchTranslationMessages(
  locale = "en"
): Promise<TranslationMessages> {
  const json = await fetchTranslationEditor(locale);
  return toMessages(json);
}