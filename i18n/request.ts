// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/lib/i18n/routing';
import { fetchTranslationMessages } from '@/lib/api/translation';

// This file is the source of truth for getTranslations() / getT() used in
// Server Components and pages. It MUST populate `messages` (not {}) — that
// data is what next-intl/server reads from internally.
//
// layout.tsx uses getMessages() (which delegates here via next-intl internals)
// to build the `messages` prop passed into NextIntlClientProvider for client
// components (useTranslations() / useT()). That is intentional: client
// components read from React context (NextIntlClientProvider), while Server
// Components read from this request-scoped config — they are two separate
// delivery paths but share the same data fetched here.
//
// fetchTranslationMessages() uses cache: "no-store" by default, so translations
// are always fresh on every request — no stale-cache risk.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = await fetchTranslationMessages(locale).catch(() => ({}));

  return {
    locale,
    messages,
  };
});
