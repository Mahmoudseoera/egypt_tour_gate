import Image from "next/image";
export default function TravelServicesSection() {
  const services = [
    {
      id: 1,
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[var(--main-color)]"
        >
          <path
            d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="7" r="4" />
          <path
            d="M22 8v6M19 11h6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Expert Travel Guide",
      description:
        "Travel professionals who help destinations, accommodations, and activities tailored.",
    },
    {
      id: 2,
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[var(--main-color)]"
        >
          <path
            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Custom Tour Plan",
      description:
        "Enjoy trips designed around your preferences, whether you want a relaxing beach holiday",
    },
    {
      id: 3,
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[var(--main-color)]"
        >
          <circle cx="11" cy="11" r="8" />
          <path
            d="m21 21-4.35-4.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="11" cy="8" r="1" fill="currentColor" />
        </svg>
      ),
      title: "Easy Booking",
      description:
        "Save time and effort with a single platform to book flights, hotels, activities, transportation",
    },
    {
      id: 4,
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[var(--main-color)]"
        >
          <path
            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 2.69l6.5 3.76M12 22v-8.5M2.5 7.5l9.5 5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Deals & Discounts",
      description:
        "Save time and effort with a single platform to book flights, hotels, activities, transportation",
    },
    {
      id: 5,
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[var(--main-color)]"
        >
          <path
            d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.58 16.5h12.85M12 22v-3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Local Guides Authentic",
      description:
        "Immerse yourself local culture with trusted guides who provide insider tips and hidden",
    },
    {
      id: 6,
      icon: (
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[var(--main-color)]"
        >
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8v4M12 16h.01"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Travel Insurance",
      description:
        "Stay protected with insurance options and on-ground support for a worry-free experience.",
    },
  ];

  const styles = `
      .service-card-hover {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                background-color: rgba(227, 183, 94, 0.05);
      }
  
      .service-card-hover:hover {
        background-color: var(--second-500);
      }
  
      .service-card-hover:hover .service-icon-bg {
        background-color: var(--second-color);
      }
  
      .service-icon-float {
        transition: transform 0.4s ease;
      }
  
      .service-card-hover:hover .service-icon-float {
        transform: scale(1.1) rotate(5deg);
      }
  
      .featured-card {
        position: relative;
        overflow: hidden;
      }
  
      .featured-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%);
        z-index: 1;
      }
  
      .featured-card > * {
        position: relative;
        z-index: 2;
      }
  
      .featured-image {
        transition: transform 0.6s ease;
      }
  
      .featured-card:hover .featured-image {
        transform: scale(1.08);
      }
  
      .service-fade-in {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
      }
  
      .service-fade-in:nth-child(1) { animation-delay: 0.1s; }
      .service-fade-in:nth-child(2) { animation-delay: 0.2s; }
      .service-fade-in:nth-child(3) { animation-delay: 0.3s; }
      .service-fade-in:nth-child(4) { animation-delay: 0.4s; }
      .service-fade-in:nth-child(5) { animation-delay: 0.5s; }
      .service-fade-in:nth-child(6) { animation-delay: 0.6s; }
  
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div
        className="py-20 px-4 md:px-8 bg-[var(--second-color)]"
      >
        <div className="max-w-7xl mx-auto">
          {/* First Row: 2 Cards + 1 Large Image */}
          <div className="text-center mb-12">
        <h2 className="text-4xl md:text-3xl font-bold text-white mb-4">
        Explore Our Amazing Destinations
        </h2>
        <span
        className="relative block h-1 w-40 mb-6 bg-gradient-to-r from-[var(--main-color)] via-[transparent] to-[var(--main-color)] mx-auto relative block  w-40 mx-auto rounded-md

          before:content-['']
          before:absolute
          before:top-1/2
          before:left-1/2
          before:-translate-x-1/2
          before:-translate-y-1/2
          before:w-4
          before:h-4
          before:bg-[url('/assets/images/pryamids-2.svg')]
          before:bg-contain
          before:bg-no-repeat
          before:z-20

          after:content-['']
          after:absolute
          after:top-1/2
          after:left-1/2
          after:-translate-x-1/2
          after:-translate-y-1/2
          after:w-[26px]
          after:h-[26px]
          after:bg-[var(--second-color)]
          after:rounded-full
          after:z-0
        ">
        </span>
        <p className="text-lg text-white opacity-70 max-w-2xl mx-auto">
          Discover breathtaking locations around the world and create unforgettable memories
        </p>
      </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Expert Travel Guide */}
            <div className="service-card-hover service-fade-in bg-[var(--second-300) rounded-3xl p-8 border border-[var(--second-900)] 
            hover:rotate-3 hover:scale-105 transition-transform hover:rotate-x-15 hover:rotate-y-20 hover:transition-transform duration-300
            smooth-transition">
              <div
                className="service-icon-bg w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-400"
                
              >
                <div className="service-icon-float">{services[0].icon}</div>
              </div>
              <h3 className="text-white text-2xl font-bold mb-4">
                {services[0].title}
              </h3>
              <p className="text-gray-400 text-base leading-relaxed">
                {services[0].description}
              </p>
            </div>

            {/* Featured Large Image - Custom Tour Plan (spans 2 columns) */}
            <div
              className="featured-card service-fade-in md:col-span-2 rounded-3xl overflow-hidden relative"
              style={{ minHeight: "0", maxHeight: "350px" }}
            >
              <Image
                src="/assets/images/blogs/A-wonderful-picture-of-a-tourist-in-front-of-the-pyramids-webp.webp"
                alt="Luxury cabin retreat"
                width={1200}
                height={800}
                className="featured-image absolute inset-0 w-full h-full object-cover"
              />
              <div className="p-8 flex flex-col justify-end h-full">
                <div
                  className="service-icon-bg w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: "rgba(42, 42, 42, 0.9)" }}
                >
                  <div className="service-icon-float">{services[1].icon}</div>
                </div>
                <h3 className="text-white text-2xl font-bold mb-4">
                  {services[1].title}
                </h3>
                <p className="text-gray-200 text-base leading-relaxed">
                  {services[1].description}
                </p>
              </div>
            </div>

            {/* Easy Booking */}
            <div className="service-card-hover service-fade-in bg-[var(--second-300) rounded-3xl p-8 border border-[var(--second-900)] 
            hover:rotate-3 hover:scale-105 transition-transform hover:rotate-x-15 hover:rotate-y-20 hover:transition-transform duration-300
            smooth-transition">
              <div
                className="service-icon-bg w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-400"
                
              >
                <div className="service-icon-float">{services[2].icon}</div>
              </div>
              <h3 className="text-white text-2xl font-bold mb-4">
                {services[2].title}
              </h3>
              <p className="text-gray-400 text-base leading-relaxed">
                {services[2].description}
              </p>
            </div>
          </div>

          {/* Second Row: 4 Equal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Deals & Discounts */}
            <div className="service-card-hover service-fade-in bg-[var(--second-300) rounded-3xl p-8 border border-[var(--second-900)] 
            hover:rotate-3 hover:scale-105 transition-transform hover:rotate-x-15 hover:rotate-y-20 hover:transition-transform duration-300
            smooth-transition">
              <div
                className="service-icon-bg w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-400"
                
              >
                <div className="service-icon-float">{services[3].icon}</div>
              </div>
              <h3 className="text-white text-2xl font-bold mb-4">
                {services[3].title}
              </h3>
              <p className="text-gray-400 text-base leading-relaxed">
                {services[3].description}
              </p>
            </div>

            {/* Local Guides Authentic */}
            <div className="service-card-hover service-fade-in bg-[var(--second-300) rounded-3xl p-8 border border-[var(--second-900)] 
            hover:rotate-3 hover:scale-105 transition-transform hover:rotate-x-15 hover:rotate-y-20 hover:transition-transform duration-300
            smooth-transition">
              <div
                className="service-icon-bg w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-400"
                
              >
                <div className="service-icon-float">{services[4].icon}</div>
              </div>
              <h3 className="text-white text-2xl font-bold mb-4">
                {services[4].title}
              </h3>
              <p className="text-gray-400 text-base leading-relaxed">
                {services[4].description}
              </p>
            </div>

            {/* Travel Insurance */}
            <div className="service-card-hover service-fade-in bg-[var(--second-300) rounded-3xl p-8 border border-[var(--second-900)] 
            hover:rotate-3 hover:scale-105 transition-transform hover:rotate-x-15 hover:rotate-y-20 hover:transition-transform duration-300
            smooth-transition">
              <div
                className="service-icon-bg w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-400"
                
              >
                <div className="service-icon-float">{services[5].icon}</div>
              </div>
              <h3 className="text-white text-2xl font-bold mb-4">
                {services[5].title}
              </h3>
              <p className="text-gray-400 text-base leading-relaxed">
                {services[5].description}
              </p>
            </div>

            {/* Additional Service (you can add more or duplicate) */}
            <div className="service-card-hover service-fade-in bg-[var(--second-300) rounded-3xl p-8 border border-[var(--second-900)] 
            hover:rotate-3 hover:scale-105 transition-transform hover:rotate-x-15 hover:rotate-y-20 hover:transition-transform duration-300
            smooth-transition">
              <div
                className="service-icon-bg w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-400"
                
              >
                <div className="service-icon-float">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-[var(--main-color)]"
                  >
                    <path
                      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 22V12h6v10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-white text-2xl font-bold mb-4">
                24/7 Support
              </h3>
              <p className="text-gray-400 text-base leading-relaxed">
                Round-the-clock assistance to ensure your journey is smooth and
                worry-free
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
