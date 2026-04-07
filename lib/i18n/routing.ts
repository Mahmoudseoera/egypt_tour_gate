import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  type SupportedLocale
} from './config';

export const routing = defineRouting({
  locales: [...SUPPORTED_LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always'
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);

export {isSupportedLocale};
export type {SupportedLocale};
