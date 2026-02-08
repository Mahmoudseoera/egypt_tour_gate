"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, ChevronDown } from "lucide-react";
import { useGeneralData } from "@/lib/api/GeneralApi";
import SimpleSocialIcon, { SocialItem } from '@/components/layout/simpleSocialIcon';
// بيانات من API
const socialData: SocialItem[] = [
  {
    icon: "fa-brands fa-facebook-f",
    url: "https://facebook.com",
    title: "Facebook"
  },
  {
    icon: "fa-brands fa-instagram",
    url: "https://instagram.com",
    title: "Instagram"
  },
  {
    icon: "fa-brands fa-x-twitter",
    url: "https://twitter.com",
    title: "Twitter"
  },
  {
    icon: "fa-brands fa-youtube",
    url: "https://youtube.com",
    title: "YouTube"
  }
];


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const { data, error, loading } = useGeneralData();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Show loading state or error fallback
  if (loading) { 
    return (
      <nav className="w-full z-50 relative bg-white">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image
              src="/assets/images/egypt-tour-gate-logo.png"
              alt="Egypt Tour Gate Logo"
              width={70}
              height={30}
            />
          </Link>
        </div>
      </nav>
    );
  }

  // Debug logging
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 Navbar State:", { loading, error, hasData: !!data, data });
  }

  if (error || !data) {
    // Show error message in development
    const errorMessage = error || "No data received from API";
    if (process.env.NODE_ENV === "development") {
      console.error("❌ Navbar Error:", errorMessage);
    }

    return (
      <div className="test">
           <h1>{errorMessage}</h1>
         </div>
    );
  }

  return (
    <header>
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
      <nav
        className={`w-full z-50 border-gray-200 transition-all duration-300
        ${isScrolled ? "fixed top-0 bg-white shadow-xl" : "relative bg-white"}
        `}
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image
              src="/assets/images/egypt-tour-gate-logo.png"
              alt="Egypt Tour Gate Logo"
              width={70}
              height={30}
            />
          </Link>

          {/* CTA + Mobile button */}
          <div className="flex md:order-2 space-x-3 rtl:space-x-reverse">
            <Link href="/tailor-made" className="btn-effect">
              Get started
            </Link>


            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center p-2 w-10 h-10 justify-center md:hidden"
            >
              ☰
            </button>
          </div>

          {/* Menu */}
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
            <ul className="flex flex-col md:flex-row md:space-x-8 font-medium navbar-main">
              <Link
                href="/"
                className="block py-2 px-3 capitalize hover:text-fg-brand"
              >
                Home
              </Link>
              {data &&
                data.header.headerCategories.map((category) => (
                  <li key={category.id} className="relative group capitalize has-dropdown">
                    <Link
                      href={`/${category.slug}`}
                      className="block py-2 px-3 capitalize hover:text-fg-brand"

                    >
                      {category.name.en.toLowerCase()}{" "}<ChevronDown className="inline h-4 w-4" />
                    </Link>
                    {/* Dropdown */}
                    {category.children.length > 0 && (
                      <ul className="absolute left-0 top-full hidden group-hover:[var(--main-color)] bg-white shadow-lg rounded-sm min-w-[200px]">
                        {category.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/${category.slug}/${child.slug}`}
                              className="block px-4 py-2 text-sm text-heading hover:bg-neutral-tertiary"
                            >
                              {child.name.en.toLowerCase()}{" "}
                            </Link>
                          </li>
                        ))}{" "}
                      </ul>
                    )}{" "}
                  </li>
                ))}
              <li className="relative group capitalize has-dropdown">
                <Link
                  href="/#"
                  className="block py-2 px-3 capitalize hover:text-fg-brand"
                >
                  Static Pages
                </Link>
                  <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-sm min-w-[200px]">
                    <li>
                      <Link
                        href="/contact"
                        className='block py-2 px-3 capitalize hover:text-fg-brand'
                      >
                        contact
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about-us"
                        className='block py-2 px-3 capitalize hover:text-fg-brand'
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/free-page"
                        className='block py-2 px-3 capitalize hover:text-fg-brand'
                      >
                        Free Page
                      </Link>
                    </li>
                  </ul>
              </li>

              <li>
                <Link
                  href="/blogs"
                  className='block py-2 px-3 capitalize hover:text-fg-brand'
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
            {/* Mobile Menu */}
    {mobileOpen && (
      <div className="fixed inset-0 z-[999] bg-black/40 md:hidden">
        
        {/* Drawer */}
        <div className="absolute left-0 top-0 h-full w-[85%] bg-white p-6 overflow-y-auto">
          
          {/* Close */}
          <button
            onClick={() => {
              setMobileOpen(false);
              setActiveDropdown(null);
            }}
            className="mb-6 text-xl mr-auto"
          >
            ✕
          </button>

          <ul className="space-y-4">
            
            <li>
              <Link href="/" onClick={() => setMobileOpen(false)}>
                Home
              </Link>
            </li>

            {data?.header.headerCategories.map((category) => (
              <li key={category.id}>
                
                {/* Parent */}
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === category.id ? null : category.id
                    )
                  }
                  className="flex w-full items-center justify-between"
                >
                  <span>{category.name.en.toLowerCase()}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform
                    ${activeDropdown === category.id ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Children */}
                {activeDropdown === category.id && (
                  <ul className="mt-3 ml-4 space-y-2">
                    {category.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/${category.slug}/${child.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block text-sm"
                        >
                          {child.name.en.toLowerCase()}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            {/* Static pages */}
            <li className="relative group capitalize">
                <span
                  
                  className="block py-2 px-3 capitalize hover:text-fg-brand"
                >
                  Static Pages
                </span>
                  <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-sm min-w-[200px]">
                    <li>
                      <Link
                        href="/contact"
                        className='block py-2 px-3 capitalize hover:text-fg-brand'
                      >
                        contact
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about-us"
                        className='block py-2 px-3 capitalize hover:text-fg-brand'
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/free-page"
                        className='block py-2 px-3 capitalize hover:text-fg-brand'
                      >
                        Free Page
                      </Link>
                    </li>
                  </ul>
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
