// Category Page //
import Link from "next/link";
import Image from "next/image";
type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;

  // fetch categories (use same env as rest of app; avoid relative URL on server)
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local"
    );
  }
  const res = await fetch(`${baseUrl}/general`, { cache: "no-store" });
  const data = await res.json();

  const categories = data.data.header.headerCategories;

  // parent category
  const category = categories.find((cat: any) => cat.slug === categorySlug);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[var(--main-color)] underline-offset-4">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-navy font-medium">
              {categorySlug.replace(/-/g, " ")}
            </span>
          </nav>
        </div>
      </div>
      <section className="sub-category max-w-7xl mx-auto py-16">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {category.name.en}
        </h1>
        {/* {categorySlug} */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(category.children ?? []).map((child: any) => (
            // <Link
            //   key={child.id}
            //   href={`/${category.slug}/${child.slug}`}
            //   className="p-4 border rounded-lg hover:shadow-lg hover:border-[var(--main-color)] transition-all block"
            // >
            //   {child.name.en}
            // </Link>
            <div
              key={child.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <Link href={`/${category.slug}/${child.slug}`}>
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
                    alt="test"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 ease-out"
                  />

                  {/* Overlay Gradient */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, var(--second-color))",
                    }}
                  ></div>

                  {/* Decorative Corner Badge */}
                  <div
                    className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform translate-x-16 group-hover:translate-x-0 transition-transform duration-500"
                    style={{ backgroundColor: "var(--main-color)" }}
                  >
                    <svg
                      className="w-6 h-6"
                      style={{ color: "var(--white-color)" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    className="text-2xl font-bold mb-3 group-hover:translate-x-1 transition-transform duration-300"
                    style={{ color: "var(--second-color)" }}
                  >
                    {child.name.en}
                  </h3>

                  <p
                    className="mb-6 leading-relaxed"
                    style={{ color: "var(--black-color)" }}
                  >
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Unde doloribus dolorem perferendis ab corporis eum natus
                    asperiores rem esse mollitia dicta nihil sunt consequatur,
                    voluptates adipisci sint nulla alias numquam.
                  </p>

                  {/* CTA Button */}
                  <button
                    className="w-full py-3 px-6 rounded-lg font-semibold text-white relative overflow-hidden group/btn transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100"
                    style={{ backgroundColor: "var(--second-color)" }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      go to tours
                      <svg
                        className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300"
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

                    {/* Button Hover Effect */}
                    <div
                      className="absolute inset-0 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"
                      style={{ backgroundColor: "var(--main-color)" }}
                    ></div>
                  </button>
                </div>

                {/* Bottom Accent Line */}
                <div
                  className="h-1 w-0 group-hover:w-full transition-all duration-500 ease-out"
                  style={{ backgroundColor: "var(--main-color)" }}
                ></div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
