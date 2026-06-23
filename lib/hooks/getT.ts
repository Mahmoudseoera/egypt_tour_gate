// lib/hooks/getT.ts
//
// SERVER-SIDE translation helper for Server Components and pages
// (no "use client", works in async server functions).
//
// Single namespace per call — same pattern as useT.ts but for server-rendered
// components that can't use React hooks.
//
// Behavior:
//  1. If key exists with a value → returns the value
//  2. If key exists but value was null in CMS → shows "namespace.key" placeholder
//  3. If key doesn't exist in API response → shows "namespace.key" placeholder
//
// Usage — Server Component / page.tsx:
//
//   import { getT } from "@/lib/hooks/getT";
//
//   export default async function ContactPage() {
//     const t = await getT("contact");
//     return <h1>{t("contact_title")}</h1>;
//   }
//
// Another server component using a different namespace:
//
//   export default async function HomePage() {
//     const t = await getT("home");
//     return <p>{t("section_one_popular")}</p>;
//   }

import { getTranslations } from "next-intl/server";

export async function getT(namespace: string) {
  const t = await getTranslations(namespace);

  return function tr(key: string): string {
    const hasKey = t.has(key as Parameters<typeof t.has>[0]);

    if (hasKey) {
      return t(key as Parameters<typeof t>[0]);
    }

    // Key missing or null — return visible placeholder
    return `${namespace}.${key}`;
  };
}
