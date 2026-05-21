"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  X,
  Home,
  BookOpen,
  CircleDollarSign,
  Globe,
  Bell,
  Sun,
  HelpCircle,
  Smartphone,
  Map,
  Heart,
  Compass,
  Sparkles,
  Ship,
  Palmtree,
  Camera,
  User,
  ArrowRight,
  Star,
} from "lucide-react";
import { useGeneralData } from "@/lib/api/GeneralApi";
import { routing, type AppLocale } from "@/lib/i18n/routing";
import { useLocale } from "next-intl";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import SimpleSocialIcon, {
  SocialItem,
} from "@/components/layout/simpleSocialIcon";
import { settingsToSocialItems, type SiteSettings } from "@/lib/api/settingsApi";

/* ── Static social links ─────────────────────────────────────────────────── */
const fallbackSocialData: SocialItem[] = [];

/* ── Category helpers ────────────────────────────────────────────────────── */
function getCategoryIcon(slug: string) {
  const map: Record<string, React.ReactNode> = {
    "egypt-day-tours": <Compass size={20} />,
    "egypt-tour-packages": <Map size={20} />,
    "egypt-travel-packages": <Map size={20} />,
    "nile-cruises": <Ship size={20} />,
    "egypt-nile-cruises": <Ship size={20} />,
    "egypt-shore-excursions": <Palmtree size={20} />,
    "beach-tours": <Palmtree size={20} />,
    "photography-tours": <Camera size={20} />,
  };
  return map[slug] ?? <Sparkles size={20} />;
}

function getCategoryDescription(slug: string) {
  const map: Record<string, string> = {
    "egypt-day-tours": "Explore iconic sites in a single day with expert guides",
    "egypt-tour-packages": "Complete multi-day itineraries across Egypt",
    "egypt-travel-packages": "Complete multi-day itineraries across Egypt",
    "nile-cruises": "Sail the legendary Nile River in style & comfort",
    "egypt-nile-cruises": "Sail the legendary Nile River in style & comfort",
    "egypt-shore-excursions": "Pristine Red Sea shores and coastal adventures",
  };
  return map[slug] ?? "Discover unforgettable experiences across Egypt";
}

function getCategoryColor(slug: string) {
  const map: Record<string, string> = {
    "egypt-day-tours": "#e3b75e",
    "egypt-tour-packages": "#272262",
    "egypt-travel-packages": "#272262",
    "nile-cruises": "#1e6fa5",
    "egypt-nile-cruises": "#1e6fa5",
    "egypt-shore-excursions": "#27a06e",
  };
  return map[slug] ?? "#e3b75e";
}

/* ── Featured highlights (static) ───────────────────────────────────────── */
// const featuredHighlights = [
//   {
//     title: "Pyramids of Giza",
//     tag: "Most Popular",
//     img: "/assets/images/tours/camel front of giza pyramids.jpg",
//     href: "/egypt-day-tours/cairo-day-tours",
//   },
//   {
//     title: "Nile Cruise Package",
//     tag: "Best Value",
//     img: "/assets/images/tours/49-webp.webp",
//     href: "/egypt-nile-cruises/luxor-aswan-nile-cruises",
//   },
// ];

/* ── Locale prefix helpers ───────────────────────────────────────────────── */

/**
 * Build a regex that matches any known locale prefix at the start of a path.
 * e.g. for locales ['en','de','fr','pl'] → /^\/(en|de|fr|pl)(\/|$)/
 * This is derived at runtime from routing.locales so it never goes stale.
 */
const LOCALE_PREFIX_RE = new RegExp(
  `^\\/(${routing.locales.join("|")})(\\/?)`
);

/**
 * Strip the locale prefix from any pathname, regardless of which locale it is.
 * Returns the bare path starting with "/".
 */
function stripLocalePrefix(pathname: string): string {
  // routing uses localePrefix: "as-needed", defaultLocale has no prefix
  return pathname.replace(LOCALE_PREFIX_RE, "/").replace(/\/+$/, "") || "/";
}

/**
 * Prepend the locale prefix when needed.
 * localePrefix: "as-needed" → defaultLocale gets no prefix, others get one.
 */
function localizePath(path: string, locale: AppLocale): string {
  if (locale === routing.defaultLocale) return path;
  // Ensure path starts with /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${cleanPath}`;
}

/* ══════════════════════════════════════════════════════════════════════════ */

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  // useLocale() returns AppLocale — now matches useGeneralData() signature
  const locale = useLocale() as AppLocale;
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const router = useRouter();

  const { data, error, loading } = useGeneralData(locale);
  const [socialData, setSocialData] = useState<SocialItem[]>(fallbackSocialData);
  useEffect(() => {
    fetch(`/api/settings?locale=${locale}`).then(r => r.json()).then((json) => {
      const items = settingsToSocialItems(json?.data as SiteSettings | null);
      if (items.length) setSocialData(items as SocialItem[]);
    }).catch(() => undefined);
  }, [locale]);

  const currentLanguage = data?.header.languages.find(
    (lang) => lang.slug === locale
  );

  /**
   * FIX: Strip ALL locale prefixes dynamically using the regex built from
   * routing.locales. Previously this was hardcoded to only strip /en and /de,
   * which broke switching to /fr and /pl.
   */
  const onLanguageChange = (newLocale: string) => {
    const nextLocale = newLocale as AppLocale;
      router.replace("/", { locale: nextLocale });
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMenu = () => {
    setMobileOpen(false);
    setActiveDropdown(null);
  };

  if (loading) return null;

  if (error || !data) {
    return (
      <nav className="w-full bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <Image src="/assets/images/egypt-tour-gate-logo.png" alt="Egypt Tour Gate" width={70} height={30} />
          </Link>
          <div className="text-sm text-gray-600">Menu unavailable, using fallback.</div>
        </div>
      </nav>
    );
  }

  const logoSrc =
    data.header.logo?.image || "/assets/images/egypt-tour-gate-logo.png";
  const logoAlt = data.header.logo?.alt || "Egypt Tour Gate";
  const logoUnoptimized =
    logoSrc.startsWith("http://127.0.0.1") ||
    logoSrc.startsWith("http://localhost");

  const categories = data.header.categories;
  // const featuredHighlights = categories
  //   .map((cat) => {
  //     if (!cat.subs?.length) return null;

  //     const randomIndex =
  //       cat.slug
  //         .split("")
  //         .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
  //       cat.subs.length;

  //     const randomSub = cat.subs[randomIndex];

  //     return {
  //       title: randomSub.name,
  //       tag: cat.name,
  //       img:
  //         randomSub.media?.image ||
  //         "/assets/images/tours/default-tour.jpg",

  //       href: `/${cat.slug}/${randomSub.slug}`,
  //       color: getCategoryColor(cat.slug),
  //     };
  //   })
  //   .filter(
  //     (
  //       item
  //     ): item is {
  //       title: string;
  //       tag: string;
  //       img: string;
  //       href: string;
  //       color: string;
  //     } => item !== null
  //   )
  //   .slice(0, 2);

  // Helper bound to current locale — used throughout JSX
  const lp = (path: string) => localizePath(path, locale);

  const getFeaturedHighlights = (cat: (typeof categories)[number]) => {
    if (!cat.subs?.length) return [];

    return cat.subs
      .slice(0, 2)
      .map((sub, index) => ({
        title: sub.name,
        tag: index === 0 ? "Popular" : "Recommended",
        img:
          sub.media?.image ||
          "/assets/images/tours/default-tour.jpg",

        href: `/${cat.slug}/${sub.slug}`,
        color: getCategoryColor(cat.slug),
      }));
  };
  return (
    <>
      <style jsx global>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideDown {
          from { max-height: 0; opacity: 0; }
          to   { max-height: 400px; opacity: 1; }
        }
        @keyframes megaFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .mobile-overlay { animation: fadeInOverlay 0.28s ease forwards; }
        .mobile-drawer  { animation: slideInLeft 0.32s cubic-bezier(0.32, 0.72, 0, 1) forwards; }
        .submenu-open   { animation: slideDown 0.28s ease forwards; overflow: hidden; }

        .nav-link-underline { position: relative; }
        .nav-link-underline::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          background: var(--main-color);
          transition: width 0.25s ease;
        }
        .nav-link-underline:hover::after,
        .nav-link-underline.active::after { width: 100%; }

        .simple-dropdown {
          animation: dropdownFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top center;
        }
        .simple-dropdown-item {
          position: relative;
          transition: all 0.18s ease;
        }
        .simple-dropdown-item::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 0;
          background: var(--main-color);
          opacity: 0.12;
          transition: width 0.2s ease;
          border-radius: 0 4px 4px 0;
        }
        .simple-dropdown-item:hover::before { width: 100%; }
        .simple-dropdown-item .item-arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.18s ease;
        }
        .simple-dropdown-item:hover .item-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .mega-menu {
          animation: megaFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top center;
        }
        .mega-cat-card {
          position: relative;
          overflow: hidden;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mega-cat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--main-color);
          opacity: 0;
          transition: opacity 0.2s ease;
          border-radius: 12px;
          z-index: 0;
        }
        .mega-cat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(39,34,98,0.13); }
        .mega-cat-card:hover::before { opacity: 0.07; }
        .mega-cat-card .cat-icon-wrap { transition: all 0.2s ease; }
        .mega-cat-card:hover .cat-icon-wrap { transform: scale(1.1); }
        .mega-cat-card .cat-arrow {
          opacity: 0;
          transform: translateX(-6px);
          transition: all 0.2s ease;
        }
        .mega-cat-card:hover .cat-arrow { opacity: 1; transform: translateX(0); }

        .mega-sub-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 8px;
          font-size: 13.5px;
          color: #555;
          transition: all 0.16s ease;
          font-weight: 500;
        }
        .mega-sub-link::before {
          content: '';
          position: absolute;
          left: 8px;
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--main-color);
          opacity: 0;
          transition: opacity 0.16s ease;
        }
        .mega-sub-link:hover {
          background: rgba(227,183,94,0.1);
          color: var(--second-color);
          padding-left: 20px;
        }
        .mega-sub-link:hover::before { opacity: 1; }

        .featured-card {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .featured-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.18); }
        .featured-card img { transition: transform 0.4s ease; }
        .featured-card:hover img { transform: scale(1.06); }

        .nav-active-dot {
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--main-color);
          opacity: 0;
          transition: opacity 0.2s;
        }
        li:hover .nav-active-dot,
        li.menu-open .nav-active-dot { opacity: 1; }

        .topbar-wrapper {
          background: var(--main-grey, #f9f9f9);
          border-bottom: 1px solid rgba(39,34,98,0.08);
        }
        .lang-menu {
          display: none;
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          border: 1px solid rgba(0,0,0,0.07);
          min-width: 120px;
          overflow: hidden;
          z-index: 999;
        }
        .group:hover .lang-menu { display: block; }
        .lang-item {
          padding: 8px 14px;
          font-size: 13px;
          color: var(--second-color);
          font-weight: 500;
          transition: background 0.15s;
        }
        .lang-item:hover { background: rgba(227,183,94,0.1); }
      `}</style>

      <header>
        {/* ===== TOP BAR ===== */}
        <div className="topbar-wrapper">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-2 text-sm">
            <div className="flex items-center">
              <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
                {socialData.map((item, index) => {
                if (item.title === "TripAdvisor") {
                  return (
                    <Link
                      key={index}
                      href={item.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:opacity-80"
                    >
                      <Image
                        src="/assets/images/tripadvisor-icon.svg"
                        width={70}
                        height={30}
                        alt="TripAdvisor"
                        className="w-5 h-5 object-contain"
                      />
                    </Link>
                  );
                }

                  // WhatsApp
                  if (item.title === "WhatsApp") {
                    return (
                      <a
                        key={index}
                        href={`https://wa.me/${item.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--second-color)] hover:text-[var(--main-color)] transition"
                      >
                        <i className={item.icon}></i>
                      </a>
                    );
                  }

                  // باقي السوشيال
                  return (
                    <SimpleSocialIcon
                      key={index}
                      item={item}
                      className="text-[var(--second-color)] hover:text-[var(--main-color)] transition"
                    />
                  );  
                })}
              </div>
              <Link
                href={`tel:${data.header.info?.phone ?? "+201110008407"}`}
                className="flex items-center gap-2 pl-4 text-[var(--second-color)] hover:text-[var(--main-color)] transition"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden md:inline font-medium">Call Free :</span>
                <span className="hidden lg:inline">
                  {data.header.info?.phone ?? "+201110008407"}
                </span>
              </Link>
            </div>

            <div className="flex items-center">
              <Link
                href={`mailto:${data.header.info?.email ?? "info@egypttoursgate.com"}`}
                className="flex items-center gap-2 pr-4 border-r border-gray-200 text-[var(--second-color)] hover:text-[var(--main-color)] transition"
              >
                <Mail className="h-4 w-4" />
                <span className="hidden lg:inline font-medium">
                  {data.header.info?.email ?? "info@egypttoursgate.com"}
                </span>
              </Link>

              {/* Language switcher */}
              <div className="relative group flex items-center gap-1 px-4 border-r border-gray-200 cursor-pointer text-[var(--second-color)]">
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline uppercase font-medium">
                  {currentLanguage?.slug ?? locale}
                </span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                <div className="lang-menu">
                  {data.header.languages.map((lang) => (
                    <button
                      key={lang.slug}
                      type="button"
                      onClick={() => onLanguageChange(lang.slug)}
                      className="lang-item w-full text-left"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1 pl-4 cursor-pointer text-[var(--second-color)]">
                <span className="hidden md:inline">USD</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <Link href="/favourite" className="flex items-center gap-1 pl-4 text-[var(--second-color)] hover:text-[var(--main-color)] transition">
               <Heart size={18} style={{ color: "var(--second-color)" }} />
              </Link>
            </div>
          </div>
        </div>

        {/* ===== MAIN NAV ===== */}
        <nav
          ref={navRef}
          className={`w-full z-50 border-gray-200 transition-all duration-300 ${
            isScrolled ? "fixed top-0 bg-white shadow-xl" : "relative bg-white"
          }`}
        >
          <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-2">
            {/* Logo */}
            <Link href={lp("/")}>
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={70}
                height={30}
                unoptimized={logoUnoptimized}
              />
            </Link>

            {/* Right: CTA + Hamburger */}
            <div className="flex items-center gap-3 md:order-2">
              <Link href="/tailor-made" className="btn-effect hidden md:block">
                Get started
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex flex-col gap-[5px] p-2 group"
                aria-label="Open menu"
              >
                <span className="block w-6 h-0.5 bg-[var(--second-color)] transition-all duration-300" />
                <span className="block w-4 h-0.5 bg-[var(--second-color)] transition-all duration-300 group-hover:w-6" />
                <span className="block w-6 h-0.5 bg-[var(--second-color)] transition-all duration-300" />
              </button>
            </div>

            {/* ===== DESKTOP NAV LINKS ===== */}
            <ul className="hidden md:flex gap-1 font-medium navbar-main items-center">
              {/* Home */}
              <li className="py-4">
                <Link
                  href={lp("/")}
                  className="px-3 py-2 rounded-md text-[var(--second-color)] hover:text-[var(--main-color)] transition-colors duration-200 text-[14.5px] font-semibold nav-link-underline"
                >
                  Home
                </Link>
              </li>

              {categories.map((cat) => {
                const isOpen = activeMegaMenu === cat.slug;
                const hasSubs = cat.subs.length > 0;
                const catColor = getCategoryColor(cat.slug);
                const featuredHighlights = getFeaturedHighlights(cat);
                return (
                  <li
                    key={cat.slug}
                    className={`relative py-4 ${isOpen ? "menu-open" : ""}`}
                    onMouseEnter={() => setActiveMegaMenu(cat.slug)}
                    onMouseLeave={() => setActiveMegaMenu(null)}
                  >
                    <Link
                      href={lp(`/${cat.slug}`)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-md text-[14.5px] font-semibold transition-all duration-200 nav-link-underline capitalize ${
                        isOpen
                          ? "text-[var(--main-color)]"
                          : "text-[var(--second-color)] hover:text-[var(--main-color)]"
                      }`}
                    >
                      {cat.name.toLowerCase()}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-[var(--main-color)]" : ""}`}
                      />
                    </Link>

                    <span className="nav-active-dot" />

                    {hasSubs && isOpen && (
                      <div
                        className="mega-menu absolute top-full left-1/2 -translate-x-1/2 z-[200]"
                        style={{ minWidth: "780px" }}
                      >
                        <div className="h-2 w-full" />
                        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(39,34,98,0.14)] border border-gray-100 overflow-hidden">
                          <div
                            className="h-1 w-full"
                            style={{ background: `linear-gradient(90deg, ${catColor}, var(--main-color))` }}
                          />
                          <div className="flex">
                            <div className="flex-1 p-6">
                              <div className="flex items-center gap-3 mb-5">
                                <div
                                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                                  style={{ background: catColor }}
                                >
                                  {getCategoryIcon(cat.slug)}
                                </div>
                                <div>
                                  <h3 className="font-bold text-[var(--second-color)] text-[15px] capitalize leading-tight">
                                    {cat.name}
                                  </h3>
                                  <p className="text-xs text-gray-400 leading-tight mt-0.5">
                                    {getCategoryDescription(cat.slug)}
                                  </p>
                                </div>
                                <Link
                                  href={lp(`/${cat.slug}`)}
                                  className="ml-auto flex items-center gap-1 text-xs font-bold whitespace-nowrap px-3 py-1.5 rounded-full border transition-all duration-200"
                                  style={{ color: catColor, borderColor: catColor }}
                                  onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = catColor;
                                    (e.currentTarget as HTMLElement).style.color = "#fff";
                                  }}
                                  onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = "transparent";
                                    (e.currentTarget as HTMLElement).style.color = catColor;
                                  }}
                                >
                                  View all
                                  <ArrowRight size={12} />
                                </Link>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                {cat.subs.map((sub) => (
                                  <Link
                                    key={sub.slug}
                                    href={lp(`/${cat.slug}/${sub.slug}`)}
                                    className="mega-cat-card flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/60 group/card"
                                  >
                                    {sub.media?.image ? (
                                      <div className="cat-icon-wrap w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 relative z-10">
                                        <Image
                                          src={sub.media.image}
                                          alt={sub.media.alt || sub.name}
                                          width={32}
                                          height={32}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <div
                                        className="cat-icon-wrap w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10"
                                        style={{ background: `${catColor}18` }}
                                      >
                                        <span style={{ color: catColor }} className="text-sm">
                                          {getCategoryIcon(cat.slug)}
                                        </span>
                                      </div>
                                    )}

                                    <div className="flex-1 min-w-0 relative z-10">
                                      <span className="block text-[13px] font-semibold text-[var(--second-color)] capitalize truncate leading-tight">
                                        {sub.name.toLowerCase()}
                                      </span>
                                    </div>

                                    <ChevronRight
                                      size={14}
                                      className="cat-arrow flex-shrink-0 relative z-10"
                                      style={{ color: catColor }}
                                    />
                                  </Link>
                                ))}
                              </div>
                            </div>

                            <div className="w-px bg-gray-100 my-4" />

                            <div className="w-[220px] flex-shrink-0 p-5 bg-gray-50/50">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                                Featured
                              </p>
                              <div className="flex flex-col gap-3">
                                {featuredHighlights.map((item, index) => (
                                  <Link
                                    key={item.href}
                                    href={lp(item.href)}
                                    className="featured-card block"
                                  >
                                    <div className="relative h-[100px] w-full overflow-hidden rounded-xl">
                                      <Image
                                        src={item.img}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                      <span
                                        className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                                        style={{ background: catColor }}
                                      >
                                        {item.tag}
                                      </span>
                                      <p className="absolute bottom-2 left-2 right-2 text-white text-[12px] font-bold leading-tight">
                                        {item.title}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>

                              <div
                                className="mt-4 p-3 rounded-xl text-center"
                                style={{ background: `${catColor}15`, border: `1px dashed ${catColor}60` }}
                              >
                                <Star size={14} className="mx-auto mb-1" style={{ color: catColor }} />
                                <p className="text-[11px] font-bold text-[var(--second-color)] leading-tight">
                                  Tailor-made tours available
                                </p>
                                <Link
                                  href="/tailor-made"
                                  className="inline-block mt-1.5 text-[10px] font-bold underline"
                                  style={{ color: catColor }}
                                >
                                  Build my trip →
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}

              {/* ===== STATIC PAGES dropdown ===== */}
              <li
                className={`relative py-4 ${activeMegaMenu === "static" ? "menu-open" : ""}`}
                onMouseEnter={() => setActiveMegaMenu("static")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <span
                  className={`flex items-center gap-1 cursor-pointer px-3 py-2 rounded-md text-[14.5px] font-semibold transition-all duration-200 nav-link-underline ${
                    activeMegaMenu === "static"
                      ? "text-[var(--main-color)]"
                      : "text-[var(--second-color)] hover:text-[var(--main-color)]"
                  }`}
                >
                  More Pages
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${activeMegaMenu === "static" ? "rotate-180" : ""}`}
                  />
                </span>
                <span className="nav-active-dot" />

                {activeMegaMenu === "static" && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full z-[200]">
                    <div className="h-2 w-full" />
                    <div className="simple-dropdown bg-white rounded-2xl shadow-[0_16px_48px_rgba(39,34,98,0.12)] border border-gray-100 overflow-hidden min-w-[200px]">
                      <div className="h-1 w-full bg-gradient-to-r from-[var(--second-color)] to-[var(--main-color)]" />
                      <div className="py-2">
                        {[
                          { href: "/contact", label: "Contact Us", icon: <Phone size={14} /> },
                          { href: "/about-us", label: "About Us", icon: <User size={14} /> },
                          { href: "/free-page", label: "Free Page", icon: <Sparkles size={14} /> },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={lp(item.href)}
                            className="simple-dropdown-item flex items-center gap-3 px-4 py-2.5 hover:text-[var(--second-color)] text-gray-600 font-medium text-[13.5px]"
                          >
                            <span
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: "rgba(39,34,98,0.07)", color: "var(--second-color)" }}
                            >
                              {item.icon}
                            </span>
                            {item.label}
                            <ArrowRight size={13} className="item-arrow ml-auto" style={{ color: "var(--main-color)" }} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>

              {/* Blogs */}
              <li className="py-4">
                <Link
                  href={lp("/blogs")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[14.5px] font-semibold text-[var(--second-color)] hover:text-[var(--main-color)] transition-colors duration-200 nav-link-underline"
                >
                  <BookOpen size={15} />
                  Blogs
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* ===== MOBILE DRAWER ===== */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-[999] md:hidden mobile-overlay"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
            onClick={closeMenu}
          >
            <div
              className="mobile-drawer absolute left-0 top-0 h-full w-[88%] max-w-[360px] bg-white flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ background: "var(--second-color)" }}>
                <Link href={lp("/")} aria-label="Homepage">
                  <Image
                    src="/assets/images/egypt-tour-gate-logo.png"
                    alt="Egypt Tour Gate"
                    width={60}
                    height={26}
                    className="brightness-0 invert"
                  />
                </Link>
                <button
                  onClick={closeMenu}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:bg-white/20"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-5 pt-5 pb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Explore</p>
                </div>

                {/* Home */}
                <Link
                  href={lp("/")}
                  onClick={closeMenu}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(39,34,98,0.08)" }}>
                    <Home size={18} style={{ color: "var(--second-color)" }} />
                  </div>
                  <span className="font-semibold text-[15px]" style={{ color: "var(--second-color)" }}>Home</span>
                  <ChevronRight size={15} className="ml-auto text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>

                {/* Dynamic Categories */}
                {categories.map((cat) => (
                  <div key={cat.slug}>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === cat.slug ? null : cat.slug)}
                      className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group text-left"
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                        style={{
                          background: activeDropdown === cat.slug
                            ? "var(--main-color)"
                            : "rgba(39,34,98,0.08)",
                        }}
                      >
                        <span style={{ color: activeDropdown === cat.slug ? "#fff" : "var(--second-color)" }}>
                          {getCategoryIcon(cat.slug)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-[15px] capitalize" style={{ color: "var(--second-color)" }}>
                          {cat.name}
                        </span>
                        {cat.subs.length > 0 && (
                          <span className="block text-xs text-gray-400">{cat.subs.length} subcategories</span>
                        )}
                      </div>
                      <ChevronDown
                        size={16}
                        className="text-gray-400 flex-shrink-0 transition-transform duration-300"
                        style={{ transform: activeDropdown === cat.slug ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </button>

                    {activeDropdown === cat.slug && cat.subs.length > 0 && (
                      <div className="submenu-open bg-gray-50 border-l-2 ml-5" style={{ borderColor: "var(--main-color)" }}>
                        {cat.subs.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={lp(`/${cat.slug}/${sub.slug}`)}
                            onClick={closeMenu}
                            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition-colors group"
                          >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--main-color)" }} />
                            <span className="text-[14px] text-gray-700 capitalize group-hover:text-[var(--second-color)] transition-colors font-medium">
                              {sub.name}
                            </span>
                            <ChevronRight size={13} className="ml-auto text-gray-300 group-hover:translate-x-0.5 transition-transform duration-200" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Blogs */}
                <Link
                  href={lp("/blogs")}
                  onClick={closeMenu}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(39,34,98,0.08)" }}>
                    <BookOpen size={18} style={{ color: "var(--second-color)" }} />
                  </div>
                  <span className="font-semibold text-[15px]" style={{ color: "var(--second-color)" }}>Blogs</span>
                  <ChevronRight size={15} className="ml-auto text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>

                {/* Static Pages */}
                <div>
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === "static" ? null : "static")}
                    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group text-left"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                      style={{ background: activeDropdown === "static" ? "var(--main-color)" : "rgba(39,34,98,0.08)" }}
                    >
                      <Sparkles size={18} style={{ color: activeDropdown === "static" ? "#fff" : "var(--second-color)" }} />
                    </div>
                    <span className="font-semibold text-[15px]" style={{ color: "var(--second-color)" }}>More Pages</span>
                    <ChevronDown
                      size={16}
                      className="ml-auto text-gray-400 flex-shrink-0 transition-transform duration-300"
                      style={{ transform: activeDropdown === "static" ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>
                  {activeDropdown === "static" && (
                    <div className="submenu-open bg-gray-50 border-l-2 ml-5" style={{ borderColor: "var(--main-color)" }}>
                      {[
                        { href: "/contact", label: "Contact" },
                        { href: "/about-us", label: "About Us" },
                        { href: "/free-page", label: "Free Page" },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={lp(item.href)}
                          onClick={closeMenu}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition-colors group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--main-color)" }} />
                          <span className="text-[14px] text-gray-700 group-hover:text-[var(--second-color)] transition-colors font-medium">{item.label}</span>
                          <ChevronRight size={13} className="ml-auto text-gray-300 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mx-5 my-4 border-t border-gray-100" />
                <div className="px-5 pb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Preferences</p>
                </div>

                {/* Currency */}
                <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(39,34,98,0.08)" }}>
                    <CircleDollarSign size={18} style={{ color: "var(--second-color)" }} />
                  </div>
                  <span className="font-semibold text-[15px]" style={{ color: "var(--second-color)" }}>Currency</span>
                  <span className="ml-auto text-sm text-gray-400 font-medium">EGP</span>
                  <ChevronRight size={15} className="text-gray-300 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>

                {/* Language */}
                <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(39,34,98,0.08)" }}>
                    <Globe size={18} style={{ color: "var(--second-color)" }} />
                  </div>
                  <span className="font-semibold text-[15px]" style={{ color: "var(--second-color)" }}>Language</span>
                  <span className="ml-auto text-sm text-gray-400 font-medium capitalize">
                    {currentLanguage?.name ?? "English"}
                  </span>
                  <ChevronRight size={15} className="text-gray-300 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>

                {/* Support */}
                <Link
                  href={lp("/contact")}
                  onClick={closeMenu}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(39,34,98,0.08)" }}>
                    <HelpCircle size={18} style={{ color: "var(--second-color)" }} />
                  </div>
                  <span className="font-semibold text-[15px]" style={{ color: "var(--second-color)" }}>Support</span>
                  <ChevronRight size={15} className="ml-auto text-gray-300 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>

                <div className="pb-8" />
              </div>

              {/* Footer CTA */}
              <div className="px-5 py-4 border-t border-gray-100 bg-white">
                <Link
                  href={lp("/tailor-made")}
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-bold text-[15px] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "var(--main-color)" }}
                >
                  <Phone size={16} />
                  Plan Your Egypt Trip
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
