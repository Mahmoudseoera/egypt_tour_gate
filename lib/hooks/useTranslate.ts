// lib/hooks/useT.ts
//
// Namespaced translation hook matching the backend's page-group structure
// (common / home / sub / view_tour / blog / questions / about / tailormade
// / contact / favourites).
//
// Usage — pass the group name once per component, then call t(key, fallback):
//
//   // Navbar / shared UI → "common" group
//   const t = useT("common");
//   t("read_more", "Read More")
//   t("book_now", "Book Now")
//   t("blog", "Blog")
//
//   // Home page → "home" group
//   const t = useT("home");
//   t("section_one_popular", "Recommended Egypt Trips")
//   t("why_choose_box_1_title", "Years Of Experience")
//
//   // Contact page → "contact" group
//   const t = useT("contact");
//   t("contact_title", "Contact Us")

"use client";
import { useTranslations } from "next-intl";

export function useT(namespace: string) {
  const t = useTranslations(namespace);
  return function tr(key: string, fallback: string): string {
    try {
      const val = t(key as Parameters<typeof t>[0]);
      return val ?? fallback;
    } catch {
      return fallback;
    }
  };
}
