import RoavioAboutSection from "@/components/home/about";
import TravelServicesSection from "@/components/home/services";
import PartnersMarquee from "@/components/home/partners";
import type { WhyChooseSection } from "@/lib/api/homeTypes";
import Link from "next/link";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border border-gray-200">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href={locale === "en" ? "/" : `/${locale}`} className="hover:text-[var(--main-color)]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-navy font-medium">About us</span>
          </nav>
        </div>
      </div>

      <RoavioAboutSection />

      <TravelServicesSection whyChooseSection={null} />

      <PartnersMarquee />
    </>
  );
}
