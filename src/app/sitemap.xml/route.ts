import { NextResponse } from "next/server";
import { getPostCount, getNewestPostDateAtOffset } from "@/lib/wordpress";
import { siteConfig, sitemapConfig } from "../config";

interface SitemapEntry {
  url: string;
  lastmod: string;
}

/**
 * Sitemap Index Route Handler
 * Generates a sitemap index XML that lists all child sitemaps
 * Each sitemap shows the real lastmod date of its newest content
 */
export async function GET(): Promise<NextResponse> {
  const baseUrl = siteConfig.url;
  const sitemaps: SitemapEntry[] = [];

  try {
    // Get total posts and calculate number of post sitemaps
    const totalPosts = await getPostCount();
    const numPostSitemaps = Math.ceil(totalPosts / sitemapConfig.postsPerSitemap);

    // Fetch the newest post date from each batch in parallel
    // Posts are ordered by date desc, so first post in batch = newest
    const batchDatePromises = Array.from({ length: numPostSitemaps }, (_, i) => {
      const offset = i * sitemapConfig.postsPerSitemap;
      return getNewestPostDateAtOffset(offset);
    });
    const batchDates = await Promise.all(batchDatePromises);

    // Get the absolute latest post date (first post in posts-0)
    const latestPostDate = batchDates[0] || new Date().toISOString();

    // Static sitemap - use latest post date since homepage shows latest posts
    sitemaps.push({
      url: `${baseUrl}/sitemap/static.xml`,
      lastmod: latestPostDate,
    });

    // Posts sitemaps with real dates from each batch
    for (let i = 0; i < numPostSitemaps; i++) {
      sitemaps.push({
        url: `${baseUrl}/sitemap/posts-${i}.xml`,
        lastmod: batchDates[i] || latestPostDate,
      });
    }

    // Categories - use latest post date (categories update when posts are added)
    sitemaps.push({
      url: `${baseUrl}/sitemap/categories.xml`,
      lastmod: latestPostDate,
    });

    // Tags - use latest post date (tags update when posts are added)
    sitemaps.push({
      url: `${baseUrl}/sitemap/tags.xml`,
      lastmod: latestPostDate,
    });
  } catch (error) {
    console.error("Error generating sitemap index:", error);
    const fallbackDate = new Date().toISOString();
    sitemaps.push({ url: `${baseUrl}/sitemap/static.xml`, lastmod: fallbackDate });
    sitemaps.push({ url: `${baseUrl}/sitemap/categories.xml`, lastmod: fallbackDate });
    sitemaps.push({ url: `${baseUrl}/sitemap/tags.xml`, lastmod: fallbackDate });
  }

  const xml = generateSitemapIndexXml(sitemaps);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": `public, max-age=${sitemapConfig.revalidate}, s-maxage=${sitemapConfig.revalidate}, stale-while-revalidate`,
    },
  });
}

function generateSitemapIndexXml(sitemaps: SitemapEntry[]): string {
  const sitemapEntries = sitemaps
    .map(
      ({ url, lastmod }) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}
