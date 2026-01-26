// app/components/FAQSection.tsx
'use client';

import { useState, useEffect } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'How does it work?',
    answer: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.'
  },
  {
    id: 2,
    question: 'Do I need a designer to use Travosy?',
    answer: 'No, Travosy is designed to be user-friendly and intuitive. Our platform provides pre-designed templates and drag-and-drop functionality that allows anyone to create professional-looking designs without any design experience. You can easily customize colors, layouts, and content to match your brand identity.'
  },
  {
    id: 3,
    question: 'What do I need to do to start selling?',
    answer: 'To start selling, simply sign up for an account, set up your store, add your products, configure payment methods, and launch your store. The entire process can be completed in under 30 minutes. We provide step-by-step guidance throughout the setup process.'
  },
  {
    id: 4,
    question: 'What happens when I receive an order?',
    answer: 'When you receive an order, you will get an instant notification via email and in your dashboard. You can then process the order, update its status, and manage shipping directly from your Travosy admin panel. We also provide order tracking and customer communication tools.'
  },
  {
    id: 5,
    question: 'Can I customize my store?',
    answer: 'Yes! Travosy offers extensive customization options including themes, color schemes, fonts, and layout modifications. You can also add custom CSS for advanced styling. Our theme editor allows you to preview changes in real-time before publishing.'
  },
  {
    id: 6,
    question: 'What payment methods are supported?',
    answer: 'Travosy supports all major payment gateways including Stripe, PayPal, Apple Pay, Google Pay, and more. You can also accept credit/debit cards and bank transfers. All transactions are secured with SSL encryption and PCI compliance.'
  },
  {
    id: 7,
    question: 'Is there a mobile app?',
    answer: 'Yes, Travosy offers mobile apps for both iOS and Android. You can manage your store, process orders, and view analytics on the go. The app provides all essential features from the desktop dashboard optimized for mobile devices.'
  },
  {
    id: 8,
    question: 'How much does it cost?',
    answer: 'Travosy offers flexible pricing plans starting from free with basic features. Our premium plans start at $29/month and include advanced features like custom domains, priority support, and advanced analytics. No hidden fees or transaction charges.'
  }
];

const FAQSection = () => {
  const [openItem, setOpenItem] = useState<number | null>(1); // Bootstrap-like: only one open at a time
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggle = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  // Split FAQ items into two columns
  const firstColumnFaqs = faqData.slice(0, Math.ceil(faqData.length / 2));
  const secondColumnFaqs = faqData.slice(Math.ceil(faqData.length / 2));

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <div className="h-1 w-20 bg-[var(--main-color)] mx-auto"></div>
        </div>
        <h2 className="text-4xl md:text-3xl font-bold text-[var(--second-color)] mb-4">
        Frequently Asked Questions
        </h2>
        <p className="text-lg text-[var(--black-color)] opacity-70 max-w-2xl mx-auto">
        Find answers to common questions about using Travosy platform
        </p>
      </div>
        {/* FAQ Columns */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 space-y-4">
            {firstColumnFaqs.map((item) => {
              const isOpen = openItem === item.id;
              
              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#e3b75e] focus:ring-offset-2 rounded-xl transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-lg font-semibold text-[#272262] pr-4">
                      {item.question}
                    </h3>
                    <span className="flex-shrink-0 ml-2">
                      <svg 
                        className={`w-5 h-5 text-[#e3b75e] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2.5" 
                          d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                        />
                      </svg>
                    </span>
                  </button>
                  
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-[#333] leading-relaxed opacity-90">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-4">
            {secondColumnFaqs.map((item) => {
              const isOpen = openItem === item.id;
              
              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#e3b75e] focus:ring-offset-2 rounded-xl transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-lg font-semibold text-[#272262] pr-4">
                      {item.question}
                    </h3>
                    <span className="flex-shrink-0 ml-2">
                      <svg 
                        className={`w-5 h-5 text-[#e3b75e] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2.5" 
                          d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                        />
                      </svg>
                    </span>
                  </button>
                  
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-[#333] leading-relaxed opacity-90">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-16 p-8 bg-gradient-to-r from-[#272262]/5 to-[#e3b75e]/10 rounded-2xl border border-[#e3b75e]/20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#e3b75e] to-[#272262] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#272262] mb-2">
                Still have questions?
              </h3>
              <p className="text-[#333] opacity-90">
                Our support team is here to help you 24/7
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3.5 bg-[#272262] text-white font-semibold rounded-xl hover:bg-[#272262]/90 focus:outline-none focus:ring-2 focus:ring-[#272262] focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg">
                Contact Support
              </button>
              <button className="px-8 py-3.5 bg-white text-[#272262] font-semibold rounded-xl border-2 border-[#e3b75e] hover:bg-[#e3b75e]/10 focus:outline-none focus:ring-2 focus:ring-[#e3b75e] focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;