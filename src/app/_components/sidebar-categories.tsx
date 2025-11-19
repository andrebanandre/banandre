import Link from "next/link";
import { getAllCategories } from "@/lib/wordpress";
import { formatCategoryForUrl } from "@/lib/url-utils";

export async function SidebarCategories() {
  const categories = await getAllCategories();

  // Sort by count and take top 10
  const topCategories = categories
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h3 className="text-[var(--accent)] font-black text-sm uppercase tracking-wide mb-2">
          Categories
        </h3>
        <div className="h-px bg-[var(--accent)] opacity-30" />
      </div>

      <div className="space-y-2">
        {topCategories.map((category) => (
          <Link key={category.id} href={`/categories/${formatCategoryForUrl(category.name)}`}>
            <div
              className="
              text-xs font-semibold flex items-center justify-between group
              transition-all duration-200 py-1.5 px-3 rounded-md cursor-pointer
              hover:bg-[var(--accent)] hover:bg-opacity-10 hover:text-[var(--blue-accent)]
              text-white hover:translate-x-1
            "
            >
              <span className="uppercase tracking-wide truncate">{category.name}</span>
              <span className="text-[var(--accent)] text-xs ml-2">({category.count})</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
