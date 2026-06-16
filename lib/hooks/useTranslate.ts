// lib/hooks/useT.ts   ← filename must be exactly "useT.ts" (capital T, lowercase u)
//
// Drop-in for the navbar's inline `tr()` helper, but reusable across all components.
//
// Usage in any "use client" component:
//   import { useT } from "@/lib/hooks/useT";
//   const t = useT();
//   <span>{t("read_more", "Read More")}</span>
//   <span>{t("book_now", "Book Now")}</span>
//   <span>{t("blog", "Blog")}</span>
//   <span>{t("now", "Now")}</span>

"use client";
import { useTranslations } from "next-intl";

export function useT() {
  const t = useTranslations();
  return function tr(key: string, fallback: string): string {
    try {
      const val = t(key as Parameters<typeof t>[0]);
      return val ?? fallback;
    } catch {
      return fallback;
    }
  };
}
