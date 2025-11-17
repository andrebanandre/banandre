// Unified content types for WordPress + MDX hybrid system
import type { Post as WordPressPost, Category, Tag } from "./wordpress.d";
import type { BlogMetadata as MDXBlogMetadata } from "./blog-utils";

// Source discriminator
export type ContentSource = "wordpress" | "mdx";

// WordPress Post with source marker
export interface WordPressPostWithSource extends WordPressPost {
  source: "wordpress";
}

// MDX Post with source marker
export interface MDXPostWithSource extends MDXBlogMetadata {
  source: "mdx";
}

// Unified post type (discriminated union)
export type UnifiedPost = WordPressPostWithSource | MDXPostWithSource;

// Normalized post interface for display components
export interface NormalizedPost {
  source: ContentSource;
  title: string;
  description: string;
  excerpt?: string;
  image?: string;
  slug: string;
  url: string; // Full URL path for linking
  date: string; // ISO date string
  categories: string[];
  tags: string[];
  author?: string;
}

// Type guards
export function isWordPressPost(post: UnifiedPost): post is WordPressPostWithSource {
  return post.source === "wordpress";
}

export function isMDXPost(post: UnifiedPost): post is MDXPostWithSource {
  return post.source === "mdx";
}

// Helper functions to normalize posts for display
export function normalizeWordPressPost(post: WordPressPost): NormalizedPost {
  // Extract categories from embedded data
  const categories: string[] = [];
  if (post._embedded?.["wp:term"]) {
    const categoryTerms = post._embedded["wp:term"].find(
      (termArray): termArray is Category[] =>
        termArray.length > 0 && termArray[0].taxonomy === "category"
    );
    if (categoryTerms) {
      categories.push(...categoryTerms.map((cat) => cat.name));
    }
  }

  // Extract tags from embedded data
  const tags: string[] = [];
  if (post._embedded?.["wp:term"]) {
    const tagTerms = post._embedded["wp:term"].find(
      (termArray): termArray is Tag[] =>
        termArray.length > 0 && termArray[0].taxonomy === "post_tag"
    );
    if (tagTerms) {
      tags.push(...tagTerms.map((tag) => tag.name));
    }
  }

  // Extract featured image
  let image: string | undefined;
  if (post._embedded?.["wp:featuredmedia"]?.[0]) {
    image = post._embedded["wp:featuredmedia"][0].source_url;
  }

  // Extract author name
  let author: string | undefined;
  if (post._embedded?.author?.[0]) {
    author = post._embedded.author[0].name;
  }

  // Extract excerpt text (remove HTML tags)
  const excerpt = post.excerpt?.rendered
    ? post.excerpt.rendered.replace(/<[^>]*>/g, "").trim()
    : "";

  return {
    source: "wordpress",
    title: post.title.rendered,
    description: excerpt,
    excerpt: excerpt,
    image,
    slug: post.slug,
    url: `/blog/${post.slug}`,
    date: post.date,
    categories,
    tags,
    author,
  };
}

export function normalizeMDXPost(post: MDXBlogMetadata): NormalizedPost {
  return {
    source: "mdx",
    title: post.title,
    description: post.description,
    image: post.image,
    slug: post.slug,
    url: post.slug, // MDX posts already have full path like /blog/2025-11/slug
    date: post.date || new Date().toISOString(),
    categories: post.categories,
    tags: post.tags,
    author: "Banandre", // Default author for MDX posts
  };
}

// Normalize any unified post
export function normalizePost(post: UnifiedPost): NormalizedPost {
  if (isWordPressPost(post)) {
    return normalizeWordPressPost(post);
  }
  return normalizeMDXPost(post);
}

// Sort posts by date (newest first)
export function sortPostsByDate(posts: NormalizedPost[]): NormalizedPost[] {
  return posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}

// Filter posts by category
export function filterPostsByCategory(
  posts: NormalizedPost[],
  category: string
): NormalizedPost[] {
  const normalizedCategory = category.toLowerCase();
  return posts.filter((post) =>
    post.categories.some((cat) => cat.toLowerCase() === normalizedCategory)
  );
}

// Filter posts by tag
export function filterPostsByTag(
  posts: NormalizedPost[],
  tag: string
): NormalizedPost[] {
  const normalizedTag = tag.toLowerCase();
  return posts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === normalizedTag)
  );
}

// Get unique categories from posts
export function getUniqueCategoriesFromPosts(
  posts: NormalizedPost[]
): { category: string; count: number }[] {
  const categoryCounts: Record<string, number> = {};

  posts.forEach((post) => {
    post.categories.forEach((category) => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
  });

  return Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

// Get unique tags from posts
export function getUniqueTagsFromPosts(
  posts: NormalizedPost[]
): { tag: string; count: number }[] {
  const tagCounts: Record<string, number> = {};

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
