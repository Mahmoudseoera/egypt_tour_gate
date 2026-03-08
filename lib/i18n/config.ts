export const DEFAULT_LOCALE = "en";

export const SUPPORTED_LOCALES = ["en", "de", "fr", "pl", "pt"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_COOKIE = "site_locale";

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}
