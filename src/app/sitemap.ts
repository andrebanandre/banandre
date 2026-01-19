import { MetadataRoute } from "next";
import { getAllPosts, getAllCategories, getAllTags, getPostsPaginated } from "../lib/wordpress";
import { normalizeWordPressPost } from "../lib/content-types";
import { siteConfig } from "./config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  try {
    // Fetch all posts, categories, and tags from WordPress
    const [wordpressPosts, allCategories, allTags, paginationInfo] = await Promise.all([
      getAllPosts(),
      getAllCategories(),
      getAllTags(),
      getPostsPaginated(1, 12), // Get pagination info
    ]);

    // Normalize WordPress posts
    const allPosts = wordpressPosts.map(normalizeWordPressPost);
    const totalPages = paginationInfo.headers.totalPages;

    // Homepage
    const routes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];

    // Homepage pagination (/page/2, /page/3, etc.)
    // Include first 10 pagination pages in sitemap
    for (let page = 2; page <= Math.min(totalPages, 10); page++) {
      routes.push({
        url: `${baseUrl}/page/${page}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });
    }

    // Categories index page
    routes.push({
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // Category pages with pagination (using WordPress slugs)
    allCategories.forEach((category) => {
      // Category page 1
      routes.push({
        url: `${baseUrl}/categories/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });

      // Add pagination for categories with many posts
      // Only include first 5 pages per category to keep sitemap manageable
      if (category.count > 12) {
        const categoryPages = Math.min(Math.ceil(category.count / 12), 5);
        for (let page = 2; page <= categoryPages; page++) {
          routes.push({
            url: `${baseUrl}/categories/${category.slug}/${page}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
          });
        }
      }
    });

    // Tags pages (using WordPress slugs)
    allTags.forEach((tag) => {
      routes.push({
        url: `${baseUrl}/tags/${tag.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });

    // Blog posts from WordPress
    allPosts.forEach((post) => {
      routes.push({
        url: `${baseUrl}${post.url}`,
        lastModified: new Date(post.date),
        changeFrequency: "weekly",
        priority: 0.9,
        // Include featured image if available for better SEO
        ...(post.image && { images: [post.image] }),
      });
    });

    return routes;
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Fallback to basic sitemap if there's an error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}
