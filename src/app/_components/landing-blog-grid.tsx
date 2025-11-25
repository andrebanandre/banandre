import { Suspense } from "react";
import { getPostsPaginated } from "../../lib/wordpress";
import { normalizeWordPressPost } from "../../lib/content-types";
import { BlogGrid } from "./blog-card";
import { Pagination } from "./pagination";
import { BlogGridSkeleton } from "./blog-card-skeleton";

interface LandingBlogGridProps {
  page: number;
}

export async function LandingBlogGrid({ page }: LandingBlogGridProps) {
  try {
    // Fetch the requested page of posts (12 posts per page)
    // All data is fetched server-side for SEO
    const response = await getPostsPaginated(page, 12);
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

    // Render server-side with suspense boundary
    return (
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center py-16">
            <BlogGridSkeleton count={12} />
          </div>
        }
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
          <BlogGrid posts={allPosts} currentPage={page} totalPages={totalPages} />

          {/* Only show pagination if there are more pages */}
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} baseUrl="/" />
          )}
        </div>
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
