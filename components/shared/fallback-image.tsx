"use client";

import Image, { type ImageProps } from "next/image";
import { useMemo, useState } from "react";

const TOUR_FALLBACK_IMAGE = "/assets/images/placeholder.png";

type FallbackImageProps = ImageProps & {
  fallbackSrc?: string;
};

export default function FallbackImage({
  src,
  alt,
  fallbackSrc = TOUR_FALLBACK_IMAGE,
  ...props
}: FallbackImageProps) {
  const initialSrc = useMemo(() => src || fallbackSrc, [src, fallbackSrc]);
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
