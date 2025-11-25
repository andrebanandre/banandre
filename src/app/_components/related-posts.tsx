// Server Component - Fetches related posts server-side for better SEO and performance
import { getPostsByCategoryPaginated } from "@/lib/wordpress";
import { BlogCard } from "./blog-card";
import { normalizeWordPressPost } from "@/lib/content-types";

interface RelatedPostsProps {
  currentPostId: number;
  categoryId: number;
}

export async function RelatedPosts({ currentPostId, categoryId }: RelatedPostsProps) {
  try {
    // Fetch related posts from the same category, server-side
    const response = await getPostsByCategoryPaginated(categoryId, 1, 5);

    // Filter out current post and limit to 4 related posts
    const relatedPosts = response.data
      .filter((post) => post.id !== currentPostId)
      .slice(0, 4)
      .map(normalizeWordPressPost);

    // Don't render if no related posts
    if (relatedPosts.length === 0) {
      return null;
    }

    return (
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold text-[var(--accent)] mb-8 uppercase tracking-wide">
          Related Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedPosts.map((relatedPost) => (
            <BlogCard key={relatedPost.slug} post={relatedPost} size="medium" />
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.warn("Failed to fetch related posts:", error);
    return null;
  }
}
