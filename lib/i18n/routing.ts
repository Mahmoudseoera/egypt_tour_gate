import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  locales: ['en', 'de', 'fr', 'pl', "it"],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export type AppLocale = (typeof routing.locales)[number];

export function getPathLocale(pathname: string): AppLocale {
  const firstSegment = pathname.split('/').filter(Boolean)[0];

  if (firstSegment && routing.locales.includes(firstSegment as AppLocale)) {
    return firstSegment as AppLocale;
  }

  return routing.defaultLocale;
}

/**
 * NOTE: Do NOT use this to build hrefs for next-intl's <Link> component
 * (the one exported from "@/lib/i18n/navigation"). That Link already adds
 * the locale prefix automatically based on the active locale — calling this
 * function and then passing the result to <Link> double-prefixes the path
 * (e.g. /de/de/category → 404).
 *
 * Only use this for cases OUTSIDE next-intl's Link/router, such as:
 *  - plain <a> tags
 *  - window.location assignments
 *  - server-side redirects where you don't have access to next-intl's redirect()
 */
export function buildLocalizedPath(path: string, locale: AppLocale): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (locale === routing.defaultLocale) {
    return normalizedPath;
  }

  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;
}