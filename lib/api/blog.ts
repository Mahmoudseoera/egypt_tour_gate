import { routing, type AppLocale } from '@/lib/i18n/routing';
import { cache } from 'react';
// ─── Raw API shapes ────────────────────────────────────────────────────────────
export interface BlogCategoryMediaItem {
  image: string;
  title: string;
  alt: string;
}

/**
 * Two different media shapes come back depending on which endpoint is called:
 *
 * Listing  (/get-article-categories):
 *   "media": { "image": "https://...", "title": "...", "alt": "..." }
 *
 * Detail   (/get-article-by-category/:slug):
 *   "media": { "image": { image, title, alt }, "cover": { image, title, alt } }
 *
 * We use `unknown` here and resolve the actual value safely at runtime
 * inside normaliseCategory().
 */
export interface BlogCategoryRaw {
  id: number;
  name: string;
  slug: string;
  seo: string;
  small_desc?: string; // listing endpoint
  desc?: string;       // detail endpoint
  media: {
    // string  → listing endpoint (flat)
    // object  → detail endpoint  (nested)
    image: string | BlogCategoryMediaItem;
    title?: string; // present only on listing (flat) shape
    alt?: string;   // present only on listing (flat) shape
    cover?: BlogCategoryMediaItem; // present only on detail shape
  };
}

export interface BlogArticleRaw {
  id: number;
  name: string;
  small_desc: string;
  author?: string;
  slug: string;
  date: string;
  media: {
    image: string;
    title: string;
    alt: string;
  };
  blog_category: {
    name: string;
    slug: string;
  };
}

// NEW: Interface for detailed article response from API
export interface BlogArticleDetailRaw {
  id: number;
  name: string;
  slug: string;
  seo: string;
  desc: string;
  author?: string;

  media: {
    image: blogDetailsMedia;
  };

  blog_category: {
    name: string;
    slug: string;
  };

  related_articles?: BlogArticleRaw[];
  related_tours?: RelatedTour[];
}
export interface blogDetailsMedia {
  image: string;
  title: string;
  alt: string;
}
export interface RelatedTour {
  id: number;
  name: string;
  slug: string;
  small_desc: string;
  price_after_discount: number;
  city: string;
  duration_type: string;
  duration: string;
  media: RelatedTourMedia;
  subCategory: RelatedTourSubCategory;
}

export interface RelatedTourMedia {
  image: string;
  title: string;
  alt: string;
}

export interface RelatedTourSubCategory {
  subCategorySlug: string;
  categorySlug: string;
}

export interface BlogCategoryWithArticles extends BlogCategoryRaw {
  articles: BlogArticleRaw[];
}

// ─── Normalised UI shapes ──────────────────────────────────────────────────────
export interface BlogCategory {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;       // thumbnail / card image
  imageAlt: string;
  coverImage: string;  // hero / cover image for the category page
  coverImageAlt: string;
  seo: string;
  icon?: React.ReactNode;
}

export interface BlogPost {
  id: number;
  slug: string;
  categorySlug: string;
  categoryTitle: string;
  title: string;
  excerpt: string;
  content: string; // Full HTML content
  image: string;
  imageAlt: string;
  date: string;
  publishedAt: string;
  author: { name: string };
  readTime: string;
  tags: string[];
  seo?: string; // Raw SEO meta for advanced parsing
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function normaliseCategory(raw: BlogCategoryRaw): BlogCategory {
  // desc is used on the detail endpoint; small_desc on the listing endpoint
  const rawDesc = raw.desc ?? raw.small_desc ?? '';

  /**
   * Listing endpoint → media.image is a plain string URL:
   *   { image: "https://...", title: "...", alt: "..." }
   *
   * Detail endpoint → media.image is a nested object:
   *   { image: { image: "https://...", title: "...", alt: "..." }, cover: { ... } }
   */
  const isNested = typeof raw.media.image === 'object' && raw.media.image !== null;

  const image       = isNested
    ? (raw.media.image as BlogCategoryMediaItem).image
    : (raw.media.image as string);

  const imageAlt    = isNested
    ? (raw.media.image as BlogCategoryMediaItem).alt
    : (raw.media.alt ?? '');

  // cover is only present on the detail endpoint's nested shape
  const coverImage    = raw.media.cover?.image    ?? image;
  const coverImageAlt = raw.media.cover?.alt      ?? imageAlt;

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.name,
    description: rawDesc ? stripHtml(rawDesc) : '',
    image,
    imageAlt,
    coverImage,
    coverImageAlt,
    seo: raw.seo,
  };
}

function parseDateString(dateStr: string): string {
  try {
    const parsed = new Date(`${dateStr} ${new Date().getFullYear()}`);
    if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
  } catch {}
  return new Date().toISOString().split('T')[0];
}

function normalisePost(raw: BlogArticleRaw): BlogPost {
  return {
    id: raw.id,
    slug: raw.slug,
    categorySlug: raw.blog_category.slug,
    categoryTitle: raw.blog_category.name,
    title: raw.name,
    excerpt: raw.small_desc,
    content: raw.small_desc,
    image: raw.media.image,
    imageAlt: raw.media.alt,
    date: raw.date,
    publishedAt: parseDateString(raw.date),
    author: {
      name: raw.author || 'Egypt Tours Gate',
    },
    readTime: '5 min read',
    tags: [],
  };
}

// NEW: Normalise detailed article with SEO parsing
function normalisePostDetail(raw: BlogArticleDetailRaw): BlogPost {
  // Extract title from SEO <title> tag
  const seoTitleMatch = raw.seo?.match(/<title>([^<]*)<\/title>/i);
  const title = seoTitleMatch ? seoTitleMatch[1].trim() : raw.name;
  
  // Extract meta description from SEO
  const seoDescMatch = raw.seo?.match(/<meta name="description" content="([^"]*)"/i);
  const excerpt = seoDescMatch ? seoDescMatch[1].trim() : stripHtml(raw.desc);
  
  // Parse published date from JSON-LD schema if available
  let publishedAt = new Date().toISOString().split('T')[0];
  const jsonLdMatch = raw.seo?.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonLdMatch) {
    try {
      const jsonLd = JSON.parse(jsonLdMatch[1]);
      if (jsonLd.datePublished) publishedAt = jsonLd.datePublished;
    } catch {}
  }

  return {
    id: raw.id,
    slug: raw.slug,
    categorySlug: raw.blog_category.slug,
    categoryTitle: raw.blog_category.name,
    title: title,
    excerpt: excerpt,
    content: raw.desc, // Full HTML content for article body
    image: raw.media.image.image,
    imageAlt: raw.media.image.alt,
    date: raw.media.image.title,
    publishedAt: publishedAt,
    author: {
      name: raw.author || 'Egypt Tours Gate',
    },
    readTime: '5 min read',
    tags: [],
    seo: raw.seo,
  };
}

// ─── API Configuration ───────────────────────────────────────────────────────
const API_BASE = 'https://www.egypttoursgate.com/api/v1/articles';

function normalizeLocale(locale?: string): AppLocale {
  const nextLocale = (locale ?? routing.defaultLocale) as AppLocale;
  return routing.locales.includes(nextLocale) ? nextLocale : routing.defaultLocale;
}

function withLocale(url: string, locale?: string): string {
  const l = normalizeLocale(locale);
  if (l === routing.defaultLocale) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}locale=${encodeURIComponent(l)}`;
}

// ─── Fetch all categories + page header ───────────────────────────────────────
export interface BlogPageData {
  subTitle: string;
  title: string;
  seo: string;
  description: string;
  cover: string;
  categories: BlogCategory[];
}

export const getBlogPageData = cache(
  async (locale?: string): Promise<BlogPageData> => {
    const res = await fetch(
      withLocale(`${API_BASE}/get-article-categories`, locale),
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch blog categories: ${res.status}`);
    }

    const json = await res.json();

    if (!json.success) {
      throw new Error('get-article-categories returned success: false');
    }

    const d = json.data;

    return {
      subTitle: d.blog_sub_title ?? '',
      title: d.blog_title ?? '',
      seo: d.seo ?? '',
      cover: d.cover ?? '',
      description: d.blog_desc ?? '',
      categories: (d.blog_categories as BlogCategoryRaw[]).map(
        normaliseCategory
      ),
    };
  }
);

// ─── Fetch single category + its articles ─────────────────────────────────────
export interface CategoryPageData {
  category: BlogCategory;
  posts: BlogPost[];
}

export interface categoryData {
  name: string;
  slug: string;
  seo: string;
  desc: string;
  media: {
    image: categoryDataMedia;
    cover: categoryDataMedia;
  };
}

export interface categoryDataMedia {
  image: string;
  title: string;
  alt: string;
}

export const getCategoryPageData = cache(
  async (
    slug: string,
    locale?: string
  ): Promise<CategoryPageData | null> => {
    const res = await fetch(
      withLocale(`${API_BASE}/get-article-by-category/${slug}`, locale),
      {
        next: { revalidate: 3600 },
      }
    );

    if (res.status === 404) return null;

    if (!res.ok) {
      throw new Error(`Failed to fetch category "${slug}": ${res.status}`);
    }

    const json = await res.json();

    if (!json.success) return null;

    const raw: BlogCategoryWithArticles = json.data.articles;

    return {
      category: normaliseCategory(raw),
      posts: (raw.articles ?? []).map(normalisePost),
    };
  }
);

// ─── NEW: Fetch single article details by slug ────────────────────────────────
export interface ArticleDetailData {
  post: BlogPost;
  relatedPosts: BlogPost[];
  related_tours?: RelatedTour[];
}

export const getArticleDetailBySlug = cache(
  async (
    slug: string,
    locale?: string
  ): Promise<ArticleDetailData | null> => {
    const res = await fetch(
      withLocale(`${API_BASE}/get-ditals-article/${slug}`, locale),
      {
        next: { revalidate: 3600 },
      }
    );

    if (res.status === 404) return null;

    if (!res.ok) {
      throw new Error(`Failed to fetch article "${slug}": ${res.status}`);
    }

    const json = await res.json();

    if (!json.success) return null;

    const raw: BlogArticleDetailRaw = json.data;

    return {
      post: normalisePostDetail(raw),
      relatedPosts: (raw.related_articles ?? []).map(normalisePost),
      related_tours: raw.related_tours,
    };
  }
);
// ─── Helper: Get category by slug (for breadcrumbs) ──────────────────────────
export async function getCategoryBySlug(slug: string, locale?: string): Promise<BlogCategory | null> {
  const res = await fetch(withLocale(`${API_BASE}/get-article-by-category/${slug}`, locale), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.success) return null;
  
  const raw: BlogCategoryWithArticles = json.data.articles;
  return normaliseCategory(raw);
}

// ─── Helper: Get all categories for sidebar ──────────────────────────────────
export async function getAllBlogCategories(locale?: string): Promise<BlogCategory[]> {
  const res = await fetch(withLocale(`${API_BASE}/get-article-categories`, locale), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  if (!json.success) return [];
  
  const d = json.data;
  return (d.blog_categories as BlogCategoryRaw[]).map(normaliseCategory);
}
