// All Category Page //
import Link from "next/link";
import Image from "next/image";

type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
};

const photos = [
  "/assets/images/tours/106896752__MG_7633-final_Pompeys_Pillar-webp.webp",
  "/assets/images/tours/camel front of giza pyramids.jpg",
  "/assets/images/tours/Pyramids-in-Egypt-webp.webp",
];

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local"
    );
  }

  const res = await fetch(`${baseUrl}/general`, { cache: "no-store" });
  const data = await res.json();
  const categories = data.data.header.headerCategories;
  const category = categories.find((cat: any) => cat.slug === categorySlug);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="hover:text-[var(--main-color)] transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <span className="text-gray-300 select-none">&gt;</span>
            <span className="text-[var(--second-color)] font-semibold capitalize">
              {categorySlug.replace(/-/g, " ")}
            </span>
          </nav>
        </div>
      </div>

      {/* ── Page Hero ── */}
      <div
        className="relative py-14 overflow-hidden"
        style={{ backgroundColor: "var(--second-color)" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full opacity-10 bg-[var(--main-color)]" />
        <div className="absolute -bottom-14 -right-14 w-72 h-72 rounded-full opacity-10 bg-[var(--main-color)]" />

        <div className="relative z-10 text-center px-4">
          <p className="text-[var(--main-color)] font-semibold tracking-widest uppercase text-xs mb-3">
            Explore
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white capitalize leading-tight">
            {category.name.en.toLowerCase()}
          </h1>
          {/* Gold divider */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="h-px w-16 bg-[var(--main-color)] opacity-60" />
            <svg
              className="w-4 h-4 text-[var(--main-color)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
            <span className="h-px w-16 bg-[var(--main-color)] opacity-60" />
          </div>
        </div>
      </div>

      {/* ── Cards Grid ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(category.children ?? []).map((child: any, index: number) => (
            <Link
              key={child.id}
              href={`/${category.slug}/${child.slug}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 border border-gray-100 hover:border-[var(--main-color)]"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* ── Image ── */}
              <div className="relative h-56 overflow-hidden flex-shrink-0">
                <Image
                  src={photos[child.id % photos.length]}
                  alt={child.name?.en ?? "category"}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark scrim for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                {/* Category label pill */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[var(--main-color)] shadow-md">
                  {category.name.en}
                </div>

                {/* Arrow icon on hover */}
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <svg
                    className="w-4 h-4 text-[var(--second-color)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>

              {/* ── Body ── */}
              <div className="flex flex-col flex-1 p-6 gap-4">
                {/* Title */}
                <h3
                  className="text-xl font-bold capitalize leading-snug transition-colors duration-200 group-hover:text-[var(--main-color)]"
                  style={{ color: "var(--second-color)" }}
                >
                  {child.name.en.toLowerCase()}
                </h3>

                {/* Description — max 4 lines */}
                <p
                  className="text-sm leading-relaxed flex-1 overflow-hidden"
                  style={{
                    color: "var(--black-color)",
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde
                  doloribus dolorem perferendis ab corporis eum natus asperiores
                  rem esse mollitia dicta nihil sunt consequatur, voluptates
                  adipisci sint nulla alias numquam. Quisquam vitae nemo
                  excepturi labore iure similique.
                </p>

                {/* ── CTA — always visible ── */}
                <div className="pt-2 border-t border-gray-100">
                  <span
                    className="inline-flex items-center gap-2 w-full justify-center py-3 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-300 group-hover:gap-3"
                    style={{ backgroundColor: "var(--second-color)" }}
                  >
                    View Tours
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Gold bottom accent bar */}
              <div
                className="h-1 w-full transition-all duration-500"
                style={{ backgroundColor: "var(--main-color)" }}
              />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
