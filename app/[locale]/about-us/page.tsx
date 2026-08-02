// app/[locale]/about-us/page.tsx
// Server Component — fetches from the dedicated about-us endpoint.
// ✅ No dependency on homeApi / homeTypes.

import type { Metadata } from "next";
import Link from "next/link";
// import PartnersMarquee from "@/components/home/partners";
 import { getT } from "@/lib/hooks/getT";
import RoavioAboutSection from "@/components/about/about";
import TravelServicesSection from "@/components/about/services";
import { fetchAboutSections } from "@/lib/api/aboutApi";
import { aboutPageSchema, buildSeoMetadata } from "@/lib/seo";
import { fetchSeoFromEndpoint } from "@/lib/api/seoApi";
import AboutContent  from "@/components/about/about-content";
import SchemaScript from "@/components/seo/schema-script";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await fetchSeoFromEndpoint("about-us", locale);

  return buildSeoMetadata({
    seo,
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
  const t = await getT("about");
  const commonT = await getT("common");
  // ── Fetch from the dedicated about-us endpoint ───────────────────────────
  const sections = await fetchAboutSections(locale);
  const aboutData       = sections?.about_section       ?? null;
  const whyChooseData   = sections?.why_choose_section  ?? null;
  return (
    <>
      <SchemaScript schema={aboutPageSchema()} />
      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link
              href={locale === "en" ? "/" : `/${locale}`}
              className="hover:text-[var(--main-color)]"
            >
              {commonT("home")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-navy font-medium">{commonT("about")}</span>
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
