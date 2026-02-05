
import RoavioAboutSection from "../../components/home/about";
import TravelServicesSection from "../../components/home/services";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
          {/* Breadcrumb */}
          <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[var(--main-color)]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-navy font-medium">
            About us
            </span>
          </nav>
        </div>
      </div>
      <RoavioAboutSection />
      <TravelServicesSection />
    </>
  )
}
