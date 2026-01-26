import Image from "next/image";
import Link from "next/link";
import { Tour } from "@/lib/api/tours";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const tourLink = `/tours/${tour.categorySlug}/${tour.slug}`;

  return (
    <div className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs">
      <Link href={tourLink}>
        <Image
          src={tour.image}
          alt={tour.title}
          width={400}
          height={250}
          className="rounded-base"
        />
      </Link>

      <Link href={tourLink}>
        <h5 className="mt-6 mb-2 text-2xl font-semibold tracking-tight text-heading">
          {tour.title}
        </h5>
      </Link>

      <p className="mb-6 text-body">{tour.shortDescription}</p>
      <Link
        href={tourLink}
        className="inline-flex items-center text-body bg-neutraondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outli
      e-none"
      >
        Read more
        <svg
          className="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 12H5m14 0-4 4m4-4-4-4"
          />
        </svg>
      </Link>
    </div>
  );
}
