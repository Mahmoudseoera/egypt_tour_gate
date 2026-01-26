import Image from "next/image";
import { notFound } from "next/navigation";
import { tours } from "@/lib/api/tours";

type PageProps = {
  params: {
    categorySlug: string;
    tourSlug: string;
  };
};

export default function TourDetailsPage({ params }: PageProps) {
  const { categorySlug, tourSlug } = params;

  const tour = tours.find(
    (t) =>
      t.slug === tourSlug &&
      t.categorySlug === categorySlug
  );

  if (!tour) {
    notFound(); 
  }

  return (
    <div className="container mx-auto p-6">
      <Image
        src={tour.image}
        alt={tour.title}
        width={800}
        height={450}
        className="rounded-base mb-6"
      />

      <h1 className="text-3xl font-bold mb-4">
        {tour.title}
      </h1>

      <p className="text-body mb-6">
        {tour.description}
      </p>

      <div className="text-xl font-semibold">
        Price: ${tour.price}
      </div>
    </div>
  );
}
