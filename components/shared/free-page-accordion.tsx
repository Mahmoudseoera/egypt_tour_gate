"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

type Props = {
  title: string;
  content: string;
  image?: string;
};

export default function FreePageAccordion({ title, content, image }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6 border border-gray-200 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-gray-50 hover:bg-gray-100 transition"
      >
        <h3 className="text-[var(--second-color)] capitalize text-2xl font-semibold">
          {title.toLowerCase()}
        </h3>

        <ChevronDown
          className={`transition-transform duration-300 text-[var(--main-color)] ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-5">
            {image && (
              <div className="mb-6 overflow-hidden rounded-2xl">
                <Image
                  src={image}
                  alt={title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div
              className="free-page-content"
              dangerouslySetInnerHTML={{
                __html: content.replace(
                  /<a\b(?![^>]*\btarget=)/gi,
                  '<a target="_blank" rel="noopener noreferrer" ',
                ),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
