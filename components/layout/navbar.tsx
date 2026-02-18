"use client";

import { useEffect, useState } from "react";
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

// Map category slugs to icons
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

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | number | null>(null);

  const { data, error, loading } = useGeneralData();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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
        @keyframes slideUp {
          from { max-height: 400px; opacity: 1; }
          to   { max-height: 0;    opacity: 0; }
        }

        .mobile-overlay {
          animation: fadeInOverlay 0.28s ease forwards;
        }
        .mobile-drawer {
          animation: slideInLeft 0.32s cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }
        .submenu-open {
          animation: slideDown 0.28s ease forwards;
          overflow: hidden;
        }

        /* Nav item hover underline */
        .nav-link-underline {
          position: relative;
        }
        .nav-link-underline::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--main-color);
          transition: width 0.25s ease;
        }
        .nav-link-underline:hover::after { width: 100%; }
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
                <span className="hidden md:inline font-medium">Call Free :</span>
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
                <Image src="https://flagcdn.com/w40/us.png" alt="ENG" width={16} height={16} className="rounded-full" />
                <span className="hidden md:inline">ENG</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                <div className="lang-menu">
                  <Link href="/" className="lang-item"><Image src="https://flagcdn.com/w40/us.png" alt="English" width={20} height={20} className="lang-flag" />English</Link>
                  <Link href="/" className="lang-item"><Image src="https://flagcdn.com/w40/fr.png" alt="Français" width={20} height={20} className="lang-flag" />Français</Link>
                  <Link href="/" className="lang-item"><Image src="https://flagcdn.com/w40/de.png" alt="Deutsch" width={20} height={20} className="lang-flag" />Deutsch</Link>
                  <Link href="/" className="lang-item"><Image src="https://flagcdn.com/w40/eg.png" alt="Arabic" width={20} height={20} className="lang-flag" />العربية</Link>
                </div>
              </div>
              <div className="flex items-center gap-1 pl-4 cursor-pointer text-[var(--second-color)]">
                <span className="hidden md:inline">USD</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== MAIN NAV ===== */}
        <nav className={`w-full z-50 border-gray-200 transition-all duration-300 ${isScrolled ? "fixed top-0 bg-white shadow-xl" : "relative bg-white"}`}>
          <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
            <Link href="/">
              <Image src="/assets/images/egypt-tour-gate-logo.png" alt="Egypt Tour Gate" width={70} height={30} />
            </Link>
            <div className="flex items-center gap-3 md:order-2">
              <Link href="/tailor-made" className="btn-effect hidden md:block">Get started</Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex flex-col gap-[5px] p-2 group"
                aria-label="Open menu"
              >
                <span className="block w-6 h-0.5 bg-[var(--second-color)] transition-all duration-300"></span>
                <span className="block w-4 h-0.5 bg-[var(--second-color)] transition-all duration-300 group-hover:w-6"></span>
                <span className="block w-6 h-0.5 bg-[var(--second-color)] transition-all duration-300"></span>
              </button>
            </div>
            <ul className="hidden md:flex gap-8 font-medium navbar-main">
              <li><Link href="/">Home</Link></li>
              {data.header.headerCategories.map((cat) => (
                <li key={cat.id} className="relative group has-dropdown">
                  <Link href={`/${cat.slug}`} className="flex items-center gap-1 nav-link-underline">
                    {cat.name.en.toLowerCase()}
                    <ChevronDown className="h-4 w-4" />
                  </Link>
                  {cat.children.length > 0 && (
                    <ul className="absolute left-0 top-4 hidden min-w-[200px] bg-white shadow-lg group-hover:block rounded-sm overflow-hidden">
                      {cat.children.map((child) => (
                        <li key={child.id}>
                          <Link href={`/${cat.slug}/${child.slug}`} className="block px-4 py-2 text-sm hover:bg-gray-100">
                            {child.name.en.toLowerCase()}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="relative group has-dropdown">
                <span className="cursor-pointer flex items-center gap-1 nav-link-underline">
                  Static Pages <ChevronDown className="h-4 w-4" />
                </span>
                <ul className="absolute left-0 top-4 hidden bg-white shadow-lg group-hover:block rounded-sm overflow-hidden">
                  <li><Link href="/contact" className="block px-4 py-2">Contact</Link></li>
                  <li><Link href="/about-us" className="block px-4 py-2">About Us</Link></li>
                  <li><Link href="/free-page" className="block px-4 py-2">Free Page</Link></li>
                </ul>
              </li>
              <li><Link href="/blogs">Blogs</Link></li>
            </ul>
          </div>
        </nav>

        {/* ===== MOBILE DRAWER ===== */}
        {mobileOpen && (
          <div className="fixed inset-0 z-[999] md:hidden mobile-overlay" style={{ backgroundColor: "rgba(0,0,0,0.55)" }} onClick={closeMenu}>
            <div
              className="mobile-drawer absolute left-0 top-0 h-full w-[88%] max-w-[360px] bg-white flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ background: "var(--second-color)" }}>
                <Image src="/assets/images/egypt-tour-gate-logo.png" alt="Egypt Tour Gate" width={60} height={26} className="brightness-0 invert" />
                <button
                  onClick={closeMenu}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:bg-white/20"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Login CTA */}
              {/* <div className="px-5 py-4 border-b border-gray-100" style={{ background: "#f9f9f9" }}>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--second-color)" }}>
                    <User size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--second-color)" }}>Log in or sign up</p>
                    <p className="text-xs text-gray-500">Access your bookings & wishlist</p>
                  </div>
                  <ChevronRight size={16} className="ml-auto text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div> */}

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">

                {/* Explore section */}
                <div className="px-5 pt-5 pb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Explore</p>
                </div>

                {/* Home */}
                <Link
                  href="/"
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
                {data.header.headerCategories.map((cat, idx) => (
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

                    {/* Subcategories */}
                    {activeDropdown === cat.id && cat.children.length > 0 && (
                      <div className="submenu-open bg-gray-50 border-l-2 ml-5" style={{ borderColor: "var(--main-color)" }}>
                        {cat.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/${cat.slug}/${child.slug}`}
                            onClick={closeMenu}
                            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition-colors group"
                          >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--main-color)" }}></span>
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
                  href="/blogs"
                  onClick={closeMenu}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(39,34,98,0.08)" }}>
                    <BookOpen size={18} style={{ color: "var(--second-color)" }} />
                  </div>
                  <span className="font-semibold text-[15px]" style={{ color: "var(--second-color)" }}>Blogs</span>
                  <ChevronRight size={15} className="ml-auto text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>

                {/* Static pages */}
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
                      {[{ href: "/contact", label: "Contact" }, { href: "/about-us", label: "About Us" }, { href: "/free-page", label: "Free Page" }].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition-colors group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--main-color)" }}></span>
                          <span className="text-[14px] text-gray-700 group-hover:text-[var(--second-color)] transition-colors font-medium">{item.label}</span>
                          <ChevronRight size={13} className="ml-auto text-gray-300 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="mx-5 my-4 border-t border-gray-100"></div>

                {/* Settings section */}
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
                  href="/contact"
                  onClick={closeMenu}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(39,34,98,0.08)" }}>
                    <HelpCircle size={18} style={{ color: "var(--second-color)" }} />
                  </div>
                  <span className="font-semibold text-[15px]" style={{ color: "var(--second-color)" }}>Support</span>
                  <ChevronRight size={15} className="ml-auto text-gray-300 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>

                {/* Download app */}
                {/* <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(39,34,98,0.08)" }}>
                    <Smartphone size={18} style={{ color: "var(--second-color)" }} />
                  </div>
                  <span className="font-semibold text-[15px]" style={{ color: "var(--second-color)" }}>Download the app</span>
                  <ChevronRight size={15} className="ml-auto text-gray-300 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div> */}

                {/* Bottom padding */}
                <div className="pb-8"></div>
              </div>

              {/* Footer CTA */}
              <div className="px-5 py-4 border-t border-gray-100 bg-white">
                <Link
                  href="/tailor-made"
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
