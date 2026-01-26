"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, ChevronDown, Heart } from "lucide-react";
import { useGeneralData } from "@/lib/api/GeneralApi";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data, error } = useGeneralData();
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

  if  (error || !data) {
    return (
      <header>
        <div className="topbar-wrapper">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 text-sm text-white">
        {/* Left */}
        <div className="flex items-center gap-2 text-[var(--second-color)]">
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
  <span>ENG</span>
  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />

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



        <div className="flex items-center gap-1 cursor-pointer">
        <span>USD</span>
        <ChevronDown className="h-4 w-4" />
        </div>


        <div className="relative flex items-center gap-2">
        <Heart />
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-black">
         
        0
        </span>
        </div>
        </div>
        </div>
        </div>
      <nav
      className={`w-full z-50 transition-all duration-300
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
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft"
            >
              <span className="sr-only">Open main menu</span>
              ☰
            </button>
          </div>
  
          {/* Menu */}
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
            <ul className="flex flex-col md:flex-row md:space-x-8 font-medium navbar-main">
  
              <li>
                <Link
                  href="/"
                  className="block py-1 px-3  hover:text-[var(--main-color)] duration-300 ease-in"
                >
                  Home
                </Link>
              </li>
  
              <li className="relative group has-dropdown">
                <Link href="/tours" className="relative py-1 pb-2 px-3 cursor-default flex items-center hover:text-[var(--main-color)] duration-300 ease-in">
                  Egypt Tours 
                  <ChevronDown  size={16} />
                </Link>
                <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-base min-w-[200px] rounded-md">
                  <li>
                    <Link href="/tours" className="block px-4 py-2 text-sm hover:text-[var(--main-color)] duration-300 ease-in">
                      Classic Tours
                    </Link>
                  </li>
                  <li>
                    <Link href="/tours" className="block px-4 py-2 text-sm hover:text-[var(--main-color)] duration-300 ease-in">
                      Luxury Tours
                    </Link>
                  </li>
                </ul>
              </li>
  
              <li>
                <Link href="/tours" className="block py-1 px-3 hover:text-[var(--main-color)] duration-300 ease-in">
                  Packages
                </Link>
              </li>
  
              <li>
                <Link href="/contact" className="block py-1 px-3 hover:text-[var(--main-color)] duration-300 ease-in">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      </header>
    );
  }
  

  return (
    <nav
        className={`w-full z-50 transition-all duration-300
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
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft"
          >
            <span className="sr-only">Open main menu</span>☰
          </button>
        </div>

        {/* Menu */}
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col md:flex-row md:space-x-8 font-medium">
            {data &&
              data.header.headerCategories.map((category) => (
                <li key={category.id} className="relative group capitalize">
                  <Link
                    href={`/${category.slug}`}
                    className="block py-2 px-3 capitalize hover:text-fg-brand"
                  >
                    {category.name.en.toLowerCase()}
                  </Link>

                  {/* Dropdown */}
                  {category.children.length > 0 && (
                    <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-base min-w-[200px]">
                      {category.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/${category.slug}/${child.slug}`}
                            className="block px-4 py-2 text-sm text-heading hover:bg-neutral-tertiary"
                          >
                            {child.name.en.toLowerCase()}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            <li>
              <Link
                href="/contact"
                className="block px-4 py-2 text-sm text-heading hover:bg-neutral-tertiary"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
