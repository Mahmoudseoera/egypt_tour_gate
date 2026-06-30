"use client";

import { useState } from "react";
import type { Faq, FaqSection } from "@/lib/api/homeTypes";

// ─── Static fallback FAQs (used only when API returns nothing) ─────────────
const staticFaqs: Faq[] = [
  { title: "Is it safe to travel to Egypt 2024?", answer: "Egypt has been one of the most secure tourist destinations for decades. With sensible precautions you'll explore safely." },
  { title: "How might I acquire my visa to visit Egypt?", answer: "Many nationalities can purchase a 1-month entry visa on arrival, including Australia, Canada, EU, USA, UK, and more." },
  { title: "What can female tourists wear in Egypt?", answer: "The dress code is conservative by western standards. For temple and mosque visits, covering shoulders and knees is recommended." },
  { title: "What is the best time to visit Egypt?", answer: "October to April offers mild weather (15–25°C). Summer is very hot but offers significant discounts." },
];

const ITEMS_INITIAL = 5;
const ITEMS_STEP = 5;

interface FAQSectionProps {
  /** Full FAQ section from the home API (includes title + description). */
  faqSection?: FaqSection | null;
  /** Convenience shortcut — ignored when faqSection is provided. */
  faqs?: Faq[];
}

export default function FAQSection({ faqSection, faqs = [] }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_INITIAL);

  // ── Dynamic section heading with fallbacks ──────────────────────────────
  const heading =
    faqSection?.title?.trim() || "Most Asked Questions";
  const subheading =
    faqSection?.description?.trim() ||
    "Find answers to the most common questions about travelling to Egypt";

  // ── Resolve FAQs: prefer faqSection.faqs, fall back to faqs prop, then static
  const rawFaqs =
    faqSection?.faqs?.length
      ? faqSection.faqs
      : faqs.length
      ? faqs
      : staticFaqs;

  const mid = Math.ceil(rawFaqs.length / 2);
  const allLeftItems = rawFaqs.slice(0, mid);
  const allRightItems = rawFaqs.slice(mid);

  // ── Determine how many items to show per side ───────────────────────────
  // visibleCount applies independently to each side; a side simply shows
  // up to visibleCount items, or all of its items if it has fewer.
  const leftItems = allLeftItems.slice(0, visibleCount);
  const rightItems = allRightItems.slice(0, visibleCount);

  const longerSideLength = Math.max(allLeftItems.length, allRightItems.length);
  const hasMoreToShow = visibleCount < longerSideLength;
  const hasShownExtra = visibleCount > ITEMS_INITIAL;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + ITEMS_STEP);
  };

  const handleShowLess = () => {
    setVisibleCount(ITEMS_INITIAL);
    setOpenIndex(null);
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-white faq-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--second-color)] mb-4">
            {heading}
          </h2>
          <span className="relative block h-1 w-40 mb-6 bg-gradient-to-r from-[var(--second-color)] via-[var(--main-color)] to-[var(--second-color)] mx-auto rounded-md before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:bg-[url('/assets/images/pryamids-2.svg')] before:bg-contain before:bg-no-repeat before:z-20 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[26px] after:h-[26px] after:bg-white after:rounded-full after:z-0" />
          {subheading && (
            <p className="text-lg text-[var(--black-color)] opacity-70 max-w-7xl mx-auto">
              {subheading}
            </p>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {/* LEFT */}
          <div className="space-y-4">
            {leftItems.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-semibold text-[var(--second-color)] pr-4">{faq.title}</span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? "bg-[var(--main-color)]" : "bg-gray-100"}`}>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${openIndex === index ? "rotate-180 text-white" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none [&_a:hover]:underline" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            {rightItems.map((faq, index) => {
              const realIndex = index + leftItems.length;
              return (
                <div key={realIndex} className="border border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenIndex(openIndex === realIndex ? null : realIndex)}
                  >
                    <span className="font-semibold text-[var(--second-color)] pr-4">{faq.title}</span>
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === realIndex ? "bg-[var(--main-color)]" : "bg-gray-100"}`}>
                      <svg className={`w-4 h-4 transition-transform duration-300 ${openIndex === realIndex ? "rotate-180 text-white" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {openIndex === realIndex && (
                    <div className="px-6 pb-6">
                      <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none [&_a:hover]:underline" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SHOW MORE / SHOW LESS controls */}
        {(hasMoreToShow || hasShownExtra) && (
          <div className="flex items-center justify-center gap-4 mt-10">
            {hasMoreToShow && (
              <button
                onClick={handleShowMore}
                className="px-6 py-3 rounded-full font-semibold text-white bg-[var(--main-color)] hover:opacity-90 transition-opacity"
              >
                Show More
              </button>
            )}
            {hasShownExtra && (
              <button
                onClick={handleShowLess}
                className="px-6 py-3 rounded-full font-semibold text-[var(--second-color)] border border-[var(--second-color)] hover:bg-gray-50 transition-colors"
              >
                Show Less
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
