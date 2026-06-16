// components/about/AboutSection.tsx
// ✅ Standalone — imports ONLY from aboutTypes, no dependency on homeTypes.

import type { AboutSectionData } from "@/lib/api/aboutTypes";

interface AboutSectionProps {
  aboutData?: AboutSectionData | null;
}

export default function AboutContent({ aboutData }: AboutSectionProps) {
  // Strip HTML tags that may come from the backend rich-text field
  const aboutText = aboutData?.content ?? "";
  return (
    <>  
    <div className="bg-white py-6 px-4 md:px-8 lg:px-12">
      <div className="content">
        {aboutText && (
          <div
            className="text-gray-800 [&_a]:text-[var(--main-color)] [&_img]:object-cover [&_img]:rounded [&_img]:max-w-7xs [&_img]:mx-auto [&_img]:mt-5 [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: aboutText }}
          />
        )}
      </div>
      </div>
    </>
  );
}
