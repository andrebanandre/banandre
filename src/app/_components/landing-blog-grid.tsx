import { Suspense } from "react";
import { getPostsPaginated } from "../../lib/wordpress";
import { normalizeWordPressPost } from "../../lib/content-types";
import { ClientBlogGrid } from "./client-blog-grid";

export async function LandingBlogGrid() {
  try {
    // Fetch only first page of posts (12 posts) to reduce CPU usage
    // Pass total pages count for pagination
    const response = await getPostsPaginated(1, 12);
    const allPosts = response.data.map(normalizeWordPressPost);
    const totalPages = response.headers.totalPages;

    if (allPosts.length === 0) {
      return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center py-16">
          <h2 className="text-2xl font-bold text-[var(--accent)] mb-4 uppercase tracking-wide">
            No Articles Found
          </h2>
          <p className="text-gray-300 text-lg">Start writing to see them here!</p>
        </div>
      );
    }

    // Pass initial posts and total pages to client component
    return (
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center py-16">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        }
      >
        <ClientBlogGrid initialPosts={allPosts} totalPages={totalPages} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center py-16">
        <h2 className="text-2xl font-bold text-[var(--accent)] mb-4 uppercase tracking-wide">
          Error Loading Articles
        </h2>
        <p className="text-gray-300 text-lg">Unable to load articles at the moment.</p>
      </div>
    );
  }
}
