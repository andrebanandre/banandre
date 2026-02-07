// Server Component - Fetches related posts server-side for better SEO and performance
import { getRelatedPostsByTags, transformMediaUrl } from "@/lib/wordpress";
import { BlogCard } from "./blog-card";
import type { RelatedPost } from "@/lib/wordpress.d";
import type { NormalizedPost } from "@/lib/content-types";

interface RelatedPostsProps {
  currentPostId: number;
  tagSlugs: string[];
}

// Convert RelatedPost to NormalizedPost format compatible with BlogCard
function convertRelatedPost(post: RelatedPost): NormalizedPost {
  return {
    title: post.title,
    description: post.excerpt,
    excerpt: post.excerpt,
    image: transformMediaUrl(post.featured_image) || undefined,
    slug: post.slug,
    url: `/blog/${post.slug}`,
    date: post.date,
    categories: post.categories.map((cat) => cat.name),
    tags: post.tags.map((tag) => tag.name),
    author: post.author.name,
  };
}

export async function RelatedPosts({ currentPostId, tagSlugs }: RelatedPostsProps) {
  try {
    // Don't fetch if no tags
    if (!tagSlugs || tagSlugs.length === 0) {
      return null;
    }

    // Fetch related posts using the tag-based endpoint
    const response = await getRelatedPostsByTags(tagSlugs, 5, [currentPostId]);

    // Don't render if no related posts
    if (!response.success || response.posts.length === 0) {
      return null;
    }

    // Limit to 4 related posts
    const relatedPosts = response.posts.slice(0, 4).map(convertRelatedPost);

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
