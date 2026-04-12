// Derived from routing.ts locales — keep both in sync
import { routing } from "@/lib/i18n/routing";

export const DEFAULT_LOCALE = "en";

// Single source of truth: routing.ts → config derives from it
export const SUPPORTED_LOCALES = routing.locales;

export type SupportedLocale = (typeof routing.locales)[number];

export const LOCALE_COOKIE = "site_locale";

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}
