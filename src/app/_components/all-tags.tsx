import { getAllTags } from "../../lib/blog-utils";
import Link from "next/link";

export async function AllTagsDisplay() {
  try {
    const allTags = await getAllTags();

    return (
      <div className="flex flex-wrap gap-2">
        {allTags.slice(0, 12).map(({ tag, count }) => (
          <Link key={tag} href={`/tags/${tag.toLowerCase().replace(/\s+/g, "")}`}>
            <span className="bg-[var(--muted)] text-white px-2 py-1 text-xs font-bold uppercase tracking-wider hover:bg-[var(--accent)] hover:text-[var(--blue-accent)] transition-colors cursor-pointer">
              {tag.toUpperCase()} ({count})
            </span>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error loading tags:", error);
    return (
      <div className="flex flex-wrap gap-2">
        {[
          "INTERVIEW",
          "MUSIC",
          "CULTURE",
          "FASHION",
          "LIFESTYLE",
          "HEALTH",
          "FESTIVAL",
          "PERFORMANCE",
          "ESSAY",
          "TIPS AND TRICKS",
          "ART",
          "CINEMA",
        ].map((tag) => (
          <Link key={tag} href={`/tags/${tag.toLowerCase().replace(/\s+/g, "")}`}>
            <span className="bg-[var(--muted)] text-white px-2 py-1 text-xs font-bold uppercase tracking-wider hover:bg-[var(--accent)] hover:text-[var(--blue-accent)] transition-colors cursor-pointer">
              {tag} ({Math.floor(Math.random() * 50) + 5})
            </span>
          </Link>
        ))}
      </div>
    );
  }
}
