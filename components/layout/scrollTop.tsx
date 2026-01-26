"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollToTop() {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const pathLength = path.getTotalLength();

    path.style.strokeDasharray = `${pathLength} ${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;

      const progress = pathLength - (scrollTop * pathLength) / height;

      path.style.strokeDashoffset = `${progress}`;
      setIsVisible(scrollTop > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        fixed bottom-8 cursor-pointer
          right-8 z-[9999]
        h-12 w-12 rounded-full
        transition-all duration-200
        ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }
        shadow-inner
      `}
      style={{ boxShadow: "inset 0 0 0 2px rgba(0,0,0,.09)" }}
    >
      {/* Arrow */}
      <span className="absolute inset-0 flex items-center text-[30px] justify-center text-primary animate-float">
      <svg className="arrow" width="22" height="25" viewBox="0 0 24 23" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.556131 11.4439L11.8139 0.186067L13.9214 2.29352L13.9422 20.6852L9.70638 20.7061L9.76793 8.22168L3.6064 14.4941L0.556131 11.4439Z"></path>
            <path d="M23.1276 11.4999L16.0288 4.40105L15.9991 10.4203L20.1031 14.5243L23.1276 11.4999Z"></path>
        </svg>
      </span>

      {/* Progress Circle */}
      <svg className="w-full h-full rotate-[-90deg]" viewBox="-1 -1 102 102">
        <path
          ref={pathRef}
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-primary transition-all duration-200"
        />
      </svg>
    </button>
  );
}
