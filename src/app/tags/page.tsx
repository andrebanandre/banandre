import { getAllTags, getAllPosts } from "../../lib/wordpress";
import { normalizeWordPressPost } from "../../lib/content-types";
import { getUniqueTagsFromPosts } from "../../lib/content-types";
import { Tag } from "../_components/tag";

export default async function TagsPage() {
  // Fetch all posts to calculate tag counts
  const wordpressPosts = await getAllPosts();
  const posts = wordpressPosts.map(normalizeWordPressPost);
  const tagStats = getUniqueTagsFromPosts(posts);

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 md:px-12 py-8 lg:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="display-title text-white mb-4 text-shadow-brutal">All Articles</h1>
          <p className="text-gray-200 text-lg">
            Explore articles by topic. Click on any tag to see related content.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8">
          {tagStats.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No tags found.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-4">
                {tagStats.map(({ tag, count }) => (
                  <div key={tag} className="relative">
                    <Tag tag={tag} />
                    <span className="absolute -top-2 -right-2 bg-white text-[var(--blue-accent)] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t-2 border-[var(--accent)]">
                <h2 className="text-2xl font-bold text-white mb-4 uppercase">Tag Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tagStats.map(({ tag, count }) => (
                    <div
                      key={tag}
                      className="bg-[var(--card)] brutalist-border p-4 hover:bg-[var(--muted)] transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--accent)] font-bold uppercase">#{tag}</span>
                        <span className="text-white font-bold">
                          {count} article{count !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
