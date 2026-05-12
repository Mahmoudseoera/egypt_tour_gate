// app/sitemap.xml/route.ts
// Serves:  GET /sitemap.xml  →  English sitemap (no locale prefix in URLs)

import { NextResponse } from 'next/server';
import {
  DEFAULT_LOCALE,
  STATIC_PATHS,
  collectTourPaths,
  collectBlogPaths,
  buildXml,
} from '@/lib/sitemap/sitemapBuilder';

export async function GET() {
  const [tourPaths, blogPaths] = await Promise.all([
    collectTourPaths(),
    collectBlogPaths(),
  ]);

  const xml = buildXml(
    [...STATIC_PATHS, ...tourPaths, ...blogPaths],
    DEFAULT_LOCALE  // → "en" → no prefix in URLs
  );

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
