// lib/hooks/useT.ts
//
// CLIENT-SIDE translation hook ("use client" components only).
// For Server Components / pages, use lib/hooks/getT.ts instead (server twin).
//
// Supports ONE OR MORE namespaces in a single call — pass them in priority
// order, the first namespace that has a non-missing value for the key wins.
// This lets you combine e.g. "common" and "home" without declaring two
// separate t1/t2 variables.
//
// Usage — single namespace (unchanged from before):
//   const t = useT("home");
//   t("section_one_popular")
//
// Usage — multiple namespaces combined:
//   const t = useT(["common", "home"]);
//   t("read_more")              // found in "common" → returned
//   t("section_one_popular")    // not in "common", found in "home" → returned
//   t("totally_missing_key")    // missing everywhere → "common.totally_missing_key"
//                                // (reports under the FIRST namespace, since
//                                //  that's where lookup started)

"use client";
import { useTranslations } from "next-intl";

export function useT(namespace: string | string[]) {
  const namespaces = Array.isArray(namespace) ? namespace : [namespace];

  // One useTranslations() call per namespace — next-intl only accepts a
  // single namespace per hook call, so we fan out and pick the first hit.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const translators = namespaces.map((ns) => useTranslations(ns));

  return function tr(key: string): string {
    for (let i = 0; i < translators.length; i++) {
      const t = translators[i];
      const hasKey = t.has(key as Parameters<typeof t.has>[0]);
      if (hasKey) {
        return t(key as Parameters<typeof t>[0]);
      }
    }
    // Missing in every namespace tried — report under the first one,
    // so the visible placeholder points at where to start looking.
    return `${namespaces[0]}.${key}`;
  };
}
