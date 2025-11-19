import { MetadataRoute } from "next";
import { getAllPosts, getAllCategories, getAllTags } from "../lib/wordpress";
import { normalizeWordPressPost } from "../lib/content-types";
import { formatCategoryForUrl, formatTagForUrl } from "../lib/url-utils";
import { siteConfig } from "./config";

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  try {
    // Fetch all posts, categories, and tags from WordPress
    const [wordpressPosts, allCategories, allTags] = await Promise.all([
      getAllPosts(),
      getAllCategories(),
      getAllTags(),
    ]);

    // Normalize WordPress posts
    const allPosts = wordpressPosts.map(normalizeWordPressPost);

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

    allCategories.forEach((category) => {
      routes.push({
        url: `${baseUrl}/categories/${formatCategoryForUrl(category.name)}`,
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

    allTags.forEach((tag) => {
      routes.push({
        url: `${baseUrl}/tags/${formatTagForUrl(tag.name)}`,
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
