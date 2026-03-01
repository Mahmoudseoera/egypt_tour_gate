import type { LanguageOption, SupportedLanguage } from "@/lib/mock/i18n-data";

export const fallbackLanguage: SupportedLanguage = "en";

export function isSupportedLanguage(
  value: string | null,
  options: LanguageOption[],
): value is SupportedLanguage {
  if (!value) {
    return false;
  }

  return options.some((option) => option.code === value);
}

export function stripLanguagePrefix(pathname: string, options: LanguageOption[]): string {
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = cleanPath.split("/").filter(Boolean);

  if (segments.length === 0) {
    return "/";
  }

  const firstSegment = segments[0];
  const hasLanguagePrefix = options.some((option) => option.code === firstSegment && option.code !== fallbackLanguage);

  if (!hasLanguagePrefix) {
    return cleanPath;
  }

  const rest = segments.slice(1);
  return rest.length ? `/${rest.join("/")}` : "/";
}

export function withLanguagePrefix(
  pathname: string,
  language: SupportedLanguage,
  options: LanguageOption[],
): string {
  const pathWithoutLanguage = stripLanguagePrefix(pathname, options);

  if (language === fallbackLanguage) {
    return pathWithoutLanguage;
  }

  if (pathWithoutLanguage === "/") {
    return `/${language}`;
  }

  return `/${language}${pathWithoutLanguage}`;
}

export function getLanguageFromPathname(
  pathname: string,
  options: LanguageOption[],
): SupportedLanguage {
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const firstSegment = cleanPath.split("/").filter(Boolean)[0] ?? "";

  const matched = options.find((option) => option.code === firstSegment && option.code !== fallbackLanguage);
  return matched?.code ?? fallbackLanguage;
}
