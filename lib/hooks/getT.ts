// lib/hooks/getT.ts
//
// SERVER-SIDE translation helper for Server Components and pages
// (no "use client", no React hooks/context — works in async server functions).
//
// next-intl's useTranslations() hook depends on NextIntlClientProvider's React
// context, so it throws/returns nothing useful in a Server Component. The
// correct server-side API is the async getTranslations() from "next-intl/server",
// which reads messages directly from the current request's i18n config
// (the same request.ts / layout.tsx locale resolution you already have).
//
// Usage — Server Component / page.tsx (no "use client"):
//
//   import { getT } from "@/lib/hooks/getT";
//
//   export default async function ContactPage() {
//     const t = await getT("contact");
//     return <h1>{t("contact_title")}</h1>;
//   }
//
// Usage — multiple namespaces combined, same as the client hook:
//
//   const t = await getT(["common", "home"]);
//   t("read_more")            // tries "common" first
//   t("section_one_popular")  // falls through to "home"

import { getTranslations } from "next-intl/server";

export async function getT(namespace: string | string[]) {
  const namespaces = Array.isArray(namespace) ? namespace : [namespace];

  const translators = await Promise.all(
    namespaces.map((ns) => getTranslations(ns))
  );

  return function tr(key: string): string {
    for (let i = 0; i < translators.length; i++) {
      const t = translators[i];
      const hasKey = t.has(key as Parameters<typeof t.has>[0]);
      if (hasKey) {
        return t(key as Parameters<typeof t>[0]);
      }
    }
    return `${namespaces[0]}.${key}`;
  };
}
