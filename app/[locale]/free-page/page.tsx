import type { Metadata } from "next";
import { buildSeoMetadata } from "@/lib/seo";
import Image from "next/image";
import FreePageAccordion from "@/components/shared/free-page-accordion";
// API
import { getTermsAndConditions } from "@/lib/api/freePage";
export const dynamic = "force-static";
export const revalidate = 3600;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildSeoMetadata({
    title: "Terms and Conditions",
    description:
      "Read Egypt Tours Gate terms and conditions for website use, bookings, tour services, payments, cancellations, and traveler responsibilities.",
    path: "/free-page",
    locale,
    noIndex: false,
  });
}

export default async function FreePage() {
  const data = await getTermsAndConditions();

  const section =
    data?.data?.sections?.terms_and_conditions_section;

  return (
    <section className="bg-grey pt-6 pb-10">
      <div className="container mx-auto px-4">

        {/* ===== Hero Header ===== */}
        <div className="relative mb-10 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/assets/images/blogs/A-snapshot-of-two-children-from-the-Nubian-village-of-Aswan-webp.webp"
            alt="Terms and Conditions"
            height={360}
            width={1440}
            className="w-full h-[360px] object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-second/90 to-second/40"></div>

          <div className="absolute inset-0 flex items-center">
            <div className="px-8">
              <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">
                {section?.title || "Terms & Conditions"}
              </h1>

              <p className="text-white/90 max-w-xl">
                {section?.description ||
                  "Everything you need to know before traveling with Egypt Tour Gate"}
              </p>
            </div>
          </div>
        </div>

        {/* ===== Content Card ===== */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-7xl mx-auto">
          <div
            className="
              prose prose-lg max-w-none
              prose-p:text-black
              prose-li:text-black
              prose-strong:text-second
              prose-headings:text-second
              prose-ul:pl-6
            "
          >
            {section?.terms_and_conditions?.length ? (
              section.terms_and_conditions.map((item) => (
                <FreePageAccordion
                  key={item.id}
                  title={item.title}
                  content={item.description}
                  image={item.image}
                />
              ))  
            ) : (
              <p>No terms and conditions available.</p>
            )}

            <div className="mt-12 border-t pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <span className="inline-flex items-center gap-2 text-main font-semibold">
                ✈️ Travel with confidence
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}