import { getAllCategories } from "@/lib/wordpress";
import Link from "next/link";

export async function AllCategoriesDisplay() {
  try {
    // Fetch WordPress categories only
    const wpCategories = await getAllCategories();

    return (
      <div className="flex flex-wrap gap-2">
        {wpCategories.slice(0, 12).map((cat) => (
          <Link key={cat.id} href={`/categories/${cat.slug}`}>
            <span className="bg-[var(--muted)] text-white px-2 py-1 text-xs font-bold uppercase tracking-wider hover:bg-[var(--accent)] hover:text-[var(--blue-accent)] transition-colors cursor-pointer">
              {cat.name.toUpperCase()} ({cat.count})
            </span>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error loading categories:", error);
    return (
      <div className="text-center py-4">
        <p className="text-gray-400">Unable to load categories. Please try again later.</p>
      </div>
    );
  }
}
