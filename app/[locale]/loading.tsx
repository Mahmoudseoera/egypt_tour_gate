"use client";

import { useEffect, useState } from "react";

export default function LocaleLoading() {
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const step = prev < 40 ? 7 : prev < 70 ? 4 : 2;
        return Math.min(92, prev + step);
      });
    }, 180);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-sm flex items-center justify-center">
      <div className="w-[92%] max-w-xl">
        <div className="flex items-center justify-between mb-2 text-xs font-semibold tracking-wide uppercase">
          <span style={{ color: "var(--second-color)" }}>Loading your experience</span>
          <span style={{ color: "var(--main-color)" }}>{progress}%</span>
        </div>

        <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, var(--second-color) 0%, #3d3586 45%, var(--main-color) 100%)",
              boxShadow: "0 0 10px rgba(227,183,94,0.45)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
