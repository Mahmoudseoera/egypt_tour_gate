// app/[locale]/sitemap.xml/route.ts
// Serves:
//   GET /de/sitemap.xml  →  German sitemap
//   GET /fr/sitemap.xml  →  French sitemap
//   GET /pl/sitemap.xml  →  Polish sitemap
//
// English is handled separately at app/sitemap.xml/route.ts

import { NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import {
  ALL_LOCALES,
  DEFAULT_LOCALE,
  STATIC_PATHS,
  collectTourPaths,
  collectBlogPaths,
  buildXml,
} from '@/lib/sitemap/sitemapBuilder';

type Params = { params: Promise<{ locale: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { locale } = await params;

  // Guard: only accept known non-default locales
  // (English hits app/sitemap.xml/route.ts instead)
  if (!ALL_LOCALES.includes(locale) || locale === DEFAULT_LOCALE) {
    notFound();
  }

  const [tourPaths, blogPaths] = await Promise.all([
    collectTourPaths(),
    collectBlogPaths(),
  ]);

  const xml = buildXml(
    [...STATIC_PATHS, ...tourPaths, ...blogPaths],
    locale
  );

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

// Pre-render de / fr / pl at build time (not en — that's a separate route)
export function generateStaticParams() {
  return ALL_LOCALES
    .filter((l) => l !== DEFAULT_LOCALE)
    .map((locale) => ({ locale }));
}
