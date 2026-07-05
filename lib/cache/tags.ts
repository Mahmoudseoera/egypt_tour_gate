// lib/cache/tags.ts
// Central registry for cache revalidate times + tag builders.
// Every fetch() in the app should import from here instead of
// hardcoding strings, so the dashboard-invalidation route and the
// data-fetching layer never drift apart.

export const REVALIDATE = {
  /** Content that changes frequently / is cheap to refetch (home, contact info, seo snippets) */
  FAST: 300,
  /** Typical CMS content (categories, tours, blog, settings, static pages) */
  STANDARD: 3600,
} as const;

export const CACHE_TAGS = {
  general: "general",
  header: "header",
  footer: "footer",
  settings: "settings",
  homepage: "homepage",
  categories: "categories",
  tours: "tours",
  blog: "blog",
  contact: "contact",
  pages: "pages",
  about: "about",
  seo: "seo",
  translation: "translation",
} as const;

export const categoryTag = (slug: string) => `category:${slug}`;
export const subcategoryTag = (slug: string) => `subcategory:${slug}`;
export const tourTag = (slug: string) => `tour:${slug}`;
export const blogCategoryTag = (slug: string) => `blog-category:${slug}`;
export const blogPostTag = (slug: string) => `blog-post:${slug}`;
export const pageTag = (slug: string) => `page:${slug}`;
export const translationTag = (locale: string) => `translation:${locale}`;

/** Every static tag — used only as the "purge everything" fallback. */
export const ALL_STATIC_TAGS: string[] = Object.values(CACHE_TAGS);