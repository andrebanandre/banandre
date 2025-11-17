// Blog aggregator: Merges WordPress and MDX posts into a unified system
import { getPostsPaginated } from "./wordpress";
import { getAllBlogPosts as getMDXPosts } from "./blog-utils";
import type { Post as WordPressPost } from "./wordpress.d";
import type { BlogMetadata } from "./blog-utils";
import {
  normalizeWordPressPost,
  normalizeMDXPost,
  sortPostsByDate,
  filterPostsByCategory,
  filterPostsByTag,
  getUniqueCategoriesFromPosts,
  getUniqueTagsFromPosts,
  type NormalizedPost,
} from "./content-types";

/**
 * Fetch all WordPress posts using pagination to avoid cache size limits
 * Fetches posts in batches of 20 to stay under 2MB cache limit
 */
async function getAllWordPressPosts(): Promise<WordPressPost[]> {
  const allPosts: WordPressPost[] = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await getPostsPaginated(page, 20); // Reduced from 100 to 20 per page
      allPosts.push(...response.data);

      hasMore = page < response.headers.totalPages;
      page++;

      // Safety limit: max 500 posts to prevent infinite loops
      if (allPosts.length >= 500) {
        console.warn("Reached maximum post limit (500)");
        break;
      }
    }

    return allPosts;
  } catch (error) {
    console.error("Error fetching WordPress posts:", error);
    return [];
  }
}

/**
 * Fetch all posts from both WordPress and MDX sources
 * Returns normalized posts sorted by source priority and date:
 * - WordPress posts first (newest to oldest)
 * - Then MDX posts (newest to oldest)
 */
export async function getAllCombinedPosts(): Promise<NormalizedPost[]> {
  try {
    // Fetch from both sources in parallel
    const [wordpressPosts, mdxPosts] = await Promise.all([
      getAllWordPressPosts().catch((error) => {
        console.warn("Failed to fetch WordPress posts:", error);
        return [] as WordPressPost[];
      }),
      getMDXPosts().catch((error) => {
        console.warn("Failed to fetch MDX posts:", error);
        return [] as BlogMetadata[];
      }),
    ]);

    // Normalize WordPress posts
    const normalizedWordPressPosts = wordpressPosts.map(normalizeWordPressPost);

    // Normalize MDX posts
    const normalizedMDXPosts = mdxPosts.map(normalizeMDXPost);

    // Sort each group by date
    const sortedWordPressPosts = sortPostsByDate(normalizedWordPressPosts);
    const sortedMDXPosts = sortPostsByDate(normalizedMDXPosts);

    // WordPress posts first, then MDX posts (as per user preference)
    return [...sortedWordPressPosts, ...sortedMDXPosts];
  } catch (error) {
    console.error("Error in getAllCombinedPosts:", error);
    // Fallback to MDX only if everything fails
    const mdxPosts = await getMDXPosts();
    return mdxPosts.map(normalizeMDXPost);
  }
}

/**
 * @deprecated Use WordPress getPostsByCategorySlug() directly instead.
 * This function is no longer used as categories are now WordPress-only.
 * Get all posts filtered by category from both sources
 */
export async function getCombinedPostsByCategory(
  category: string
): Promise<NormalizedPost[]> {
  const allPosts = await getAllCombinedPosts();
  return filterPostsByCategory(allPosts, category);
}

/**
 * Get all posts filtered by tag from both sources
 */
export async function getCombinedPostsByTag(tag: string): Promise<NormalizedPost[]> {
  const allPosts = await getAllCombinedPosts();
  return filterPostsByTag(allPosts, tag);
}

/**
 * @deprecated Use WordPress getAllCategories() directly instead.
 * This function is no longer used as categories are now WordPress-only.
 * Get all unique categories from both sources with counts
 */
export async function getAllCombinedCategories(): Promise<{
  category: string;
  count: number;
}[]> {
  const allPosts = await getAllCombinedPosts();
  return getUniqueCategoriesFromPosts(allPosts);
}

/**
 * Get all unique tags from both sources with counts
 */
export async function getAllCombinedTags(): Promise<{ tag: string; count: number }[]> {
  const allPosts = await getAllCombinedPosts();
  return getUniqueTagsFromPosts(allPosts);
}

/**
 * Get a single post by slug from either source
 * Checks WordPress first, then MDX
 */
export async function getPostBySlug(slug: string): Promise<NormalizedPost | null> {
  try {
    // Try WordPress first
    const { getPostBySlug: getWPPostBySlug } = await import("./wordpress");
    const wpPost = await getWPPostBySlug(slug).catch(() => null);

    if (wpPost) {
      return normalizeWordPressPost(wpPost);
    }

    // Fall back to MDX
    const { getBlogPostBySlug } = await import("./blog-utils");
    const mdxPost = await getBlogPostBySlug(slug);

    if (mdxPost) {
      return normalizeMDXPost(mdxPost);
    }

    return null;
  } catch (error) {
    console.error("Error in getPostBySlug:", error);
    return null;
  }
}

/**
 * Search posts by keyword across both sources
 */
export async function searchPosts(query: string): Promise<NormalizedPost[]> {
  const allPosts = await getAllCombinedPosts();
  const lowerQuery = query.toLowerCase();

  return allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      post.categories.some((cat) => cat.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get posts with pagination
 * @param page - Page number (1-indexed)
 * @param perPage - Posts per page
 * @returns Paginated posts and total count
 */
export async function getPaginatedPosts(
  page: number = 1,
  perPage: number = 12
): Promise<{
  posts: NormalizedPost[];
  total: number;
  totalPages: number;
  currentPage: number;
}> {
  const allPosts = await getAllCombinedPosts();
  const total = allPosts.length;
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    total,
    totalPages,
    currentPage: page,
  };
}

/**
 * Get related posts based on shared tags
 * @param currentPostSlug - Slug of the current post
 * @param limit - Maximum number of related posts to return
 */
export async function getRelatedPosts(
  currentPostSlug: string,
  limit: number = 3
): Promise<NormalizedPost[]> {
  const allPosts = await getAllCombinedPosts();
  const currentPost = allPosts.find((p) => p.slug === currentPostSlug);

  if (!currentPost) {
    return [];
  }

  // Calculate similarity scores based on shared tags
  const postsWithScores = allPosts
    .filter((post) => post.slug !== currentPostSlug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) =>
        currentPost.tags.includes(tag)
      );
      const sharedCategories = post.categories.filter((cat) =>
        currentPost.categories.includes(cat)
      );

      // Score: 2 points per shared category, 1 point per shared tag
      const score = sharedCategories.length * 2 + sharedTags.length;

      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return postsWithScores.map(({ post }) => post);
}
