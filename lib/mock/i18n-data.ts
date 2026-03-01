export type Direction = "ltr" | "rtl";

export type SupportedLanguage = "en" | "ar" | "fr" | "de";

export type LanguageOption = {
  code: SupportedLanguage;
  label: string;
  shortLabel: string;
  flag: string;
  dir: Direction;
};

export type TranslationMessages = Record<string, string>;

export type I18nPayload = {
  defaultLanguage: SupportedLanguage;
  languages: LanguageOption[];
  messages: Record<SupportedLanguage, TranslationMessages>;
};

// Mock payload - can be replaced with real API response without changing UI code.
export const i18nMockData: I18nPayload = {
  defaultLanguage: "en",
  languages: [
    { code: "en", label: "English", shortLabel: "ENG", flag: "https://flagcdn.com/w40/us.png", dir: "ltr" },
    { code: "fr", label: "Français", shortLabel: "FRA", flag: "https://flagcdn.com/w40/fr.png", dir: "ltr" },
    { code: "de", label: "Deutsch", shortLabel: "DEU", flag: "https://flagcdn.com/w40/de.png", dir: "ltr" },
    { code: "ar", label: "العربية", shortLabel: "AR", flag: "https://flagcdn.com/w40/eg.png", dir: "rtl" },
  ],
  messages: {
    en: {
      "navbar.callFree": "Call Free :",
      "navbar.currency": "USD",
      "navbar.getStarted": "Get started",
      "navbar.home": "Home",
      "navbar.staticPages": "Pages",
      "navbar.menu": "Menu",
      "navbar.closeMenu": "Close menu",
    },
    ar: {
      "navbar.callFree": "اتصل مجانًا:",
      "navbar.currency": "دولار",
      "navbar.getStarted": "ابدأ الآن",
      "navbar.home": "الرئيسية",
      "navbar.staticPages": "الصفحات",
      "navbar.menu": "القائمة",
      "navbar.closeMenu": "إغلاق القائمة",
    },
    fr: {
      "navbar.callFree": "Appel gratuit :",
      "navbar.currency": "USD",
      "navbar.getStarted": "Commencer",
      "navbar.home": "Accueil",
      "navbar.staticPages": "Pages",
      "navbar.menu": "Menu",
      "navbar.closeMenu": "Fermer le menu",
    },
    de: {
      "navbar.callFree": "Kostenlos anrufen:",
      "navbar.currency": "USD",
      "navbar.getStarted": "Loslegen",
      "navbar.home": "Startseite",
      "navbar.staticPages": "Seiten",
      "navbar.menu": "Menü",
      "navbar.closeMenu": "Menü schließen",
    },
  },
};
