"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";

const TOUR_FALLBACK_IMAGE = "/assets/images/placeholder.png";

type FallbackImageProps = ImageProps & {
  fallbackSrc?: string;
};

export default function FallbackImage({
  src,
  alt,
  title,
  fallbackSrc = TOUR_FALLBACK_IMAGE,
  ...props
}: FallbackImageProps) {
  const initialSrc = useMemo(() => src || fallbackSrc, [src, fallbackSrc]);
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  useEffect(() => {
    setCurrentSrc(initialSrc);
  }, [initialSrc]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      title={title ?? (typeof alt === "string" ? alt : undefined)}
      onError={() => {
        setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
