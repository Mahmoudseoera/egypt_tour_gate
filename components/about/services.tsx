// components/about/ServicesSection.tsx
// ✅ Standalone — imports ONLY from aboutTypes, no dependency on homeTypes.

import Image from "next/image";
import type { WhyChooseSectionData } from "@/lib/api/aboutTypes";

interface TravelServicesSectionProps {
  whyChooseSection: WhyChooseSectionData | null;
}

export default function TravelServicesSection({
  whyChooseSection,
}: TravelServicesSectionProps) {
  const sectionTitle = whyChooseSection?.title?.trim() || "Services We Offer";
  const sectionDescription = whyChooseSection?.description?.trim() || null;

  // ── Build services array from API data ──────────────────────────────────────
  const buildServices = () => {
    if (!whyChooseSection?.why_choose) return [];

    const sections = [
      whyChooseSection.why_choose.section1,
      whyChooseSection.why_choose.section2,
      whyChooseSection.why_choose.section3,
      whyChooseSection.why_choose.section4,
      whyChooseSection.why_choose.section5,
      whyChooseSection.why_choose.section6,
    ];

    const services: Array<{
      img: string;
      id: number;
      title: string;
      description: string;
    }> = [];
    let serviceId = 1;

    sections.forEach((section) => {
      for (let i = 1; i <= 6; i++) {
        const titleKey = `why_choose_box_${i}_title` as keyof typeof section;
        const descKey = `why_choose_box_${i}_desc` as keyof typeof section;
        const img = section.img;
        const title = section[titleKey];
        const desc = section[descKey];

        if (title || desc) {
          services.push({
            id: serviceId++,
            title: (title as string) || "Service item",
            description: (desc as string) || "Description not available",
            img: (img as string) || "/assets/images/safety.svg",
          });
        }
      }
    });

    return services;
  };

  const services = buildServices();

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
    .services-content { position: relative; z-index: 2; }
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
      width: 44px; height: 44px; min-width: 44px;
      background: rgba(227, 183, 94, 0.15);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.3s ease;
    }
          .service-icon-wrap img {
      color: transparent;
      filter: brightness(0) saturate(100%) invert(78%) sepia(27%) saturate(943%)
            hue-rotate(356deg) brightness(92%) contrast(89%);
    }
    .service-card:hover .service-icon-wrap { background: rgba(227, 183, 94, 0.28); }
    .featured-card {
      position: relative; overflow: hidden; border-radius: 20px;
    }
    .featured-card::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(39,34,98,0.85) 100%);
      z-index: 1;
    }
    .featured-card img { transition: transform 0.6s ease; }
    .featured-card:hover img { transform: scale(1.06); }
    .service-fade-in { animation: svcFadeUp 0.5s ease-out forwards; opacity: 0; }
    .service-fade-in:nth-child(1){animation-delay:0.05s}
    .service-fade-in:nth-child(2){animation-delay:0.10s}
    .service-fade-in:nth-child(3){animation-delay:0.15s}
    .service-fade-in:nth-child(4){animation-delay:0.20s}
    .service-fade-in:nth-child(5){animation-delay:0.25s}
    .service-fade-in:nth-child(6){animation-delay:0.30s}
    .service-fade-in:nth-child(7){animation-delay:0.35s}
    @keyframes svcFadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="services-bg-section py-12 md:py-16 px-4 md:px-8">
        {/* Background image */}
        <div className="services-bg-image">
          <Image
            src="/assets/images/tours/camel front of giza pyramids.jpg"
            alt="Egypt background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Dark overlay */}
        <div className="services-overlay" />

        {/* Content */}
        <div className="services-content max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
              {sectionTitle}
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
            {sectionDescription && (
              <p className="text-base text-white/70 max-w-7xl mx-auto">
                {sectionDescription}
              </p>
            )}
          </div>

          {/* Services grid */}
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service, index) => (
                <div key={service.id} className="contents">
                  <div
                    className="service-card service-fade-in rounded-2xl p-5"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="service-icon-wrap">
                        {/* <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg> */}
                        <Image
                          src={service.img}
                          alt="Star Icon"
                          width={24}
                          height={24}
                        />
                      </div>
                      <h3 className="text-white text-base font-bold leading-tight">
                        {service.title.toLowerCase()}
                      </h3>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Featured image card after the first service */}
                  {index === 0 && (
                    <div
                      className="featured-card service-fade-in md:col-span-2"
                      style={{ minHeight: "200px", maxHeight: "260px" }}
                    >
                      <Image
                        src="/assets/images/blogs/A-wonderful-picture-of-a-tourist-in-front-of-the-pyramids-webp.webp"
                        alt="Custom Tour Plan"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60">Loading services…</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
