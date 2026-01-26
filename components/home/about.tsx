import { Check } from 'lucide-react';
import Image from "next/image";

export default function RoavioAboutSection() {
  const features = [
    { id: 1, text: "Destination Search & Filters" },
    { id: 2, text: "Online Booking System" },
    { id: 3, text: "Blog & Travel Guides" },
    { id: 4, text: "Live Chat Support" },
    { id: 5, text: "Pricing & Discounts" },
    { id: 6, text: "Reviews & Ratings" }
  ];

  const styles = `
    .roavio-image-zoom {
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .roavio-card-hover:hover .roavio-image-zoom {
      transform: scale(1.08);
    }

    .roavio-icon-float {
      animation: roavio-float 3s ease-in-out infinite;
    }

    @keyframes roavio-float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .roavio-check-pulse {
      animation: roavio-pulse 2s ease-in-out infinite;
    }

    @keyframes roavio-pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.9;
      }
    }

    .roavio-feature-fade {
      animation: roavio-fade-in 0.6s ease-out forwards;
      opacity: 0;
    }

    .roavio-feature-fade:nth-child(1) {
      animation-delay: 0.1s;
    }

    .roavio-feature-fade:nth-child(2) {
      animation-delay: 0.2s;
    }

    .roavio-feature-fade:nth-child(3) {
      animation-delay: 0.3s;
    }

    .roavio-feature-fade:nth-child(4) {
      animation-delay: 0.4s;
    }

    .roavio-feature-fade:nth-child(5) {
      animation-delay: 0.5s;
    }

    .roavio-feature-fade:nth-child(6) {
      animation-delay: 0.6s;
    }

    @keyframes roavio-fade-in {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .roavio-btn-hover {
      position: relative;
      overflow: hidden;
      transform: translateY(0);
    }

    .roavio-btn-hover::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .roavio-btn-hover:hover::before {
      width: 300px;
      height: 300px;
    }

    .roavio-btn-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(249, 115, 22, 0.3);
    }

    .roavio-btn-hover:active {
      transform: translateY(0);
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="bg-white py-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {/* Left - Text Content */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--second-color)] text-gray-900 mb-6 leading-tight">
                Passionate about your adventures with
                <br />
                <span className="text-gray-900">Egypt Tour Gate</span>
              </h2>
              <p className="text-gray-600 text-lg">
                We are started with 2005s, <span className="text-orange-500 font-semibold">20+years of experience</span>
              </p>
            </div>

            {/* Right - Image Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Colosseum Image */}
              <div className="col-span-2 lg:col-span-1 roavio-card-hover">
                <div className="rounded-3xl overflow-hidden h-72 lg:h-full">
                  <Image
                src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80" 
                alt="Colosseum Rome" 
                 className="w-full h-full object-cover roavio-image-zoom"
                 width={800}
                 height={800}
                />
                </div>
              </div>

              {/* Trust Card */}
              <div className="col-span-2 lg:col-span-1 bg-gray-900 rounded-3xl p-8 flex flex-col justify-center items-start text-white h-72 lg:h-full">
                <div className="roavio-icon-float mb-6">
                  <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 64 64" 
                    fill="none" 
                    className="text-white"
                  >
                    <path 
                      d="M32 8C24.5 8 18 12.5 18 18C18 23.5 24.5 32 32 40C39.5 32 46 23.5 46 18C46 12.5 39.5 8 32 8Z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    <circle cx="32" cy="18" r="4" fill="currentColor" />
                    <path 
                      d="M32 56C32 56 12 44 12 28C12 22 16 16 24 14" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                    />
                    <path 
                      d="M32 56C32 56 52 44 52 28C52 22 48 16 40 14" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Trusted & Secure</h3>
                <p className="text-gray-300 text-base">
                  Your safety and trust are our top priorities.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left - Train Image */}
            <div className="roavio-card-hover">
              <div className="rounded-3xl overflow-hidden h-96">
              <Image
                src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80" 
                alt="Colosseum Rome" 
                 className="w-full h-full object-cover roavio-image-zoom"
                 width={800}
                 height={800}
                />
              </div>
            </div>

            {/* Right - Description & Features */}
            <div className="space-y-8">
              <p className="text-gray-600 text-lg leading-relaxed">
              We believe travel is more than just a trip—it&apos;s an experience that shapes your life.
                Our mission is to create unforgettable journeys that combine adventure, comfort, and 
                authentic cultural encounters.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center gap-3 roavio-feature-fade">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-[var(--main-color)] flex items-center justify-center roavio-check-pulse">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    </div>
                    <span className="text-gray-700 text-base font-medium">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div>
                <button className="roavio-btn-hover bg-[var(--main-color)] hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg">
                  Learn More Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}