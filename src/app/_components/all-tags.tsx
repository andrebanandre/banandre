import { getAllTags } from "../../lib/wordpress";
import Link from "next/link";

export async function AllTagsDisplay() {
  try {
    // Get tags directly from WordPress API to access both name and slug
    const tags = await getAllTags();

    // Sort by count (most used first)
    const sortedTags = tags
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    return (
      <div className="flex flex-wrap gap-2">
        {sortedTags.map((tag) => (
          <Link key={tag.id} href={`/tags/${tag.slug}`}>
            <span className="bg-[var(--muted)] text-white px-2 py-1 text-xs font-bold uppercase tracking-wider hover:bg-[var(--accent)] hover:text-[var(--blue-accent)] transition-colors cursor-pointer">
              {tag.name.toUpperCase()} ({tag.count})
            </span>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error loading tags:", error);
    return (
      <div className="flex flex-wrap gap-2">
        <span className="text-gray-400">Unable to load tags</span>
      </div>
    );
  }
}
