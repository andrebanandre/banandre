import { getAllCategories } from "@/lib/wordpress";
import { CategoryCard } from "../_components/category-card";

export default async function CategoriesPage() {
  // Fetch WordPress categories only
  const wpCategories = await getAllCategories();

  // Transform to match expected format
  const categories = wpCategories.map((cat) => ({
    name: cat.name,
    count: cat.count,
    imageUrl: cat._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
  }));

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 md:px-12 py-8 lg:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="display-title text-white mb-4 text-shadow-brutal">
            All Categories
          </h1>
          <p className="text-gray-200 text-lg">
            Explore articles by category. Click on any category to see related
            content.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No categories found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.name} category={category} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
