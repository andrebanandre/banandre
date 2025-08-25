import { getAllCategories, formatCategoryForUrl } from "../../lib/blog-utils";
import Link from "next/link";

export async function AllCategoriesDisplay() {
  try {
    const allCategories = await getAllCategories();

    return (
      <div className="flex flex-wrap gap-2">
        {allCategories.slice(0, 12).map(({ category, count }) => (
          <Link key={category} href={`/categories/${formatCategoryForUrl(category)}`}>
            <span className="bg-[var(--muted)] text-white px-2 py-1 text-xs font-bold uppercase tracking-wider hover:bg-[var(--accent)] hover:text-[var(--blue-accent)] transition-colors cursor-pointer">
              {category.toUpperCase()} ({count})
            </span>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error loading categories:", error);
    return (
      <div className="flex flex-wrap gap-2">
        {[
          "ARTIFICIAL INTELLIGENCE",
          "SOFTWARE ARCHITECTURE",
          "DATA SCIENCE",
          "MACHINE LEARNING",
          "CLOUD COMPUTING",
          "CYBERSECURITY",
          "BLOCKCHAIN",
          "DEVOPS",
          "MOBILE DEVELOPMENT",
          "WEB DEVELOPMENT",
          "ALGORITHMS",
          "DATABASES",
        ].map((category) => (
          <Link key={category} href={`/categories/${formatCategoryForUrl(category)}`}>
            <span className="bg-[var(--muted)] text-white px-2 py-1 text-xs font-bold uppercase tracking-wider hover:bg-[var(--accent)] hover:text-[var(--blue-accent)] transition-colors cursor-pointer">
              {category} ({Math.floor(Math.random() * 50) + 5})
            </span>
          </Link>
        ))}
      </div>
    );
  }
}
