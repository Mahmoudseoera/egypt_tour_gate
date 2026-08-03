"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/hooks/useTranslate";
import { Mail, MapPin, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useGeneralData } from "@/lib/api/GeneralApi";
import { buildLocalizedPath, getPathLocale } from "@/lib/i18n/routing";
import SimpleSocialIcon, { SocialItem } from "@/components/layout/simpleSocialIcon";
import { settingsToSocialItems, type SiteSettings } from "@/lib/api/settingsApi";

// Static social data
const fallbackSocialData: SocialItem[] = [];

export default function Footer() {
  const pathname = usePathname();
  const activeLocale = getPathLocale(pathname);
  const { data, loading } = useGeneralData(activeLocale);
  const homePath = buildLocalizedPath("/", activeLocale);
  const currentYear = new Date().getFullYear();
  const [socialData, setSocialData] = useState<SocialItem[]>(fallbackSocialData);

  useEffect(() => {
    fetch(`/api/settings?locale=${activeLocale}`).then(r => r.json()).then((json) => {
      const items = settingsToSocialItems(json?.data as SiteSettings | null);
      if (items.length) setSocialData(items as SocialItem[]);
    }).catch(() => undefined);
  }, [activeLocale]);

  // ── Derived values (safe-access with fallbacks) ────────────────────────────
  const footerLogo = data?.footer.logo;
  const info = data?.footer.info ?? data?.header.info;
  // Real API: footer.categories (same shape as header.categories)
  const footerCategories = data?.footer.categories ?? [];
  const t = useT("common");
  // Render the footer shell immediately; API-backed links hydrate from the shared general-data cache.
  void loading;

  // ── Main footer ─────────────────────────────────────────────────────────────
  return (
    <footer
      aria-label={t("site_footer")}
      className="relative bg-[var(--second-color)] text-white pt-16 pb-10 overflow-hidden"
    >
      {/* Golden top accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[var(--main-color)]" />

      {/* Soft glow decorations */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--main-color)]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-[var(--main-color)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* ── Brand column ─────────────────────────────────────────────── */}
          <div className="space-y-6 lg:col-span-1">
            <Link href={homePath} className="inline-flex items-center hover:opacity-90 transition-opacity" aria-label={t("homepage")}>
              <div className="relative w-32 h-10">
                <Image
                  src={footerLogo?.image || "/assets/images/egypt-tour-gate-logo.png"}
                  alt={footerLogo?.alt || "Egypt Tour Gate Logo"}
                  width={70}
                  height={50}
                  className="object-contain"
                  unoptimized={
                    !!footerLogo?.image &&
                    (footerLogo.image.startsWith("http://127.0.0.1") ||
                      footerLogo.image.startsWith("http://localhost"))
                  }
                />
              </div>
            </Link>

            <p className="text-white/80 text-sm leading-relaxed">
              {t("discover_the_wonders_of_ancient_egypt")}</p>

            {/* Contact info from API */}
            <div className="space-y-3 pt-2 border-t border-[var(--main-color)]/15">
              {info?.address && (
                <div className="flex items-start gap-3 group">
                  <div className="p-2 bg-[var(--main-color)]/10 rounded-full group-hover:bg-[var(--main-color)]/20 transition-colors">
                    <MapPin className="h-4 w-4 text-[var(--main-color)]" aria-hidden="true" />
                  </div>
                  <span className="text-white/80 text-sm">{info.address}</span>
                </div>
              )}

              {info?.phone && (
                <Link href={`tel:${info.phone}`} className="flex items-start gap-3 group">
                  <div className="p-2 bg-[var(--main-color)]/10 rounded-full group-hover:bg-[var(--main-color)]/20 transition-colors">
                    <Phone className="h-4 w-4 text-[var(--main-color)]" aria-hidden="true" />
                  </div>
                  <span className="text-white/80 text-sm">{info.phone}</span>
                </Link>
              )}

              {info?.email && (
                <Link href={`mailto:${info.email}`} className="flex items-start gap-3 group">
                  <div className="p-2 bg-[var(--main-color)]/10 rounded-full group-hover:bg-[var(--main-color)]/20 transition-colors">
                    <Mail className="h-4 w-4 text-[var(--main-color)]" aria-hidden="true" />
                  </div>
                  <span className="text-white/80 text-sm">{info.email}</span>
                </Link>
              )}
            </div>
          </div>

          {/* ── Dynamic categories from real API ─────────────────────────── */}
          {/*
            Real API shape:
              footer.categories[i].name   → plain string  ✓
              footer.categories[i].slug   → string        ✓
              footer.categories[i].subs[] → SubCategory[] ✓
                  .name  → plain string   ✓
                  .slug  → string         ✓
          */}
          {footerCategories.slice(0, 3).map((category) => (
            <div key={category.slug} className="space-y-4">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-[var(--main-color)] rounded-r inline-block" />
                {category.name}
              </h3>
              <ul className="space-y-2">
                {category.subs.map((sub) => (
                  <li key={sub.slug}>
                    <Link
                      href={`/${category.slug}/${sub.slug}`}
                      className="flex items-center gap-2 text-white/75 hover:text-[var(--main-color)] transition-colors py-0.5 group text-sm"
                    >
                      <span className="w-1 h-1 bg-[var(--main-color)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Fallback columns if API returns fewer than 3 categories */}
          {footerCategories.length === 0 && (
            <>
              {[
                { title: "Egypt Day Tours", items: ["Cairo", "Luxor", "Aswan", "Hurghada"] },
                { title: "Tour Packages", items: ["Luxury Tours", "Family Trips", "Budget Tours"] },
                { title: "Nile Cruises", items: ["Luxor & Aswan", "Lake Nasser", "Dahabiya"] },
              ].map((col) => (
                <div key={col.title} className="space-y-4">
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-[var(--main-color)] rounded-r inline-block" />
                    {col.title}
                  </h3>
                  <ul className="space-y-2">
                    {col.items.map((item) => (
                      <li key={item}>
                        <Link href="#" className="flex items-center gap-2 text-white/75 hover:text-[var(--main-color)] transition-colors py-0.5 group text-sm">
                          <span className="w-1 h-1 bg-[var(--main-color)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <div className="mt-12 pt-8 pb-8 md:pb-0 border-t border-[var(--main-color)]/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-white/60 text-sm text-center md:text-left">
            © {currentYear} {t("rights_reserved")}
          </p>

          <div className="flex items-center justify-center gap-3 md:justify-end" role="region" aria-label={t("social_media_links")}>
            <span className="text-white/60 text-sm hidden md:inline">{t("follow_us").toLowerCase()}:</span>
            <div className="flex gap-3">
              {socialData.map((item, index) => {
                // WhatsApp link
                const whatsappNumber =
                  item.title === "WhatsApp"
                    ? item.url?.replace(/\D/g, "")
                    : null;

                // TripAdvisor
                if (item.title === "TripAdvisor") {
                  return (
                    <Link
                      key={index}
                      href={item.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-10 h-10 rounded-full overflow-hidden bg-white/10 hover:bg-[var(--main-color)] transition-all duration-300 flex items-center justify-center"
                    >
                      <Image
                        src="/assets/images/tripadvisor-icon.svg"
                        alt={t("tripadvisor")}
                        width={70}
                        height={30}
                        className="w-5 h-5 object-contain brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition duration-300"
                      />
                    </Link>
                  );
                }

                // WhatsApp
                if (item.title === "WhatsApp") {
                  return (
                    <Link
                      key={index}
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-10 h-10 rounded-full overflow-hidden bg-white/10 hover:bg-[var(--main-color)] transition-all duration-300 flex items-center justify-center"
                    >
                      <i
                        className={`${item.icon} text-xl text-white group-hover:text-[var(--second-color)] transition-colors duration-300`}
                      />
                    </Link>
                  );
                }

                  
                return (
                  <div
                    key={index}
                    className="group relative w-10 h-10 rounded-full overflow-hidden bg-white/10 hover:bg-[var(--main-color)] transition-all duration-300"
                  >
                    <SimpleSocialIcon
                      item={item}
                      className="text-xl text-white group-hover:text-[var(--second-color)] transition-colors duration-300"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
