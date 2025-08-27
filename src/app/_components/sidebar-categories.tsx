"use client";

import Link from "next/link";

// Client-side version of formatCategoryForUrl
function formatCategoryForUrl(category: string): string {
  return category
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^a-z0-9-]/g, ""); // Remove all non-alphanumeric except dashes
}

export function SidebarCategories() {
  const categories = ["ARTIFICIAL INTELLIGENCE", "SOFTWARE ARCHITECTURE", "ENGINEERING MANAGEMENT"];

  return (
    <div className="mb-6">
      <div className="mb-4">
        <h3 className="text-[var(--accent)] font-black text-sm uppercase tracking-wide mb-2">
          Categories
        </h3>
        <div className="h-px bg-[var(--accent)] opacity-30" />
      </div>

      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category}>
            <Link href={`/categories/${formatCategoryForUrl(category)}`}>
              <div
                className="
                text-xs font-semibold flex items-center group 
                transition-all duration-200 py-1.5 px-3 rounded-md cursor-pointer
                hover:bg-[var(--accent)] hover:bg-opacity-10 hover:text-[var(--blue-accent)]
                text-white hover:translate-x-1
              "
              >
                <span className="uppercase tracking-wide truncate">{category}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
