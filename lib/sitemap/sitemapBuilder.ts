// lib/sitemap/sitemapBuilder.ts
// Shared logic used by both:
//   app/sitemap.xml/route.ts            ← English (no prefix)
//   app/[locale]/sitemap.xml/route.ts   ← de / fr / pl

import { SITE_URL } from '@/lib/seo';
import { routing } from '@/lib/i18n/routing';

export const API_BASE_URL = `${SITE_URL}/api/v1`;
export const LAST_MODIFIED = new Date().toISOString().split('T')[0] + 'T00:00:00+00:00';

export const DEFAULT_LOCALE = routing.defaultLocale;
export const ALL_LOCALES = routing.locales as readonly string[];

type AnyRecord = Record<string, any>;
export type Entry = { path: string; priority: string };

// ─── URL builder ──────────────────────────────────────────────────────────────

/**
 * Builds an absolute URL for a canonical path + locale.
 * Respects `localePrefix: 'as-needed'`:
 *   en → https://site.com/egypt-day-tours
 *   de → https://site.com/de/egypt-day-tours
 */
export function buildUrl(canonicalPath: string, locale: string): string {
  const clean =
    canonicalPath === "/"
      ? ""
      : `/${canonicalPath.replace(/^\/+|\/+$/g, "")}`;

  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${clean}`;
}

// ─── XML helpers ──────────────────────────────────────────────────────────────

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ─── API helpers ──────────────────────────────────────────────────────────────

export async function safeFetch<T = AnyRecord>(
  endpoint: string
): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function unwrap(payload: AnyRecord | null): AnyRecord {
  return payload?.data ?? payload ?? {};
}

export function toArray(v: unknown): AnyRecord[] {
  return Array.isArray(v) ? v : [];
}

// ─── Static paths ─────────────────────────────────────────────────────────────

export const STATIC_PATHS: Entry[] = [
  { path: '/',                     priority: '1.00' },
  { path: '/about-us',             priority: '0.80' },
  { path: '/contact',              priority: '0.80' },
  { path: '/tailormade',           priority: '0.80' },
  { path: '/faq',                  priority: '0.80' },
  { path: '/favourite',            priority: '0.80' },
  { path: '/terms-and-conditions', priority: '0.80' },
  { path: '/blogs',                priority: '0.80' },
];

// ─── Dynamic path collectors ──────────────────────────────────────────────────

export async function collectTourPaths(): Promise<Entry[]> {
  const entries: Entry[] = [];

  const general = unwrap(await safeFetch('/general-data'));
  const categories = toArray(
    general?.header?.categories ?? general?.header?.headerCategories
  );

  for (const cat of categories) {
    if (!cat?.slug) continue;
    entries.push({ path: `/${cat.slug}`, priority: '0.80' });

    const subs = toArray(
      cat.subs ?? cat.subCategories ?? cat.sub_categories
    );

    for (const sub of subs) {
      if (!sub?.slug) continue;
      entries.push({ path: `/${cat.slug}/${sub.slug}`, priority: '0.80' });

      const subData = unwrap(await safeFetch(`/sub-category/${sub.slug}`));
      const subDetail =
        subData?.sub_category ?? subData?.subcategory ?? subData;
      const tours = toArray(subDetail?.tours ?? subData?.tours);

      for (const tour of tours) {
        if (tour?.slug) {
          entries.push({
            path: `/${cat.slug}/${sub.slug}/${tour.slug}`,
            priority: '0.64',
          });
        }
      }
    }
  }

  return entries;
}

export async function collectBlogPaths(): Promise<Entry[]> {
  const entries: Entry[] = [];

  const catData = unwrap(await safeFetch('/articles/get-article-categories'));
  const blogCategories = toArray(catData.blog_categories);

  for (const cat of blogCategories) {
    if (!cat?.slug) continue;
    entries.push({ path: `/blogs/${cat.slug}`, priority: '0.80' });

    const postsData = unwrap(
      await safeFetch(`/articles/get-article-by-category/${cat.slug}`)
    );
    const posts = toArray((postsData?.articles ?? postsData)?.articles);

    for (const post of posts) {
      if (post?.slug) {
        entries.push({
          path: `/blogs/${cat.slug}/${post.slug}`,
          priority: '0.80',
        });
      }
    }
  }

  return entries;
}

// ─── XML renderer ─────────────────────────────────────────────────────────────

export function buildXml(entries: Entry[], currentLocale: string): string {
  // Deduplicate by canonical path
  const seen = new Set<string>();
  const unique = entries.filter(({ path }) => {
    if (seen.has(path)) return false;
    seen.add(path);
    return true;
  });

  const urlBlocks = unique.map(({ path, priority }) => {
    const loc = escapeXml(buildUrl(path, currentLocale));

    // hreflang alternates: x-default (→ English) + one per locale
    const alternates = [
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(buildUrl(path, DEFAULT_LOCALE))}"/>`,
      ...ALL_LOCALES.map(
        (l) =>
          `    <xhtml:link rel="alternate" hreflang="${l}" href="${escapeXml(buildUrl(path, l))}"/>`
      ),
    ].join('\n');

    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${LAST_MODIFIED}</lastmod>`,
      `    <changefreq>weekly</changefreq>`,
      `    <priority>${priority}</priority>`,
      alternates,
      '  </url>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    // ↓ This line makes browsers render a styled, readable sitemap
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    '<urlset',
    '  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '  xmlns:xhtml="http://www.w3.org/1999/xhtml"',
    '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9',
    '    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
    urlBlocks.join('\n'),
    '</urlset>',
    '',
  ].join('\n');
}
