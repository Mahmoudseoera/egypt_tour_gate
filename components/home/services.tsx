import Image from "next/image";

export default function TravelServicesSection() {
  const services = [
    {
      id: 1,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--main-color)]">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 8v6M19 11h6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Expert Travel Guide",
      description: "Travel professionals who help destinations, accommodations, and activities tailored.",
    },
    {
      id: 2,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--main-color)]">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Custom Tour Plan",
      description: "Enjoy trips designed around your preferences, whether you want a relaxing beach holiday.",
    },
    {
      id: 3,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--main-color)]">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Easy Booking",
      description: "Save time and effort with a single platform to book flights, hotels, activities, transportation.",
    },
    {
      id: 4,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--main-color)]">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2.69l6.5 3.76M12 22v-8.5M2.5 7.5l9.5 5.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Deals & Discounts",
      description: "Save time and effort with a single platform to book flights, hotels, activities, transportation.",
    },
    {
      id: 5,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--main-color)]">
          <path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.58 16.5h12.85M12 22v-3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Local Authentic Guides",
      description: "Immerse yourself in local culture with trusted guides who provide insider tips and hidden gems.",
    },
    {
      id: 6,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--main-color)]">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8v4M12 16h.01" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Travel Insurance",
      description: "Stay protected with insurance options and on-ground support for a worry-free experience.",
    },
    {
      id: 7,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--main-color)]">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "24/7 Support",
      description: "Round-the-clock assistance to ensure your journey is smooth and worry-free.",
    },
  ];

  const styles = `
    .services-bg-section {
      position: relative;
      overflow: hidden;
    }

    .services-bg-image {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    .services-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(39, 34, 98, 0.88) 0%,
        rgba(39, 34, 98, 0.75) 40%,
        rgba(20, 17, 60, 0.85) 100%
      );
      z-index: 1;
    }

    .services-content {
      position: relative;
      z-index: 2;
    }

    .service-card {
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(227, 183, 94, 0.2);
      backdrop-filter: blur(8px);
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .service-card:hover {
      background: rgba(227, 183, 94, 0.12);
      border-color: rgba(227, 183, 94, 0.5);
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
    }

    .service-icon-wrap {
      width: 44px;
      height: 44px;
      min-width: 44px;
      background: rgba(227, 183, 94, 0.15);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s ease;
    }

    .service-card:hover .service-icon-wrap {
      background: rgba(227, 183, 94, 0.28);
    }

    .featured-card {
      position: relative;
      overflow: hidden;
      border-radius: 20px;
    }

    .featured-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(39,34,98,0.85) 100%);
      z-index: 1;
    }

    .featured-card img {
      transition: transform 0.6s ease;
    }

    .featured-card:hover img {
      transform: scale(1.06);
    }

    .featured-card > * {
      position: relative;
      z-index: 2;
    }

    .service-fade-in {
      animation: svcFadeUp 0.5s ease-out forwards;
      opacity: 0;
    }
    .service-fade-in:nth-child(1) { animation-delay: 0.05s; }
    .service-fade-in:nth-child(2) { animation-delay: 0.1s; }
    .service-fade-in:nth-child(3) { animation-delay: 0.15s; }
    .service-fade-in:nth-child(4) { animation-delay: 0.2s; }
    .service-fade-in:nth-child(5) { animation-delay: 0.25s; }
    .service-fade-in:nth-child(6) { animation-delay: 0.3s; }
    .service-fade-in:nth-child(7) { animation-delay: 0.35s; }

    @keyframes svcFadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="services-bg-section py-12 md:py-16 px-4 md:px-8">
        {/* Background Image */}
        <div className="services-bg-image">
          <Image
            src="/assets/images/tours/camel front of giza pyramids.jpg"
            alt="Egypt background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Dark Overlay */}
        <div className="services-overlay" />

        {/* Content */}
        <div className="services-content max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              Our Amazing Services
            </h2>
            <span
              className="relative block h-1 w-40 mb-5 mx-auto rounded-md
                bg-gradient-to-r from-[var(--main-color)] via-[var(--second-color)] to-[var(--main-color)]
                before:content-[''] before:absolute before:top-1/2 before:left-1/2
                before:-translate-x-1/2 before:-translate-y-1/2
                before:w-4 before:h-4
                before:bg-[url('/assets/images/pryamids-2.svg')]
                before:bg-contain before:bg-no-repeat before:z-20
                after:content-[''] after:absolute after:top-1/2 after:left-1/2
                after:-translate-x-1/2 after:-translate-y-1/2
                after:w-[26px] after:h-[26px] after:opacity-3
                after:bg-[#4A4976] after:rounded-full after:z-0"
            />
            <p className="text-base text-white/70 max-w-2xl mx-auto">
              Discover breathtaking locations around the world and create unforgettable memories
            </p>
          </div>

          {/* Row 1: 2 cards + 1 featured image + 1 card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">

            {/* Card 1 */}
            <div className="service-card service-fade-in rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="service-icon-wrap">{services[0].icon}</div>
                <h3 className="text-white text-base font-bold leading-tight">{services[0].title}</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{services[0].description}</p>
            </div>

            {/* Featured Card (spans 2 cols) */}
            <div className="featured-card service-fade-in md:col-span-2" style={{ minHeight: "200px", maxHeight: "260px" }}>
              <Image
                src="/assets/images/blogs/A-wonderful-picture-of-a-tourist-in-front-of-the-pyramids-webp.webp"
                alt="Custom Tour Plan"
                fill
                className="object-cover"
              />
              {/* <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end" style={{position:'absolute'}}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="service-icon-wrap">{services[1].icon}</div>
                  <h3 className="text-white text-base font-bold leading-tight">{services[1].title}</h3>
                </div>
                <p className="text-white/75 text-sm leading-relaxed">{services[1].description}</p>
              </div> */}
            </div>

            {/* Card 3 */}
            <div className="service-card service-fade-in rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="service-icon-wrap">{services[2].icon}</div>
                <h3 className="text-white text-base font-bold leading-tight">{services[2].title}</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{services[2].description}</p>
            </div>
          </div>

          {/* Row 2: 4 equal cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[services[3], services[4], services[5], services[6]].map((service) => (
              <div key={service.id} className="service-card service-fade-in rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="service-icon-wrap">{service.icon}</div>
                  <h3 className="text-white text-base font-bold leading-tight">{service.title}</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
