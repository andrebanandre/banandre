import Link from "next/link";
import { formatCategoryForUrl } from "../../lib/url-utils";

interface CategoryProps {
  category: string;
  slug?: string; // WordPress category slug for proper URL
}

export function Category({ category, slug }: CategoryProps) {
  // Use slug if provided (WordPress), otherwise format the category name (legacy MDX)
  const categoryUrl = slug || formatCategoryForUrl(category);

  return (
    <Link href={`/categories/${categoryUrl}`}>
      <span className="bg-[var(--accent)] text-[var(--blue-accent)] px-3 py-1 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-[var(--blue-accent)] transition-colors cursor-pointer brutalist-border">
        {category}
      </span>
    </Link>
  );
}
