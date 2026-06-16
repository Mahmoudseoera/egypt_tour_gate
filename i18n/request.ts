// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/lib/i18n/routing';

// Messages are now fetched directly in layout.tsx via fetchTranslationMessages(locale)
// and passed explicitly to NextIntlClientProvider. This file only needs to resolve
// the locale — no message fetching here to avoid double-fetching and stale-context bugs.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: {}, // layout.tsx handles messages directly
  };
});
