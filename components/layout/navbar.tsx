"use client";

import { useEffect, useState, useRef } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { type SupportedLanguage } from "@/lib/mock/i18n-data";
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
  LogIn,
  CircleDollarSign,
  Globe,
  Bell,
  Sun,
  HelpCircle,
  Smartphone,
  Map,
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
import SimpleSocialIcon, {
  SocialItem,
} from "@/components/layout/simpleSocialIcon";

/* Social */
const socialData: SocialItem[] = [
  { icon: "fa-brands fa-facebook-f", url: "https://facebook.com", title: "Facebook" },
  { icon: "fa-brands fa-instagram", url: "https://instagram.com", title: "Instagram" },
  { icon: "fa-brands fa-x-twitter", url: "https://twitter.com", title: "Twitter" },
  { icon: "fa-brands fa-youtube", url: "https://youtube.com", title: "YouTube" },
];

// Map category slugs to icons and descriptions
function getCategoryIcon(slug: string) {
  const map: Record<string, React.ReactNode> = {
    "egypt-day-tours": <Compass size={20} />,
    "egypt-tour-packages": <Map size={20} />,
    "nile-cruises": <Ship size={20} />,
    "beach-tours": <Palmtree size={20} />,
    "photography-tours": <Camera size={20} />,
  };
  return map[slug] ?? <Sparkles size={20} />;
}

function getCategoryDescription(slug: string) {
  const map: Record<string, string> = {
    "egypt-day-tours": "Explore iconic sites in a single day with expert guides",
    "egypt-tour-packages": "Complete multi-day itineraries across Egypt",
    "nile-cruises": "Sail the legendary Nile River in style & comfort",
    "beach-tours": "Pristine Red Sea beaches and coastal adventures",
    "photography-tours": "Capture Egypt's beauty through a professional lens",
  };
  return map[slug] ?? "Discover unforgettable experiences across Egypt";
}

function getCategoryColor(slug: string) {
  const map: Record<string, string> = {
    "egypt-day-tours": "#e3b75e",
    "egypt-tour-packages": "#272262",
    "nile-cruises": "#1e6fa5",
    "beach-tours": "#27a06e",
    "photography-tours": "#a0522d",
  };
  return map[slug] ?? "#e3b75e";
}

// Featured highlights shown inside mega menu
const featuredHighlights = [
  {
    title: "Pyramids of Giza",
    tag: "Most Popular",
    img: "/assets/images/tours/camel front of giza pyramids.jpg",
    href: "/egypt-day-tours/cairo",
  },
  {
    title: "Nile Cruise Package",
    tag: "Best Value",
    img: "/assets/images/tours/49-webp.webp",
    href: "/nile-cruises/luxor-aswan-nile-crusie",
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | number | null>(null);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | number | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const { t, language, languages, setLanguage } = useI18n();

  const { data, error, loading } = useGeneralData();

  const selectedLanguage = languages.find((option) => option.code === language) ?? languages[0];

  const handleLanguageChange = (languageCode: SupportedLanguage) => {
    setLanguage(languageCode);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMenu = () => {
    setMobileOpen(false);
    setActiveDropdown(null);
  };

  if (loading) {
    return (
      <nav className="w-full bg-white p-4">
        <Image
          src="/assets/images/egypt-tour-gate-logo.png"
          alt="Egypt Tour Gate"
          width={70}
          height={30}
        />
      </nav>
    );
  }

  if (error || !data) {
    return <div>Error loading navbar</div>;
  }

  return (
    <>
      <style jsx global>{`
        /* ---- Mobile Menu Animations ---- */
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

        /* ---- Desktop: nav underline ---- */
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

        /* ---- Simple dropdown (Static Pages) ---- */
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

        /* ---- Mega menu ---- */
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
        .mega-cat-card .cat-icon-wrap {
          transition: all 0.2s ease;
        }
        .mega-cat-card:hover .cat-icon-wrap {
          transform: scale(1.1);
        }
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

        /* Nav item active indicator dot */
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
      `}</style>

      <header>
        {/* ===== TOP BAR ===== */}
        <div className="topbar-wrapper">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-2 text-sm text-white">
            <div className="flex items-center">
              <div className="flex items-center gap-2 pr-4 border-r border-white/20">
                {socialData.map((item, index) => (
                  <SimpleSocialIcon
                    key={index}
                    item={item}
                    className="text-[var(--second-color)] hover:text-[var(--main-color)] transition"
                  />
                ))}
              </div>
              <Link
                href="tel:+201110008407"
                className="flex items-center gap-2 pl-4 text-[var(--second-color)] hover:text-[var(--main-color)] transition"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden md:inline font-medium">{t("navbar.callFree")}</span>
                <span className="hidden lg:inline">+201110008407</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                href="mailto:info@example.com"
                className="flex items-center gap-2 pr-4 border-r border-white/20 text-[var(--second-color)] hover:text-[var(--main-color)] transition"
              >
                <Mail className="h-4 w-4" />
                <span className="hidden lg:inline font-medium">info@example.com</span>
              </Link>
              <div className="relative group flex items-center gap-1 px-4 border-r border-white/20 cursor-pointer text-[var(--second-color)]">
                {selectedLanguage ? (
                  <>
                    <Image src={selectedLanguage.flag} alt={selectedLanguage.label} width={16} height={16} className="rounded-full" />
                    <span className="hidden md:inline">{selectedLanguage.shortLabel}</span>
                  </>
                ) : (
                  <span className="hidden md:inline">{language.toUpperCase()}</span>
                )}
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                <div className="lang-menu">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      className="lang-item w-full"
                      onClick={() => void handleLanguageChange(language.code)}
                    >
                      <Image src={language.flag} alt={language.label} width={20} height={20} className="lang-flag" />
                      {language.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 pl-4 cursor-pointer text-[var(--second-color)]">
                <span className="hidden md:inline">{t("navbar.currency")}</span>
                <ChevronDown className="h-4 w-4" />
              </div>
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
          <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-2">
            {/* Logo */}
            <Link href={localizePath("/")}>
              <Image
                src="/assets/images/egypt-tour-gate-logo.png"
                alt="Egypt Tour Gate"
                width={70}
                height={30}
              />
            </Link>

            {/* Right: CTA + Hamburger */}
            <div className="flex items-center gap-3 md:order-2">
              <Link href="/tailor-made" className="btn-effect hidden md:block">
                {t("navbar.getStarted")}
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex flex-col gap-[5px] p-2 group"
                aria-label={t("navbar.menu")}
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
                  href={localizePath("/")}
                  className="px-3 py-2 rounded-md text-[var(--second-color)] hover:text-[var(--main-color)] transition-colors duration-200 text-[14.5px] font-semibold nav-link-underline"
                >
                  {t("navbar.home")}
                </Link>
              </li>

              {/* ===== CATEGORY MEGA MENUS ===== */}
              {data.header.headerCategories.map((cat) => {
                const isOpen = activeMegaMenu === cat.id;
                const hasSubs = cat.children.length > 0;
                const catColor = getCategoryColor(cat.slug);

                return (
                  <li
                    key={cat.id}
                    className={`relative py-4 ${isOpen ? "menu-open" : ""}`}
                    onMouseEnter={() => setActiveMegaMenu(cat.id)}
                    onMouseLeave={() => setActiveMegaMenu(null)}
                  >
                    <Link
                      href={localizePath(`/${cat.slug}`)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-md text-[14.5px] font-semibold transition-all duration-200 nav-link-underline capitalize ${
                        isOpen
                          ? "text-[var(--main-color)]"
                          : "text-[var(--second-color)] hover:text-[var(--main-color)]"
                      }`}
                    >
                      {cat.name.en.toLowerCase()}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-[var(--main-color)]" : ""}`}
                      />
                    </Link>

                    {/* Active dot indicator */}
                    <span className="nav-active-dot" />

                    {/* ===== MEGA MENU PANEL ===== */}
                    {hasSubs && isOpen && (
                      <div
                        className="mega-menu absolute top-full left-1/2 -translate-x-1/2 z-[200]"
                        style={{ minWidth: "780px" }}
                      >
                        {/* Top connector gap cover */}
                        <div className="h-2 w-full" />

                        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(39,34,98,0.14)] border border-gray-100 overflow-hidden">
                          {/* Colored top accent bar */}
                          <div
                            className="h-1 w-full"
                            style={{ background: `linear-gradient(90deg, ${catColor}, var(--main-color))` }}
                          />

                          <div className="flex">
                            {/* LEFT: Category cards */}
                            <div className="flex-1 p-6">
                              {/* Header */}
                              <div className="flex items-center gap-3 mb-5">
                                <div
                                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                                  style={{ background: catColor }}
                                >
                                  {getCategoryIcon(cat.slug)}
                                </div>
                                <div>
                                  <h3 className="font-bold text-[var(--second-color)] text-[15px] capitalize leading-tight">
                                    {cat.name.en}
                                  </h3>
                                  <p className="text-xs text-gray-400 leading-tight mt-0.5">
                                    {getCategoryDescription(cat.slug)}
                                  </p>
                                </div>
                                <Link
                                  href={localizePath(`/${cat.slug}`)}
                                  className="ml-auto flex items-center gap-1 text-xs font-bold whitespace-nowrap px-3 py-1.5 rounded-full border transition-all duration-200 hover:text-white"
                                  style={{
                                    color: catColor,
                                    borderColor: catColor,
                                  }}
                                  onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.background = catColor;
                                    (e.currentTarget as HTMLElement).style.color = "#fff";
                                  }}
                                  onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.background = "transparent";
                                    (e.currentTarget as HTMLElement).style.color = catColor;
                                  }}
                                >
                                  View all
                                  <ArrowRight size={12} />
                                </Link>
                              </div>

                              {/* Subcategory grid */}
                              <div className="grid grid-cols-2 gap-2">
                                {cat.children.map((child) => (
                                  <Link
                                    key={child.id}
                                    href={localizePath(`/${cat.slug}/${child.slug}`)}
                                    className="mega-cat-card flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/60 group/card"
                                  >
                                    {/* Icon */}
                                    <div
                                      className="cat-icon-wrap w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10"
                                      style={{ background: `${catColor}18` }}
                                    >
                                      <span style={{ color: catColor }} className="text-sm">
                                        {getCategoryIcon(cat.slug)}
                                      </span>
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0 relative z-10">
                                      <span className="block text-[13px] font-semibold text-[var(--second-color)] capitalize truncate leading-tight">
                                        {child.name.en.toLowerCase()}
                                      </span>
                                    </div>

                                    {/* Arrow */}
                                    <ChevronRight
                                      size={14}
                                      className="cat-arrow flex-shrink-0 relative z-10"
                                      style={{ color: catColor }}
                                    />
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* DIVIDER */}
                            <div className="w-px bg-gray-100 my-4" />

                            {/* RIGHT: Featured highlights */}
                            <div className="w-[220px] flex-shrink-0 p-5 bg-gray-50/50">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                                Featured
                              </p>
                              <div className="flex flex-col gap-3">
                                {featuredHighlights.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={localizePath(item.href)}
                                    className="featured-card block group/feat"
                                  >
                                    <div className="relative h-[100px] w-full overflow-hidden rounded-xl">
                                      <Image
                                        src={item.img}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                      {/* Tag */}
                                      <span
                                        className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                                        style={{ background: catColor }}
                                      >
                                        {item.tag}
                                      </span>
                                      {/* Title */}
                                      <p className="absolute bottom-2 left-2 right-2 text-white text-[12px] font-bold leading-tight">
                                        {item.title}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>

                              {/* Bottom promo */}
                              <div
                                className="mt-4 p-3 rounded-xl text-center"
                                style={{ background: `${catColor}15`, border: `1px dashed ${catColor}60` }}
                              >
                                <Star size={14} className="mx-auto mb-1" style={{ color: catColor }} />
                                <p className="text-[11px] font-bold text-[var(--second-color)] leading-tight">
                                  Tailor-made tours available
                                </p>
                                <Link
                                  href={localizePath("/tailor-made")}
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

              {/* ===== STATIC PAGES: Improved simple dropdown ===== */}
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
                  {t("navbar.staticPages")}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${activeMegaMenu === "static" ? "rotate-180" : ""}`}
                  />
                </span>
                <span className="nav-active-dot" />

                {activeMegaMenu === "static" && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full z-[200]">
                    <div className="h-2 w-full" />
                    <div className="simple-dropdown bg-white rounded-2xl shadow-[0_16px_48px_rgba(39,34,98,0.12)] border border-gray-100 overflow-hidden min-w-[200px]">
                      {/* Top accent */}
                      <div className="h-1 w-full bg-gradient-to-r from-[var(--second-color)] to-[var(--main-color)]" />
                      <div className="py-2">
                        {[
                          { href: "/contact", label: "Contact Us", icon: <Phone size={14} /> },
                          { href: "/about-us", label: "About Us", icon: <User size={14} /> },
                          { href: "/free-page", label: "Free Page", icon: <Sparkles size={14} /> },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={localizePath(item.href)}
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
                  href={localizePath("/blogs")}
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
                <Image
                  src="/assets/images/egypt-tour-gate-logo.png"
                  alt="Egypt Tour Gate"
                  width={60}
                  height={26}
                  className="brightness-0 invert"
                />
                <button
                  onClick={closeMenu}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:bg-white/20"
                  aria-label={t("navbar.closeMenu")}
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
                  href={localizePath("/")}
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
                {data.header.headerCategories.map((cat) => (
                  <div key={cat.id}>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === cat.id ? null : cat.id)}
                      className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group text-left"
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                        style={{
                          background: activeDropdown === cat.id
                            ? "var(--main-color)"
                            : "rgba(39,34,98,0.08)"
                        }}
                      >
                        <span style={{ color: activeDropdown === cat.id ? "#fff" : "var(--second-color)" }}>
                          {getCategoryIcon(cat.slug)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-[15px] capitalize" style={{ color: "var(--second-color)" }}>
                          {cat.name.en}
                        </span>
                        {cat.children.length > 0 && (
                          <span className="block text-xs text-gray-400">{cat.children.length} subcategories</span>
                        )}
                      </div>
                      <ChevronDown
                        size={16}
                        className="text-gray-400 flex-shrink-0 transition-transform duration-300"
                        style={{ transform: activeDropdown === cat.id ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </button>

                    {activeDropdown === cat.id && cat.children.length > 0 && (
                      <div className="submenu-open bg-gray-50 border-l-2 ml-5" style={{ borderColor: "var(--main-color)" }}>
                        {cat.children.map((child) => (
                          <Link
                            key={child.id}
                            href={localizePath(`/${cat.slug}/${child.slug}`)}
                            onClick={closeMenu}
                            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition-colors group"
                          >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--main-color)" }} />
                            <span className="text-[14px] text-gray-700 capitalize group-hover:text-[var(--second-color)] transition-colors font-medium">
                              {child.name.en}
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
                  href={localizePath("/blogs")}
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
                    <span className="font-semibold text-[15px]" style={{ color: "var(--second-color)" }}>{t("navbar.staticPages")}</span>
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
                          href={localizePath(item.href)}
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

                {/* Divider */}
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
                  <span className="ml-auto text-sm text-gray-400 font-medium">English</span>
                  <ChevronRight size={15} className="text-gray-300 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>

                {/* Support */}
                <Link
                  href={localizePath("/contact")}
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
                  href={localizePath("/tailor-made")}
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
