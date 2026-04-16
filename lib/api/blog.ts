// ─── Raw API shapes ────────────────────────────────────────────────────────────
export interface BlogCategoryRaw {
  id: number;
  name: string;
  slug: string;
  seo: string;
  desc?: string;
  media: {
    image: string;
    title: string;
    alt: string;
  };
}

export interface BlogArticleRaw {
  id: number;
  name: string;
  small_desc: string;
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
  desc: string; // Full HTML content
  media: {
    image: string;
    title: string;
    alt: string;
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
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.name,
    description: raw.desc ? stripHtml(raw.desc) : '',
    image: raw.media.image,
    imageAlt: raw.media.alt,
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
    author: { name: 'Egypt Tours Gate' },
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
    image: raw.media.image,
    imageAlt: raw.media.alt,
    date: raw.media.title,
    publishedAt: publishedAt,
    author: { name: 'Egypt Tours Gate' }, // Default - API doesn't provide author
    readTime: '5 min read', // Default - API doesn't provide read time
    tags: [], // Default - API doesn't provide tags
    seo: raw.seo,
  };
}

// ─── API Configuration ───────────────────────────────────────────────────────
const API_BASE = 'https://www.egypttoursgate.com/api/v1/articles';

// ─── Fetch all categories + page header ───────────────────────────────────────
export interface BlogPageData {
  subTitle: string;
  title: string;
  description: string;
  categories: BlogCategory[];
}

export async function getBlogPageData(): Promise<BlogPageData> {
  const res = await fetch(`${API_BASE}/get-article-categories`, {
    next: { revalidate: 3600 },
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

export async function getCategoryPageData(slug: string): Promise<CategoryPageData | null> {
  const res = await fetch(`${API_BASE}/get-article-by-category/${slug}`, {
    next: { revalidate: 3600 },
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

export async function getArticleDetailBySlug(slug: string): Promise<ArticleDetailData | null> {
  const res = await fetch(`${API_BASE}/get-ditals-article/${slug}`, {
    next: { revalidate: 3600 },
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
export async function getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const res = await fetch(`${API_BASE}/get-article-by-category/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.success) return null;
  
  const raw: BlogCategoryWithArticles = json.data.articles;
  return normaliseCategory(raw);
}

// ─── Helper: Get all categories for sidebar ──────────────────────────────────
export async function getAllBlogCategories(): Promise<BlogCategory[]> {
  const res = await fetch(`${API_BASE}/get-article-categories`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  if (!json.success) return [];
  
  const d = json.data;
  return (d.blog_categories as BlogCategoryRaw[]).map(normaliseCategory);
}