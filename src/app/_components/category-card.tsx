"use client";

import Link from "next/link";
import Image from "next/image";
import { formatCategoryForUrl } from "../../lib/url-utils";

interface CategoryCardProps {
  category: {
    name: string;
    count: number;
    imageUrl?: string;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const categoryUrl = formatCategoryForUrl(category.name);

  return (
    <div className="bg-[var(--card)] group hover:shadow-[4px_4px_0px_var(--accent)] transition-all duration-200 overflow-hidden rounded-md">
      <Link href={`/categories/${categoryUrl}`} className="block h-full">
        <div className="h-full flex flex-col relative">
          {category.imageUrl && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          <div className="flex-1 p-4 flex flex-col min-h-0">
            <div className="flex-1 min-h-0">
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--accent)] transition-colors uppercase tracking-wide line-clamp-2">
                {category.name}
              </h3>
            </div>
            <div className="mt-auto">
              <span className="text-white font-bold">
                {category.count} article{category.count !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
