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
