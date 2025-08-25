import Link from "next/link";
import { formatCategoryForUrl } from "../../lib/blog-utils";

interface CategoryProps {
  category: string;
}

export function Category({ category }: CategoryProps) {
  const categoryUrl = formatCategoryForUrl(category);

  return (
    <Link href={`/categories/${categoryUrl}`}>
      <span className="bg-[var(--accent)] text-[var(--blue-accent)] px-3 py-1 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-[var(--blue-accent)] transition-colors cursor-pointer brutalist-border">
        {category}
      </span>
    </Link>
  );
}
