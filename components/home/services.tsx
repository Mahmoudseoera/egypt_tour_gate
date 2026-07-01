import Image from "next/image";
import { getT } from "@/lib/hooks/getT";
import type { WhyChooseSection } from "@/lib/api/homeTypes";
import FallbackImage from "@/components/shared/fallback-image";
type WhyChooseSectionProps = {
  /** Full `tag_categories_section` object from `fetchHomeSections().tag_categories_section`. */
  whyChooseSection: WhyChooseSection | null;
};
export default async function TravelServicesSection({
  whyChooseSection,
}: WhyChooseSectionProps) {
  const sectionTitle = whyChooseSection?.title?.trim() || "Services We Offer";
  const sectionDescription = whyChooseSection?.description?.trim() || null;
const t = await getT("home");  
  // ── Build services array from API data ──────────────────────────────────────
  const buildServicesFromAPI = () => {
    if (!whyChooseSection?.why_choose) return [];

    const sections = [
      whyChooseSection.why_choose.section1,
      whyChooseSection.why_choose.section2,
      whyChooseSection.why_choose.section3,
      whyChooseSection.why_choose.section4,
      whyChooseSection.why_choose.section5,
      whyChooseSection.why_choose.section6,
    ];

    const services: Array<{ img: string; id: number; title: string; description: string }> =
      [];
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
            title: (title as string) || "Service Item",
            description: (desc as string) || "Description not available",
            img: (img as string) || "/assets/images/safety.svg",
          });
        }
      }
    });

    return services;
  };

  const services = buildServicesFromAPI();

  return (
    <>
      <div className="services-bg-section py-12 md:py-16 px-4 md:px-8">
        {/* Background Image */}
        <div className="services-bg-image">
          <FallbackImage
            src="/assets/images/tours/camel front of giza pyramids.jpg"
            alt={t("egypt_background")}
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
            <p className="text-base text-white/70 max-w-7xl mx-auto">
              {sectionDescription}
            </p>
          </div>

          {/* Render all services in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service, index) => (
                <div key={service.id} className="contents">
                  {/* الكارت العادي */}
                  <div
                    className="service-card service-fade-in rounded-2xl p-5"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="service-icon-wrap">
                        <FallbackImage
                          src={service.img}
                          alt={t("star_icon")}
                          width={24}
                          height={24}
                        />
                      </div>
                      <h3 className="text-white text-base font-bold leading-tight text-transform: capitalize">
                        {service.title.toLowerCase()}
                      </h3>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
             
                  {index === 0 && (
                    <div
                      className="featured-card service-fade-in md:col-span-2"
                      style={{ minHeight: "200px", maxHeight: "260px" }}
                    >
                      <FallbackImage
                        src="/assets/images/blogs/A-wonderful-picture-of-a-tourist-in-front-of-the-pyramids-webp.webp"
                        alt={t("custom_tour_plan")}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
        </div>
      </div>
    </>
  );
}
