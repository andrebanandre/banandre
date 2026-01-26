// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wordpress.d.ts`
// origin https://github.com/9d8dev/next-wp/blob/main/lib/wordpress.ts

import querystring from "query-string";
import type { Post, Category, Tag, Page, Author, FeaturedMedia } from "./wordpress.d";

const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_WORDPRESS_URL environment variable is not defined");
}

class WordPressAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

// New types for pagination support
export interface WordPressPaginationHeaders {
  total: number;
  totalPages: number;
}

export interface WordPressResponse<T> {
  data: T;
  headers: WordPressPaginationHeaders;
}

// Keep original function for backward compatibility
async function wordpressFetch<T>(
  path: string,
  query?: Record<string, string | number | boolean>
): Promise<T> {
  const url = `${baseUrl}${path}${query ? `?${querystring.stringify(query)}` : ""}`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

// New function for paginated requests
async function wordpressFetchWithPagination<T>(
  path: string,
  query?: Record<string, string | number | boolean>
): Promise<WordPressResponse<T>> {
  const url = `${baseUrl}${path}${query ? `?${querystring.stringify(query)}` : ""}`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const data = await response.json();

  return {
    data,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

// New function for paginated posts
export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 6,
  filterParams?: {
    author?: string | number;
    tag?: string | number;
    category?: string | number;
    search?: string;
    _embed?: string | boolean;
    categories?: number;
    tags?: number;
  }
): Promise<WordPressResponse<Post[]>> {
  const query: Record<string, string | number | boolean> = {
    _embed: true,
    per_page: perPage,
    page,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;
  }
  if (filterParams?.author) {
    query.author = filterParams.author;
  }
  if (filterParams?.tag) {
    query.tags = filterParams.tag;
  }
  if (filterParams?.category) {
    query.categories = filterParams.category;
  }

  const url = `${baseUrl}/wp-json/wp/v2/posts${query ? `?${querystring.stringify(query)}` : ""}`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const data = await response.json();

  return {
    data,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

export async function getAllPosts(filterParams?: {
  author?: string | number;
  tag?: string | number;
  category?: string | number;
  search?: string;
}): Promise<Post[]> {
  const allPosts: Post[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const query: Record<string, string | number | boolean> = {
      _embed: true,
      per_page: 20,
      page,
    };

    if (filterParams?.search) {
      query.search = filterParams.search;

      if (filterParams?.author) {
        query.author = filterParams.author;
      }
      if (filterParams?.tag) {
        query.tags = filterParams.tag;
      }
      if (filterParams?.category) {
        query.categories = filterParams.category;
      }
    } else {
      if (filterParams?.author) {
        query.author = filterParams.author;
      }
      if (filterParams?.tag) {
        query.tags = filterParams.tag;
      }
      if (filterParams?.category) {
        query.categories = filterParams.category;
      }
    }

    const response = await wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);

    allPosts.push(...response.data);
    hasMore = page < response.headers.totalPages;
    page++;
  }

  return allPosts;
}

export async function getPostById(id: number): Promise<Post> {
  return wordpressFetch<Post>(`/wp-json/wp/v2/posts/${id}`);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { slug, _embed: true }).then(
    (posts) => posts[0]
  );
}

export async function getAllCategories(): Promise<Category[]> {
  const url = `${baseUrl}/wp-json/wp/v2/categories?_embed=true&hide_empty=true`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Next.js WordPress Client" },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

export async function getCategoryById(id: number): Promise<Category> {
  return wordpressFetch<Category>(`/wp-json/wp/v2/categories/${id}`);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", { slug }).then(
    (categories) => categories[0]
  );
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: categoryId,
  });
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { tags: tagId });
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { post: postId });
}

export async function getAllTags(): Promise<Tag[]> {
  const url = `${baseUrl}/wp-json/wp/v2/tags?_embed=true&hide_empty=true&per_page=100`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Next.js WordPress Client" },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

export async function getTagById(id: number): Promise<Tag> {
  return wordpressFetch<Tag>(`/wp-json/wp/v2/tags/${id}`);
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { slug }).then((tags) => tags[0]);
}

export async function getAllPages(): Promise<Page[]> {
  return wordpressFetch<Page[]>("/wp-json/wp/v2/pages");
}

export async function getPageById(id: number): Promise<Page> {
  return wordpressFetch<Page>(`/wp-json/wp/v2/pages/${id}`);
}

export async function getPageBySlug(slug: string): Promise<Page> {
  return wordpressFetch<Page[]>("/wp-json/wp/v2/pages", { slug }).then((pages) => pages[0]);
}

export async function getAllAuthors(): Promise<Author[]> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users");
}

export async function getAuthorById(id: number): Promise<Author> {
  return wordpressFetch<Author>(`/wp-json/wp/v2/users/${id}`);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users", { slug }).then((users) => users[0]);
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { author: authorId });
}

export async function getPostsByAuthorSlug(authorSlug: string): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { author: author.id });
}

export async function getPostsByCategorySlug(
  categorySlug: string,
  page: number = 1,
  perPage: number = 12
): Promise<WordPressResponse<Post[]>> {
  const category = await getCategoryBySlug(categorySlug);
  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", {
    categories: category.id,
    _embed: true,
    per_page: perPage,
    page,
  });
}

export async function getPostsByTagSlug(
  tagSlug: string,
  page: number = 1,
  perPage: number = 12
): Promise<WordPressResponse<Post[]>> {
  const tag = await getTagBySlug(tagSlug);
  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", {
    tags: tag.id,
    _embed: true,
    per_page: perPage,
    page,
  });
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  return wordpressFetch<FeaturedMedia>(`/wp-json/wp/v2/media/${id}`);
}

export async function searchCategories(query: string): Promise<Category[]> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", {
    search: query,
    per_page: 100,
  });
}

export async function searchTags(query: string): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", {
    search: query,
    per_page: 100,
  });
}

export async function searchAuthors(query: string): Promise<Author[]> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users", {
    search: query,
    per_page: 100,
  });
}

// Function specifically for generateStaticParams - fetches ALL posts
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const allSlugs: { slug: string }[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", {
      per_page: 100,
      page,
      _fields: "slug", // Only fetch slug field for performance
    });

    const posts = response.data;
    allSlugs.push(...posts.map((post) => ({ slug: post.slug })));

    hasMore = page < response.headers.totalPages;
    page++;
  }

  return allSlugs;
}

// Enhanced pagination functions for specific queries
export async function getPostsByCategoryPaginated(
  categoryId: number,
  page: number = 1,
  perPage: number = 6
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    categories: categoryId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostsByTagPaginated(
  tagId: number,
  page: number = 1,
  perPage: number = 6
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    tags: tagId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostsByAuthorPaginated(
  authorId: number,
  page: number = 1,
  perPage: number = 6
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    author: authorId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export { WordPressAPIError };

// Client-safe functions (no Next.js caching)
// These can be used in client components

/**
 * Client-safe function to search posts directly from WordPress
 * Works in both server and client components
 */
export async function searchPosts(query: string, perPage: number = 10): Promise<Post[]> {
  const url = `${baseUrl}/wp-json/wp/v2/posts?search=${encodeURIComponent(query)}&per_page=${perPage}&_embed=true`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Next.js WordPress Client",
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}




/**
 * Fetches related posts using the custom blog-writer API endpoint
 * This endpoint provides optimized related posts based on tag matching
 * @param tagSlugs - Array of tag slugs to match
 * @param max - Maximum number of posts to return
 * @param excludedIds - Optional array of post IDs to exclude
 * @returns RelatedPostsResponse with matched posts and query info
 */
// Sitemap-optimized types
export interface SitemapPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  featured_media_url?: string;
}

/**
 * Get total post count without fetching all posts
 * Uses HEAD request pattern or minimal query
 */
export async function getPostCount(): Promise<number> {
  const url = `${baseUrl}/wp-json/wp/v2/posts?per_page=1`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Next.js WordPress Client" },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return parseInt(response.headers.get("X-WP-Total") || "0", 10);
}

/**
 * Optimized function for sitemap generation
 * Fetches only required fields with larger batch size
 * Note: _embed must be used without _fields restriction for featured media to work
 */
export async function getPostsForSitemap(
  page: number = 1,
  perPage: number = 100
): Promise<WordPressResponse<SitemapPost[]>> {
  const url = `${baseUrl}/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}&_embed=true`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Next.js WordPress Client" },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const data = await response.json();

  // Transform to extract featured media URL
  const posts: SitemapPost[] = data.map((post: any) => ({
    id: post.id,
    slug: post.slug,
    date: post.date,
    modified: post.modified,
    featured_media_url: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
  }));

  return {
    data: posts,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

/**
 * Get the newest post date at a specific offset
 * Used to get the lastmod date for each sitemap batch
 */
export async function getNewestPostDateAtOffset(offset: number): Promise<string | null> {
  // WordPress API uses 1-based pagination, offset maps to page
  const page = Math.floor(offset / 100) + 1;
  const positionInPage = offset % 100;

  const url = `${baseUrl}/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=date,modified&orderby=date&order=desc`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Next.js WordPress Client" },
  });

  if (!response.ok) {
    return null;
  }

  const posts = await response.json();
  if (posts.length > positionInPage) {
    const post = posts[positionInPage];
    return post.modified || post.date;
  }

  return null;
}

/**
 * Get all posts for sitemap in a single batch range
 */
export async function getPostsBatchForSitemap(
  offset: number,
  limit: number
): Promise<SitemapPost[]> {
  const perPage = 100;
  const allPosts: SitemapPost[] = [];
  const startPage = Math.floor(offset / perPage) + 1;
  const endOffset = offset + limit;

  let currentOffset = offset;
  let page = startPage;

  while (currentOffset < endOffset) {
    const response = await getPostsForSitemap(page, perPage);
    const posts = response.data;

    if (posts.length === 0) break;

    // Calculate which posts from this page we need
    const pageStartOffset = (page - 1) * perPage;
    const skipFromStart = Math.max(0, currentOffset - pageStartOffset);
    const takeCount = Math.min(posts.length - skipFromStart, endOffset - currentOffset);

    allPosts.push(...posts.slice(skipFromStart, skipFromStart + takeCount));
    currentOffset += takeCount;
    page++;

    if (page > response.headers.totalPages) break;
  }

  return allPosts;
}

export async function getRelatedPostsByTags(
  tagSlugs: string[],
  max: number = 5,
  excludedIds: number[] = []
): Promise<import("./wordpress.d").RelatedPostsResponse> {
  const query: Record<string, any> = {
    tags: tagSlugs.join(","),
    max,
  };

  if (excludedIds.length > 0) {
    query.exclude = excludedIds.join(",");
  }

  const url = `${baseUrl}/wp-json/blog-writer/v1/related-posts${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}