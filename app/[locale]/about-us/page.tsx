// app/[locale]/about-us/page.tsx
// Server Component — fetches from the dedicated about-us endpoint.
// ✅ No dependency on homeApi / homeTypes.

import type { Metadata } from "next";
import Link from "next/link";
// import PartnersMarquee from "@/components/home/partners";
import RoavioAboutSection from "@/components/about/about";
import TravelServicesSection from "@/components/about/services";
import { fetchAboutSections } from "@/lib/api/aboutApi";
import { buildSeoMetadata } from "@/lib/seo";
import AboutContent  from "@/components/about/about-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildSeoMetadata({
    title: "About Egypt Tours Gate",
    description:
      "Learn about Egypt Tours Gate, our expert local team, and our Egypt tours, travel packages, Nile cruises, and tailor-made trips.",
    path: "/about-us",
    locale,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // ── Fetch from the dedicated about-us endpoint ───────────────────────────
  const sections = await fetchAboutSections(locale);
  const aboutData       = sections?.about_section       ?? null;
  const whyChooseData   = sections?.why_choose_section  ?? null;
  return (
    <>
      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link
              href={locale === "en" ? "/" : `/${locale}`}
              className="hover:text-[var(--main-color)]"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-navy font-medium">About us</span>
          </nav>
        </div>
      </div>

      {/* ── About section ──────────────────────────────────────────────────── */}
      <RoavioAboutSection aboutData={aboutData} />

      {/* ── About content ──────────────────────────────────────────────────── */}
       <AboutContent aboutData={aboutData}/>

      {/* ── Services / Why-choose section ──────────────────────────────────── */}
      <TravelServicesSection whyChooseSection={whyChooseData} />

      {/* ── Partners marquee (no API data needed) ──────────────────────────── */}
      {/* <PartnersMarquee partners={partners} /> */}
    </>
  );
}
