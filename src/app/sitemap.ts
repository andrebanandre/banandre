import { MetadataRoute } from "next";
import { getAllCombinedPosts, getAllCombinedCategories, getAllCombinedTags } from "../lib/blog-aggregator";
import { formatCategoryForUrl, formatTagForUrl } from "../lib/blog-utils";
import { siteConfig } from "./config";

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  try {
    // Fetch all posts, categories, and tags from both sources
    const [allPosts, allCategories, allTags] = await Promise.all([
      getAllCombinedPosts(),
      getAllCombinedCategories(),
      getAllCombinedTags(),
    ]);

    // Homepage
    const routes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];

    // Categories pages
    routes.push({
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    allCategories.forEach(({ category }) => {
      routes.push({
        url: `${baseUrl}/categories/${formatCategoryForUrl(category)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });

    // Tags pages
    routes.push({
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    allTags.forEach(({ tag }) => {
      routes.push({
        url: `${baseUrl}/tags/${formatTagForUrl(tag)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });

    // Blog posts - WordPress posts get higher priority
    allPosts.forEach((post) => {
      const isWordPress = post.source === "wordpress";

      routes.push({
        url: `${baseUrl}${post.url}`,
        lastModified: new Date(post.date),
        changeFrequency: "weekly",
        priority: isWordPress ? 0.9 : 0.8, // WordPress posts get slightly higher priority
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
