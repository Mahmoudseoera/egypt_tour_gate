import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  title: string;
  description: string;
  image: string;
  link: string;
};

export default function CategoryCard({
  title,
  description,
  image,
  link,
}: CategoryCardProps) {
  return (
    <div className="p-20 bg-purple-100">
      <h3 className="text-purple-400 font-bold mb-4 text-sm">
        2. Card w/ image
      </h3>

      <div className="bg-white rounded-lg w-full md:w-1/2 shadow-lg">
        <Image
          src={image}
          alt={title}
          width={634}
          height={400}
          className="rounded-t-lg object-cover"
        />

        <div className="p-6">
          <h2 className="font-bold mb-2 text-2xl text-purple-700">
            {title}
          </h2>

          <p className="mb-2 text-gray-700">
            {description}
          </p>

          <Link
            href={link}
            className="text-purple-600 hover:text-blue-400 underline text-sm"
          >
            Read more ...
          </Link>
        </div>
      </div>
    </div>
  );
}
