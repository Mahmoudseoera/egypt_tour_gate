"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, ChevronDown } from "lucide-react";
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

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | number | null>(null);

  const { data, error, loading } = useGeneralData();

  /* Scroll */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header>
      {/* ================= TOP BAR ================= */}
      <div className="topbar-wrapper">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-6 py-2 text-sm text-white md:flex-row md:items-center md:justify-between">
      {/* Left */}
      <div className="flex flex-wrap items-center  gap-3 text-[var(--second-color)] justify-between md:justify-center lg:justify-center">
      {/* social icons */}
          <div className="flex gap-1 md:gap-2 lg:gap-4">
        {socialData.map((item, index) => (
          <SimpleSocialIcon
            key={index}
            item={item}
            className="text-1xl text-[var(--second-color)] hover:text-[var(--main-color)]"
          />
        ))}
      </div>
            <Link href="tel:+201110008407" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="font-medium">Call Free :</span>
              <span>+201110008407</span>
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[var(--second-color)]">
              <Mail className="h-4 w-4" />
              <span>Email :</span>
              <span className="font-medium">info@example.com</span>
            </div>

            <div className="relative group flex items-center gap-1 cursor-pointer">
              {/* Selected language */}
              <Image
                src="https://flagcdn.com/w40/us.png"
                alt="ENG"
                width={16}
                height={16}
                className="rounded-full"
              />
              <span className="text-[var(--second-color)]">ENG</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />{" "}
              {/* Dropdown */}
              <div className="lang-menu">
                <Link href="/" className="lang-item">
                  <Image
                    src="https://flagcdn.com/w40/us.png"
                    alt="English"
                    width={20}
                    height={20}
                    className="lang-flag"
                  />
                  English
                </Link>

                <Link href="/" className="lang-item">
                  <Image
                    src="https://flagcdn.com/w40/fr.png"
                    alt="Français"
                    width={20}
                    height={20}
                    className="lang-flag"
                  />
                  Français
                </Link>

                <Link href="/" className="lang-item">
                  <Image
                    src="https://flagcdn.com/w40/de.png"
                    alt="Deutsch"
                    width={20}
                    height={20}
                    className="lang-flag"
                  />
                  Deutsch
                </Link>

                <Link href="/" className="lang-item">
                  <Image
                    src="https://flagcdn.com/w40/eg.png"
                    alt="Arabic"
                    width={20}
                    height={20}
                    className="lang-flag"
                  />
                  العربية
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-1 cursor-pointer text-[var(--second-color)]">
              <span>USD</span>
              <ChevronDown className="h-4 w-4" />
            </div>

            {/* <div className="relative flex items-center gap-2">
              <Heart />
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-black">
                0
              </span>
            </div> */}
          </div>
        </div>
      </div>

      {/* ================= MAIN NAV ================= */}
      <nav
        className={`w-full z-50 border-gray-200 transition-all duration-300
        ${isScrolled ? "fixed top-0 bg-white shadow-xl" : "relative bg-white"}
        `}
      >
        <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/assets/images/egypt-tour-gate-logo.png"
              alt="Egypt Tour Gate"
              width={70}
              height={30}
            />
          </Link>

          {/* CTA + burger */}
          <div className="flex items-center gap-3 md:order-2">
            <Link href="/tailor-made" className="btn-effect">
              Get started
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-2xl"
            >
              ☰
            </button>
          </div>

          {/* Desktop menu */}
          <ul className="hidden md:flex gap-8 font-medium">
            <li>
              <Link href="/">Home</Link>
            </li>

            {data.header.headerCategories.map((cat) => (
              <li key={cat.id} className="relative group">
                <Link href={`/${cat.slug}`} className="flex items-center gap-1">
                  {cat.name.en.toLowerCase()}
                  <ChevronDown className="h-4 w-4" />
                </Link>

                {cat.children.length > 0 && (
                  <ul className="absolute left-0 top-full hidden min-w-[200px] bg-white shadow-lg group-hover:block">
                    {cat.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/${cat.slug}/${child.slug}`}
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          {child.name.en.toLowerCase()}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            <li className="relative group">
              <span className="cursor-pointer flex items-center gap-1">
                Static Pages <ChevronDown className="h-4 w-4" />
              </span>
              <ul className="absolute left-0 top-full hidden bg-white shadow-lg group-hover:block">
                <li><Link href="/contact" className="block px-4 py-2">Contact</Link></li>
                <li><Link href="/about-us" className="block px-4 py-2">About Us</Link></li>
                <li><Link href="/free-page" className="block px-4 py-2">Free Page</Link></li>
              </ul>
            </li>

            <li>
              <Link href="/blogs">Blogs</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] bg-black/40 md:hidden">
          <div className="absolute left-0 top-0 h-full w-[85%] bg-white p-6 overflow-y-auto rounded-r-2xl">
            <button
              onClick={() => {
                setMobileOpen(false);
                setActiveDropdown(null);
              }}
              className="mb-6 text-xl"
            >
              ✕
            </button>

            <ul className="space-y-5">
              <li>
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  Home
                </Link>
              </li>

              {data.header.headerCategories.map((cat) => (
                <li key={cat.id}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/${cat.slug}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {cat.name.en.toLowerCase()}
                    </Link>

                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === cat.id ? null : cat.id
                        )
                      }
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          activeDropdown === cat.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {activeDropdown === cat.id && (
                    <ul className="mt-3 ml-4 space-y-2 border-l pl-4 text-sm text-gray-600">
                      {cat.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/${cat.slug}/${child.slug}`}
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.name.en.toLowerCase()}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}

              {/* Static pages mobile */}
              <li>
                <div className="flex items-center justify-between">
                  <Link
                    href="/about-us"
                    onClick={() => setMobileOpen(false)}
                  >
                    Static Pages
                  </Link>

                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === "static" ? null : "static"
                      )
                    }
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        activeDropdown === "static" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {activeDropdown === "static" && (
                  <ul className="mt-3 ml-4 space-y-2 border-l pl-4 text-sm text-gray-600">
                    <li><Link href="/contact">Contact</Link></li>
                    <li><Link href="/about-us">About Us</Link></li>
                    <li><Link href="/free-page">Free Page</Link></li>
                  </ul>
                )}
              </li>

              <li>
                <Link href="/blogs" onClick={() => setMobileOpen(false)}>
                  Blogs
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
