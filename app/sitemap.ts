import type { MetadataRoute } from 'next';
import { buildLocalizedPath, routing, type AppLocale } from '@/lib/i18n/routing';
import { SITE_URL } from '@/lib/seo';

const API_BASE_URL = `${SITE_URL}/api/v1`;

type AnyRecord = Record<string, any>;
type SitemapChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

type SitemapPath = {
  path: string;
  lastModified?: Date;
  changeFrequency: SitemapChangeFrequency;
  priority: number;
};

function absoluteUrl(path: string, locale: AppLocale = routing.defaultLocale) {
  return `${SITE_URL}${buildLocalizedPath(path, locale)}`;
}

function localizedAlternates(path: string) {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, absoluteUrl(path, locale as AppLocale)])
  ) as Record<string, string>;
}

function normalizePath(path: string) {
  if (!path || path === '/') return '/';
  return `/${path.replace(/^\/+|\/+$/g, '')}`;
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

function addPath(paths: Map<string, SitemapPath>, item: SitemapPath) {
  const path = normalizePath(item.path);
  if (paths.has(path)) return;
  paths.set(path, { ...item, path });
}

async function addTourUrls(paths: Map<string, SitemapPath>) {
  const generalPayload = await safeFetchJson('/general-data');
  const generalData = unwrapData(generalPayload);
  const categories = asArray(generalData?.header?.categories ?? generalData?.header?.headerCategories);

  for (const category of categories) {
    if (!category?.slug) continue;

    addPath(paths, {
      path: `/${category.slug}`,
      changeFrequency: 'daily',
      priority: 0.9,
    });

    const subcategories = asArray(category.subs ?? category.subCategories ?? category.sub_categories);

    for (const subcategory of subcategories) {
      if (!subcategory?.slug) continue;

      addPath(paths, {
        path: `/${category.slug}/${subcategory.slug}`,
        changeFrequency: 'daily',
        priority: 0.8,
      });

      const subcategoryPayload = await safeFetchJson(`/sub-category/${subcategory.slug}`);
      const subcategoryData = unwrapData(subcategoryPayload);
      const subcategoryDetail = subcategoryData?.sub_category ?? subcategoryData?.subcategory ?? subcategoryData;
      const tours = asArray(subcategoryDetail?.tours ?? subcategoryData?.tours);

      tours.forEach((tour) => {
        if (!tour?.slug) return;
        addPath(paths, {
          path: `/${category.slug}/${subcategory.slug}/${tour.slug}`,
          changeFrequency: 'weekly',
          priority: 0.75,
        });
      });
    }
  }
}

async function addBlogUrls(paths: Map<string, SitemapPath>) {
  const categoriesPayload = await safeFetchJson('/articles/get-article-categories');
  const categoriesData = unwrapData(categoriesPayload);
  const blogCategories = asArray(categoriesData.blog_categories);

  for (const category of blogCategories) {
    if (!category?.slug) continue;

    addPath(paths, {
      path: `/blogs/${category.slug}`,
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    const postsPayload = await safeFetchJson(`/articles/get-article-by-category/${category.slug}`);
    const postsData = unwrapData(postsPayload);
    const categoryWithPosts = postsData?.articles ?? postsData;
    const posts = asArray(categoryWithPosts?.articles);

    posts.forEach((post) => {
      if (!post?.slug) return;
      addPath(paths, {
        path: `/blogs/${category.slug}/${post.slug}`,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = new Map<string, SitemapPath>();
  const staticPaths: SitemapPath[] = [
    { path: '/', changeFrequency: 'daily', priority: 1 },
    { path: '/about-us', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/tailor-made', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/free-page', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/faq', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/blogs', changeFrequency: 'weekly', priority: 0.75 },
  ];

  staticPaths.forEach((item) => addPath(paths, item));

  await Promise.all([addTourUrls(paths), addBlogUrls(paths)]);

  const now = new Date();

  return Array.from(paths.values()).flatMap((item) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(item.path, locale as AppLocale),
      lastModified: item.lastModified ?? now,
      changeFrequency: item.changeFrequency,
      priority: locale === routing.defaultLocale ? item.priority : Math.max(item.priority - 0.05, 0.1),
      alternates: {
        languages: {
          'x-default': absoluteUrl(item.path, routing.defaultLocale),
          ...localizedAlternates(item.path),
        },
      },
    }))
  );
}
