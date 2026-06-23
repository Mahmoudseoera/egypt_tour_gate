// lib/hooks/useT.ts
//
// CLIENT-SIDE translation hook for "use client" components only.
// For Server Components / pages, use lib/hooks/getT.ts instead.
//
// Single namespace per call — pass the page-group name ("common", "home",
// "contact", "blog", etc.) and get translations from that group.
//
// Behavior:
//  1. If key exists with a value → returns the value (normal case)
//  2. If key exists but value was null in CMS → shows "namespace.key" placeholder
//  3. If key doesn't exist in API response → shows "namespace.key" placeholder
//
// Cases 2 & 3 both signal to data-entry that this key/value is missing and
// needs to be added to the translation editor.
//
// Usage:
//   const t = useT("home");
//   t("section_one_popular")     // "Recommended Egypt Trips"
//   t("missing_key")             // "home.missing_key" ← fix in CMS
//
//   const t = useT("common");
//   t("read_more")               // "Read More"
//   t("contact_title")           // "contact.contact_title" ← wrong namespace

"use client";
import { useTranslations } from "next-intl";

export function useT(namespace: string) {
  const t = useTranslations(namespace);

  return function tr(key: string): string {
    // Check if key exists in this namespace
    const hasKey = t.has(key as Parameters<typeof t.has>[0]);

    if (hasKey) {
      return t(key as Parameters<typeof t>[0]);
    }

    // Key missing or null — return visible placeholder
    return `${namespace}.${key}`;
  };
}
