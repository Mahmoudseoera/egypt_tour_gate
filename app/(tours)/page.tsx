
// All Category Page //
// import CategoryCard from "@/components/tour/category-card";
import categoriesData from "@/lib/api/categories";


export default async function ToursPage({
  params,
}: {
  params: Promise<{ pageTitle?: string }>;
}) {
  const resolved = await params;
  const pageTitle = resolved?.pageTitle ?? "Tours";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <h3>{pageTitle}</h3>
    </div>
  );
}