import CategoryCard from "@/components/tour/category-card";
import { travelCategories } from "@/lib/api/tours";


export default function ToursPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <h1>صفحة ال categories كلها</h1>
      {travelCategories.map((category) => (
        <CategoryCard 
          key={category.id} 
          title={category.title}
          description={category.description}
          image={category.image}
          link={`/tours/${category.slug}`}
        />
      ))}
    </div>
  );
}