import type { Metadata } from "next";
import { buildSeoMetadata, faqPageSchema } from "@/lib/seo";
import { fetchSeoFromEndpoint } from "@/lib/api/seoApi";
// app/أي-فولدر/page.tsx
import { fetchHomeSections } from "@/lib/api/homeApi";
import FAQSection from "@/components/layout/faq";
import SchemaScript from "@/components/seo/schema-script";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = await fetchSeoFromEndpoint("faq", locale);

  return buildSeoMetadata({
    seo,
    title: "Egypt Tours Gate FAQs",
    description:
      "Find answers to frequently asked questions about Egypt Tours Gate tours, bookings, payments, private trips, and travel services.",
    path: "/faq",
    locale,
    noIndex: false,
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const sections = await fetchHomeSections(locale);
  const faqSection = sections?.faq_section ?? null;
  const faqs = faqSection?.faqs ?? [];
  const schema = faqPageSchema(faqs);

  return (
    <main className="min-h-screen bg-white">
      {schema && <SchemaScript schema={schema} />}

      <section className="relative overflow-hidden bg-[var(--second-color)] px-4 py-16 text-center text-white md:py-20">
        <div className="absolute -start-16 -top-20 h-52 w-52 rounded-full border border-white/10" />
        <div className="absolute -bottom-24 end-8 h-64 w-64 rounded-full bg-[var(--main-color)]/10" />
        <div className="relative mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[var(--main-color)]">
            Egypt Tours Gate
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {faqSection?.title || "Frequently Asked Questions"}
          </h1>
          {faqSection?.description && (
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/80 md:text-lg">
              {faqSection.description}
            </p>
          )}
        </div>
      </section>

      <FAQSection faqSection={faqSection} faqs={faqs} />
    </main>
  );
}
