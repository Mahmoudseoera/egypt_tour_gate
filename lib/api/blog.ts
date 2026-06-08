import { routing, type AppLocale } from '@/lib/i18n/routing';
import { normalizeMediaSet, type ApiMediaAsset } from '@/lib/api/media';

// ─── Raw API shapes ────────────────────────────────────────────────────────────
export interface BlogCategoryRaw {
  id: number;
  name: string;
  slug: string;
  seo: string;
  desc?: string;
  media: {
    image?: unknown;
    cover?: unknown;
    title?: unknown;
    alt?: unknown;
    url?: unknown;
    image_url?: unknown;
  };
}

export interface BlogArticleRaw {
  id: number;
  name: string;
  small_desc: string;
  slug: string;
  date: string;
  media: {
    image?: unknown;
    cover?: unknown;
    title?: unknown;
    alt?: unknown;
    url?: unknown;
    image_url?: unknown;
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
  desc: string; // Full HTML content
  media: {
    image?: unknown;
    cover?: unknown;
    title?: unknown;
    alt?: unknown;
    url?: unknown;
    image_url?: unknown;
  };
  blog_category: {
    name: string;
    slug: string;
  };
  related_articles?: BlogArticleRaw[];
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
  image: string;
  imageAlt: string;
  cover?: ApiMediaAsset;
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
  cover?: ApiMediaAsset;
  date: string;
  publishedAt: string;
  author: { name: string };
  readTime: string;
  tags: string[];
  seo?: string; // Raw SEO meta for advanced parsing
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function stripHtml(html?: string | null): string {
  return (html ?? '').replace(/<[^>]*>/g, '').trim();
}

function normaliseCategory(raw: BlogCategoryRaw): BlogCategory {
  const media = normalizeMediaSet(raw.media);
  const image = media?.image ?? media?.cover;

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.name,
    description: raw.desc ? stripHtml(raw.desc) : '',
    image: image?.image ?? '',
    imageAlt: image?.alt ?? raw.name,
    cover: media?.cover,
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
  const media = normalizeMediaSet(raw.media);
  const image = media?.image ?? media?.cover;

  return {
    id: raw.id,
    slug: raw.slug,
    categorySlug: raw.blog_category.slug,
    categoryTitle: raw.blog_category.name,
    title: raw.name,
    excerpt: raw.small_desc,
    content: raw.small_desc,
    image: image?.image ?? '',
    imageAlt: image?.alt ?? raw.name,
    cover: media?.cover,
    date: raw.date,
    publishedAt: parseDateString(raw.date),
    author: { name: 'Egypt Tours Gate' },
    readTime: '5 min read',
    tags: [],
  };
}

// NEW: Normalise detailed article with SEO parsing
function normalisePostDetail(raw: BlogArticleDetailRaw): BlogPost {
  const media = normalizeMediaSet(raw.media);
  const image = media?.image ?? media?.cover;

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
    image: image?.image ?? '',
    imageAlt: image?.alt ?? raw.name,
    cover: media?.cover,
    date: image?.title ?? '',
    publishedAt: publishedAt,
    author: { name: 'Egypt Tours Gate' }, // Default - API doesn't provide author
    readTime: '5 min read', // Default - API doesn't provide read time
    tags: [], // Default - API doesn't provide tags
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
  description: string;
  categories: BlogCategory[];
}

export async function getBlogPageData(locale?: string): Promise<BlogPageData> {
  const res = await fetch(withLocale(`${API_BASE}/get-article-categories`, locale), {
    next: { revalidate: 300, tags: ["blogs", "blog-categories"] },
  });
  if (!res.ok) throw new Error(`Failed to fetch blog categories: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error('get-article-categories returned success: false');
  
  const d = json.data;
  return {
    subTitle: d.blog_sub_title ?? '',
    title: d.blog_title ?? '',
    description: d.blog_desc ?? '',
    categories: (d.blog_categories as BlogCategoryRaw[]).map(normaliseCategory),
  };
}

// ─── Fetch single category + its articles ─────────────────────────────────────
export interface CategoryPageData {
  category: BlogCategory;
  posts: BlogPost[];
}

export async function getCategoryPageData(slug: string, locale?: string): Promise<CategoryPageData | null> {
  const res = await fetch(withLocale(`${API_BASE}/get-article-by-category/${slug}`, locale), {
    next: { revalidate: 300, tags: [`blog-category:${slug}`, "blogs", "blog-categories"] },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch category "${slug}": ${res.status}`);
  
  const json = await res.json();
  if (!json.success) return null;
  
  const raw: BlogCategoryWithArticles = json.data.articles;
  return {
    category: normaliseCategory(raw),
    posts: (raw.articles ?? []).map(normalisePost),
  };
}

// ─── NEW: Fetch single article details by slug ────────────────────────────────
export interface ArticleDetailData {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export async function getArticleDetailBySlug(slug: string, locale?: string): Promise<ArticleDetailData | null> {
  const res = await fetch(withLocale(`${API_BASE}/get-ditals-article/${slug}`, locale), {
    next: { revalidate: 300, tags: [`blog:${slug}`, "blogs"] },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch article "${slug}": ${res.status}`);
  
  const json = await res.json();
  if (!json.success) return null;
  
  const raw: BlogArticleDetailRaw = json.data;
  
  return {
    post: normalisePostDetail(raw),
    relatedPosts: (raw.related_articles ?? []).map(normalisePost),
  };
}

// ─── Helper: Get category by slug (for breadcrumbs) ──────────────────────────
export async function getCategoryBySlug(slug: string, locale?: string): Promise<BlogCategory | null> {
  const res = await fetch(withLocale(`${API_BASE}/get-article-by-category/${slug}`, locale), {
    next: { revalidate: 300, tags: [`blog-category:${slug}`, "blogs", "blog-categories"] },
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
    next: { revalidate: 300, tags: ["blogs", "blog-categories"] },
  });
  if (!res.ok) return [];
  const json = await res.json();
  if (!json.success) return [];
  
  const d = json.data;
  return (d.blog_categories as BlogCategoryRaw[]).map(normaliseCategory);
}