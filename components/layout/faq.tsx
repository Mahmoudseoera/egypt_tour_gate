"use client";

import { useState } from "react";
import type { Faq } from "@/lib/api/homeTypes";

const staticFaqs: Faq[] = [
  { title: "Is it safe to travel to Egypt 2024?", answer: "Egypt has been one of the most secure tourist destinations for decades. With sensible precautions you'll explore safely." },
  { title: "How might I acquire my visa to visit Egypt?", answer: "Many nationalities can purchase a 1-month entry visa on arrival, including Australia, Canada, EU, USA, UK, and more." },
  { title: "What can female tourists wear in Egypt?", answer: "The dress code is conservative by western standards. For temple and mosque visits, covering shoulders and knees is recommended." },
  { title: "What is the best time to visit Egypt?", answer: "October to April offers mild weather (15–25°C). Summer is very hot but offers significant discounts." },
];

interface FAQSectionProps {
  faqs?: Faq[];
}

export default function FAQSection({ faqs = [] }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = faqs.length > 0 ? faqs : staticFaqs;
  const mid = Math.ceil(items.length / 2);

  const leftItems = items.slice(0, mid);
  const rightItems = items.slice(mid);
  return (  
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--second-color)] mb-4">Most Asked Questions</h2>
          <span className="relative block h-1 w-40 mb-6 bg-gradient-to-r from-[var(--second-color)] via-[var(--main-color)] to-[var(--second-color)] mx-auto rounded-md before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:bg-[url('/assets/images/pryamids-2.svg')] before:bg-contain before:bg-no-repeat before:z-20 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-[26px] after:h-[26px] after:bg-white after:rounded-full after:z-0" />
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
          <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-[var(--main-color)]' : 'bg-gray-100'}`}>
            <svg className={`w-4 h-4 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
        </button>

        {openIndex === index && (
          <div className="px-6 pb-6">
            <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer }} />
          </div>
        )}
      </div>
    ))}
  </div>

  {/* RIGHT */}
  <div className="space-y-4">
    {rightItems.map((faq, index) => {
      const realIndex = index + leftItems.length; //

      return (
        <div key={realIndex} className="border border-gray-200 rounded-2xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            onClick={() => setOpenIndex(openIndex === realIndex ? null : realIndex)}
          >
            <span className="font-semibold text-[var(--second-color)] pr-4">{faq.title}</span>
            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === realIndex ? 'bg-[var(--main-color)]' : 'bg-gray-100'}`}>
              <svg className={`w-4 h-4 transition-transform duration-300 ${openIndex === realIndex ? 'rotate-180 text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </span>
          </button>

          {openIndex === realIndex && (
            <div className="px-6 pb-6">
              <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer }} />
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>
      </div>
    </section>
  );
}
