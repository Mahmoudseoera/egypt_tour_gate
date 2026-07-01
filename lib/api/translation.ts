// lib/api/translation.ts
//
// Backend shape (nested by page/section):
// {
//   common:    { home, about, contact, blog, ... },
//   home:      { section_one_popular, why_choose_box_1_title, ... },
//   sub:       { sub_categories_title, ... },
//   view_tour: { tour_details, itinerary, ... },
//   blog:      { blog_title, blog_desc, ... },
//   questions: { questions, faq_desc, ... },
//   about:     { about_title, about_content, ... },
//   tailormade:{ tailormade_name, ... },
//   contact:   { contact_title, ... },
//   favourites:{ favourites_cover_img, ... }
// }
//
// We keep this exact group structure as next-intl NAMESPACES, instead of
// flattening everything into one object. That means in components you call:
//   useTranslations("home")   → t("section_one_popular")
//   useTranslations("contact") → t("contact_title")
//   useTranslations("common")  → t("read_more")
// instead of one giant flat lookup. Each page only deals with its own group.

export type TranslationGroup = Record<string, string>;
export type TranslationMessages = Record<string, TranslationGroup>;

export type RawTranslationGroups = Record<string, Record<string, string | null>>;

export interface TranslationEditorResponse {
  success: boolean;
  data: RawTranslationGroups;
  message: string;
  status: number;
}

/**
 * Keeps the backend's group structure intact (common/home/contact/etc.)
 * but strips null values within each group — next-intl requires every
 * message value to be a non-null string.
 */
function toMessages(json: TranslationEditorResponse | null): TranslationMessages {
  if (!json?.success || !json.data || typeof json.data !== "object") return {};

  const messages: TranslationMessages = {};

  for (const [groupName, group] of Object.entries(json.data)) {
    if (!group || typeof group !== "object") continue;

    const cleanGroup: TranslationGroup = {};
    for (const [key, value] of Object.entries(group)) {
      if (typeof value === "string") {
        cleanGroup[key] = value;
      }
    }
    messages[groupName] = cleanGroup;
  }

  return messages;
}

export async function fetchTranslationEditor(
  locale = "en",
  options?: RequestInit
): Promise<TranslationEditorResponse | null> {
  const base = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.egypttoursgate.com/api/v1"
  ).replace(/\/+$/, "");

  try {
    const res = await fetch(`${base}/get-translation-editor?locale=${locale}`, {
      // IMPORTANT: do NOT use cache: "no-store" here.
      //
      // This helper is called from i18n/request.ts -> getTranslations()/getT(),
      // which runs inside EVERY server component, including ones that use
      // generateStaticParams + `export const revalidate = N` (ISR/static pages,
      // e.g. app/[locale]/blogs/[subCategorySlug]/page.tsx).
      //
      // "no-store" == revalidate: 0, which tells Next.js "this fetch must be
      // dynamic, always". When that happens inside a route Next.js already
      // decided was static at build time (because of generateStaticParams),
      // you get:
      //   "Error: Page changed from static to dynamic at runtime ...
      //    reason: revalidate: 0"
      // which surfaces to the user as an Internal Server Error.
      //
      // Using `next: { revalidate, tags }` instead keeps this fetch
      // ISR-compatible — Next.js can prerender the page AND revalidate the
      // translation data on the same schedule, with no static/dynamic
      // conflict. Callers that genuinely need always-fresh data (e.g. a
      // dedicated /api/revalidate webhook) can still override via `options`.
      next: { revalidate: 3600, tags: ["translation", `translation:${locale}`] },
      ...options,
    });
    if (!res.ok) return null;
    return (await res.json()) as TranslationEditorResponse;
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