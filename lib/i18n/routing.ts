import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from "./config";

export function getPathLocale(pathname: string): SupportedLocale {
  const [, maybeLocale] = pathname.split("/");
  if (maybeLocale && isSupportedLocale(maybeLocale)) {
    return maybeLocale;
  }
  return DEFAULT_LOCALE;
}

export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isSupportedLocale(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}

export function buildLocalizedPath(pathname: string, locale: string): string {
  const cleanPath = stripLocalePrefix(pathname);
  if (!isSupportedLocale(locale) || locale === DEFAULT_LOCALE) {
    return cleanPath;
  }

  return cleanPath === "/" ? `/${locale}` : `/${locale}${cleanPath}`;
}
