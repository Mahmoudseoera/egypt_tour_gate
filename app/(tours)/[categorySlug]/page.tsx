import Link from "next/link";

type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;

  // fetch categories (use same env as rest of app; avoid relative URL on server)
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set. Add it to .env.local");
  }
  const res = await fetch(`${baseUrl}/general`, { cache: "no-store" });
  const data = await res.json();

  const categories = data.data.header.headerCategories;

  // parent category
  const category = categories.find(
    (cat: any) => cat.slug === categorySlug
  );

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">
        {category.name.en}
      </h1>
         صفحة الcategory الواحدة
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(category.children ?? []).map((child: any) => (
          <Link
            key={child.id}
            href={`/${category.slug}/${child.slug}`}
            className="p-4 border rounded-lg hover:shadow-lg hover:border-[var(--main-color)] transition-all block"
          >
            {child.name.en}
          </Link>
        ))}
      </div>
    </div>
  );
}
