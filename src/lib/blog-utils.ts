import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  categories?: string[];
  slug: string;
  content: string;
  date?: string;
}

export interface BlogMetadata {
  title: string;
  description: string;
  image?: string;
  slug: string;
  tags: string[];
  categories: string[];
  date?: string;
  similarityScore?: number;
  sharedTags?: string[];
}

// Extract tags from MDX content (both frontmatter and inline tags)
export function extractTagsFromContent(content: string): string[] {
  const tags: string[] = [];

  // Match tags in the format: **Tags:** #AI #Design #Brutalism
  const tagRegex = /\*\*Tags:\*\*\s*((?:#\w+\s*)+)/g;
  const matches = content.match(tagRegex);

  if (matches) {
    matches.forEach((match) => {
      // Extract individual hashtags
      const hashtagMatches = match.match(/#(\w+)/g);
      if (hashtagMatches) {
        hashtagMatches.forEach((hashtag) => {
          const tag = hashtag.replace("#", "");
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
      }
    });
  }

  return tags;
}

// Get all blog posts from the app directory
export async function getAllBlogPosts(): Promise<BlogMetadata[]> {
  const posts: BlogMetadata[] = [];
  const appDir = path.join(process.cwd(), "src/app");

  // Recursively find all page.mdx files
  const findMdxFiles = (dir: string): string[] => {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      // Skip _components and other internal directories
      if (item.startsWith("_") || item === "node_modules") continue;

      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...findMdxFiles(fullPath));
      } else if (item === "page.mdx") {
        files.push(fullPath);
      }
    }

    return files;
  };

  const mdxFiles = findMdxFiles(appDir);

  for (const filePath of mdxFiles) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data: frontmatter, content } = matter(fileContent);

      // Extract slug from file path
      const relativePath = path.relative(appDir, filePath);
      const slug = path.dirname(relativePath).replace(/\\/g, "/");

      // Skip root page
      if (slug === ".") continue;

      // Extract tags from content
      const tagsFromContent = extractTagsFromContent(content);
      const tagsFromFrontmatter = frontmatter.tags || [];
      const allTags = [...new Set([...tagsFromFrontmatter, ...tagsFromContent])];

      // Extract categories from frontmatter
      const categoriesFromFrontmatter = (frontmatter.categories as string[]) || [];
      const allCategories = [...new Set(categoriesFromFrontmatter)];

      posts.push({
        title: frontmatter.title || "Untitled",
        description: frontmatter.description || "",
        image: frontmatter.image,
        slug: slug.startsWith("/") ? slug : `/${slug}`,
        tags: allTags,
        categories: allCategories,
        date: frontmatter.date,
      });
    } catch (error) {
      console.warn(`Failed to parse ${filePath}:`, error);
    }
  }

  return posts;
}

// Get blog post metadata by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogMetadata | null> {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === slug || post.slug === `/${slug}`) || null;
}

// Get frontmatter from a specific blog post file path
export function getFrontmatterFromPath(filePath: string): BlogMetadata | null {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data: frontmatter } = matter(fileContent);

    return {
      title: frontmatter.title || "Untitled",
      description: frontmatter.description || "",
      image: frontmatter.image,
      slug: frontmatter.slug || "",
      tags: frontmatter.tags || [],
      categories: frontmatter.categories || [],
      date: frontmatter.date,
    };
  } catch (error) {
    console.warn(`Failed to parse ${filePath}:`, error);
    return null;
  }
}

// Get all unique tags from all blog posts
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getAllBlogPosts();
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

// Get posts filtered by a specific tag
export async function getPostsByTag(tag: string): Promise<BlogMetadata[]> {
  const posts = await getAllBlogPosts();
  const formattedTag = formatTagForUrl(tag);
  return posts.filter((post) =>
    post.tags.some((postTag) => formatTagForUrl(postTag) === formattedTag)
  );
}

// Format tag for URL (lowercase, no special chars)
export function formatTagForUrl(tag: string): string {
  return tag.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Parse tag from URL back to display format
export async function parseTagFromUrl(urlTag: string): Promise<string> {
  // Try to find the original tag name by checking against all existing tags
  const allTags = await getAllTags();
  const matchingTag = allTags.find(({ tag }) => formatTagForUrl(tag) === urlTag);
  return matchingTag ? matchingTag.tag : urlTag.charAt(0).toUpperCase() + urlTag.slice(1);
}

// Get all unique categories from all blog posts
export async function getAllCategories(): Promise<{ category: string; count: number }[]> {
  const posts = await getAllBlogPosts();
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

// Get posts filtered by a specific category
export async function getPostsByCategory(category: string): Promise<BlogMetadata[]> {
  const posts = await getAllBlogPosts();
  const filteredPosts = posts.filter((post) =>
    post.categories.some((postCategory) => postCategory.toLowerCase() === category.toLowerCase())
  );
  
  // Sort by date (newest to oldest)
  return filteredPosts.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Format category for URL (lowercase, spaces to dashes, no special chars)
export function formatCategoryForUrl(category: string): string {
  return category
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^a-z0-9-]/g, ""); // Remove all non-alphanumeric except dashes
}

// Parse category from URL back to display format
export function parseCategoryFromUrl(urlCategory: string): string {
  // Convert dashes back to spaces and capitalize first letter of each word
  return urlCategory
    .replace(/-/g, " ") // Convert dashes back to spaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
