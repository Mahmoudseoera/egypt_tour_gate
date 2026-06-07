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

export function buildLocalizedPath(path: string, locale: AppLocale): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (locale === routing.defaultLocale) {
    return normalizedPath;
  }

  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;
}
