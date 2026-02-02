"use client";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
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

export function Footer() {
  const { data, loading, error } = useGeneralData();

  if (loading) {
    return (
      <footer className="border-t bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          looooading
        </div>
      </footer>
    );
  }

  else if (error || !data) {
    return (
      <footer className="border-t bg-[url(/assets/images/footer-bg.webp)]">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Column 1 */}
            <div className="space-y-5 lg:col-span-1">
              <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                <Image
                  src="/assets/images/egypt-tour-gate-logo.png"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-7 w-auto"
                />
              </Link>
  
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover the wonders of ancient Egypt with expertly curated tours
                to the Pyramids, Nile cruises, and historic temples.
              </p>
  
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Cairo, Egypt</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+20 2 1234 5678</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>info@egypttourgaten.com</span>
                </div>
              </div>
            </div>
  
            {/* Column 2 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider">
                Egypt Day Tours
              </h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Cairo</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Luxor</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Hurghada</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Aswan</Link></li>
              </ul>
            </div>
  
            {/* Column 3 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider">
                Egypt Tour Packages
              </h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Classic Packages</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Luxury Tours</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Family Trips</Link></li>
              </ul>
            </div>
  
            {/* Column 4 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider">
                Nile Cruises
              </h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Luxor & Aswan</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Lake Nasser</Link></li>
              </ul>
            </div>
          </div>
  
          {/* Bottom */}
          <div className="mt-12 border-t border-border pt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Egypt Tour Gate. All rights reserved.
            </p>
  
            <div className="flex items-center gap-5">
              {["facebook", "instagram", "twitter", "youtube"].map((s) => (
                <Link
                  key={s}
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={s}
                >
                  <span className="sr-only">{s}</span>
                  {/* نفس الـ SVGs بتوعك */}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }
  
  return (
    <footer className="border-t bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5 lg:col-span-1">
            <h3 className="text-2xl font-bold text-primary">
              {" "}
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center space-x-3 rtl:space-x-reverse"
              >
                <Image
                  src="/assets/images/egypt-tour-gate-logo.png"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-7 w-auto"
                />
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover the wonders of ancient Egypt with expertly curated tours
              to the Pyramids, Nile cruises, and historic temples.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{data.footer.site_address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+20 2 1234 5678</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@nilevoyages.com</span>
              </div>
            </div>
          </div>

{data.footer.footerCategories.map((category) => (
  <div key={category.id} className="space-y-4">
    <h4 className="text-sm font-semibold uppercase tracking-wider">
      {category.name.en}
    </h4>

    <ul className="space-y-3 text-sm">
      {category.children.map((child) => (
        <li key={child.id}>
          <Link
            href={`/${category.slug}/${child.slug}`}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {child.name.en}
          </Link>
        </li>
      ))}
    </ul>
  </div>
))}

        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} {data.footer.copy_rights}
          </p>
          {/* social icons */}
          <div className="flex gap-4">
        {socialData.map((item, index) => (
          <SimpleSocialIcon
            key={index}
            item={item}
            className="text-1xl text-[var(--second-color)] hover:text-[var(--main-color)]"
          />
        ))}
      </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
