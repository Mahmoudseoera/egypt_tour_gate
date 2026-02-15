// components/MobileFooter.tsx
'use client';

import Link from 'next/link';

const MobileFooter = () => {
  // Corrected & validated contact URLs (removed spaces/formatting issues)
  const CONTACT = {
    whatsapp: 'https://wa.me/201111400212', // Valid WhatsApp format: country code + number (no spaces/symbols)
    phone: 'tel:+201111400212',              // Valid tel format: +[countrycode][number]
    contact: '/contact',                      // Relative path for Next.js internal navigation
    book: '/tailorMade'                       // Relative path for Next.js internal navigation
  };

  // Accessible icon labels (fixed incorrect alt text from original design)
  const ICONS = [
    { 
      src: 'https://www.bestdestinationtours.com/assets/images/mobile-tabs/whatsapp-color.svg', 
      alt: 'Chat on WhatsApp', 
      label: 'Whatsapp',
      href: CONTACT.whatsapp,
      isExternal: true
    },
    { 
      src: 'https://www.bestdestinationtours.com/assets/images/mobile-tabs/phone-colors.svg', 
      alt: 'Call us', 
      label: 'Call',
      href: CONTACT.phone,
      isExternal: true
    },
    { 
      src: 'https://www.bestdestinationtours.com/assets/images/mobile-tabs/call-center-colors.svg', 
      alt: 'Contact form', 
      label: 'Contact Us',
      href: CONTACT.contact,
      isExternal: false
    },
    { 
      src: 'https://www.bestdestinationtours.com/assets/images/mobile-tabs/tailor-made-color.svg', 
      alt: 'Create custom tour', 
      label: 'Book Now',
      href: CONTACT.book,
      isExternal: false
    }
  ];

  return (
    <footer 
      className="block md:hidden fixed bottom-0 left-0 right-0 z-50 
                 border-t border-[var(--border-light)] 
                 bg-[var(--white-color)] 
                 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
      aria-label="Mobile navigation menu"
    >
      <div className="flex items-center justify-between py-4 px-2 max-w-screen-md mx-auto w-full">
        {ICONS.map((item, index) => (
          <a
            key={index}
            href={item.href}
            target={item.isExternal ? '_blank' : undefined}
            rel={item.isExternal ? 'noopener noreferrer' : undefined}
            className="flex flex-col items-center justify-center gap-1 flex-1 
                       text-[var(--black-color)] hover:opacity-80 transition-opacity
                       focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] 
                       focus:ring-offset-2 focus:ring-offset-[var(--white-color)] 
                       rounded-lg p-1"
            aria-label={item.alt}
          >
            <img 
              src={item.src} 
              alt="" // Empty alt since label is in aria-label and visible text
              loading="lazy"
              width="20" 
              height="20"
              className="w-5 h-5" // 20px = 1.25rem (Tailwind w-5/h-5)
            />
            <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
          </a>
        ))}
      </div>
    </footer>
  );
};

export default MobileFooter;