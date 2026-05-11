import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/seo';

const API_BASE_URL = `${SITE_URL}/api/v1`;
const LAST_MODIFIED = '2023-05-23T08:54:03+00:00';

type AnyRecord = Record<string, any>;

type SitemapPath = {
  path: string;
  priority: string;
};

function normalizePath(path: string) {
  if (!path || path === '/') return '/';
  return `/${path.replace(/^\/+|\/+$/g, '')}`;
}

function absoluteUrl(path: string) {
  return `${SITE_URL}${normalizePath(path) === '/' ? '' : normalizePath(path)}`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function safeFetchJson<T = AnyRecord>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function unwrapData(payload: AnyRecord | null): AnyRecord {
  return payload?.data ?? payload ?? {};
}

function asArray(value: unknown): AnyRecord[] {
  return Array.isArray(value) ? value : [];
}

function addPath(paths: Map<string, SitemapPath>, path: string, priority = '0.80') {
  const normalized = normalizePath(path);
  if (!paths.has(normalized)) paths.set(normalized, { path: normalized, priority });
}

async function addTourUrls(paths: Map<string, SitemapPath>) {
  const generalPayload = await safeFetchJson('/general-data');
  const generalData = unwrapData(generalPayload);
  const categories = asArray(generalData?.header?.categories ?? generalData?.header?.headerCategories);

  for (const category of categories) {
    if (!category?.slug) continue;
    addPath(paths, `/${category.slug}`, '0.80');

    const subcategories = asArray(category.subs ?? category.subCategories ?? category.sub_categories);
    for (const subcategory of subcategories) {
      if (!subcategory?.slug) continue;
      addPath(paths, `/${category.slug}/${subcategory.slug}`, '0.80');

      const subcategoryPayload = await safeFetchJson(`/sub-category/${subcategory.slug}`);
      const subcategoryData = unwrapData(subcategoryPayload);
      const subcategoryDetail = subcategoryData?.sub_category ?? subcategoryData?.subcategory ?? subcategoryData;
      const tours = asArray(subcategoryDetail?.tours ?? subcategoryData?.tours);

      tours.forEach((tour) => {
        if (tour?.slug) addPath(paths, `/${category.slug}/${subcategory.slug}/${tour.slug}`, '0.64');
      });
    }
  }
}

async function addBlogUrls(paths: Map<string, SitemapPath>) {
  const categoriesPayload = await safeFetchJson('/articles/get-article-categories');
  const categoriesData = unwrapData(categoriesPayload);
  const blogCategories = asArray(categoriesData.blog_categories);

  addPath(paths, '/blog', '0.80');
  addPath(paths, '/blogs', '0.80');

  for (const category of blogCategories) {
    if (!category?.slug) continue;
    addPath(paths, `/blog/${category.slug}`, '0.80');
    addPath(paths, `/blogs/${category.slug}`, '0.80');

    const postsPayload = await safeFetchJson(`/articles/get-article-by-category/${category.slug}`);
    const postsData = unwrapData(postsPayload);
    const categoryWithPosts = postsData?.articles ?? postsData;
    const posts = asArray(categoryWithPosts?.articles);

    posts.forEach((post) => {
      if (!post?.slug) return;
      addPath(paths, `/blog/${category.slug}/${post.slug}`, '0.80');
      addPath(paths, `/blogs/${category.slug}/${post.slug}`, '0.80');
    });
  }
}

function renderSitemap(paths: SitemapPath[]) {
  const urls = paths
    .map((item) => `  <url>\n    <loc>${escapeXml(absoluteUrl(item.path))}</loc>\n    <lastmod>${LAST_MODIFIED}</lastmod>\n    <priority>${item.priority}</priority>\n  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n${urls}\n</urlset>\n`;
}

export async function GET() {
  const paths = new Map<string, SitemapPath>();

  [
    ['/', '1.00'],
    ['/egypt-tours', '0.80'],
    ['/about', '0.80'],
    ['/about-us', '0.80'],
    ['/egypt-travel-packages', '0.80'],
    ['/egypt-day-tours', '0.80'],
    ['/egypt-nile-cruises', '0.80'],
    ['/egypt-shore-excursions', '0.80'],
    ['/contact', '0.80'],
    ['/tailor-made', '0.80'],
    ['/faq', '0.80'],
    ['/favourite', '0.80'],
    ['/terms-and-conditions', '0.80'],
    ['/page/Governmental-Licence', '0.80'],
    ['/page/Testimonials', '0.80'],
  ].forEach(([path, priority]) => addPath(paths, path, priority));

  await Promise.all([addTourUrls(paths), addBlogUrls(paths)]);

  return new NextResponse(renderSitemap(Array.from(paths.values())), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
