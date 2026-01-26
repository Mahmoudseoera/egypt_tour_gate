type CategoryPageProps = {
  params: {
    categorySlug: string;
  };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = params;

  // fetch categories
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/general`,
    { cache: "no-store" }
  );
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
        {category.children.map((child: any) => (
          <a
            key={child.id}
            href={`/tours/${category.slug}/${child.slug}`}
            className="p-4 border rounded-lg hover:shadow"
          >
            {child.name.en}
          </a>
        ))}
      </div>
    </div>
  );
}
