import { NextResponse } from "next/server";
import {
  getAllCategories,
  getAllTags,
  getPostsBatchForSitemap,
  getPostsPaginated,
} from "@/lib/wordpress";
import { siteConfig, sitemapConfig } from "../../config";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  image?: string;
}

/**
 * Dynamic Sitemap Route Handler
 * Handles: static.xml, posts-0.xml, posts-1.xml, ..., categories.xml, tags.xml
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const baseUrl = siteConfig.url;

  // Remove .xml extension if present
  const sitemapId = id.replace(/\.xml$/, "");

  try {
    let urls: SitemapUrl[] = [];

    if (sitemapId === "static") {
      urls = await generateStaticUrls(baseUrl);
    } else if (sitemapId.startsWith("posts-")) {
      const batchIndex = parseInt(sitemapId.replace("posts-", ""), 10);
      urls = await generatePostsUrls(baseUrl, batchIndex);
    } else if (sitemapId === "categories") {
      urls = await generateCategoriesUrls(baseUrl);
    } else if (sitemapId === "tags") {
      urls = await generateTagsUrls(baseUrl);
    } else {
      return new NextResponse("Sitemap not found", { status: 404 });
    }

    const xml = generateSitemapXml(urls);

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": `public, max-age=${sitemapConfig.revalidate}, s-maxage=${sitemapConfig.revalidate}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error(`Error generating sitemap ${sitemapId}:`, error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}

/**
 * Static pages: homepage, pagination
 */
async function generateStaticUrls(baseUrl: string): Promise<SitemapUrl[]> {
  const urls: SitemapUrl[] = [
    {
      loc: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 1,
    },
  ];

  try {
    const paginationInfo = await getPostsPaginated(1, 12);
    const totalPages = paginationInfo.headers.totalPages;

    for (let page = 2; page <= Math.min(totalPages, 10); page++) {
      urls.push({
        loc: `${baseUrl}/page/${page}`,
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: 0.8,
      });
    }
  } catch (error) {
    console.error("Error fetching pagination info:", error);
  }

  return urls;
}

/**
 * Posts sitemap for a specific batch
 */
async function generatePostsUrls(baseUrl: string, batchIndex: number): Promise<SitemapUrl[]> {
  const offset = batchIndex * sitemapConfig.postsPerSitemap;
  const posts = await getPostsBatchForSitemap(offset, sitemapConfig.postsPerSitemap);

  return posts.map((post) => ({
    // Blog posts are served under /blog/[slug], not at root /[slug]
    loc: `${baseUrl}/blog/${post.slug}`,
    lastmod: new Date(post.modified || post.date).toISOString(),
    changefreq: "weekly" as const,
    priority: 0.9,
    // Prepend baseUrl to proxied image path (e.g., /wp-content/uploads/... -> https://www.banandre.com/wp-content/uploads/...)
    image: post.featured_media_url ? `${baseUrl}${post.featured_media_url}` : undefined,
  }));
}

/**
 * Categories sitemap with pagination
 */
async function generateCategoriesUrls(baseUrl: string): Promise<SitemapUrl[]> {
  const urls: SitemapUrl[] = [];
  const allCategories = await getAllCategories();

  // Categories index page
  urls.push({
    loc: `${baseUrl}/categories`,
    lastmod: new Date().toISOString(),
    changefreq: "weekly",
    priority: 0.8,
  });

  // Category pages with pagination
  allCategories.forEach((category) => {
    urls.push({
      loc: `${baseUrl}/categories/${category.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.7,
    });

    // Add pagination for categories with many posts (first 5 pages)
    if (category.count > 12) {
      const categoryPages = Math.min(Math.ceil(category.count / 12), 5);
      for (let page = 2; page <= categoryPages; page++) {
        urls.push({
          loc: `${baseUrl}/categories/${category.slug}/${page}`,
          lastmod: new Date().toISOString(),
          changefreq: "weekly",
          priority: 0.6,
        });
      }
    }
  });

  return urls;
}

/**
 * Tags sitemap
 */
async function generateTagsUrls(baseUrl: string): Promise<SitemapUrl[]> {
  const allTags = await getAllTags();

  return allTags.map((tag) => ({
    loc: `${baseUrl}/tags/${tag.slug}`,
    lastmod: new Date().toISOString(),
    changefreq: "monthly" as const,
    priority: 0.6,
  }));
}

/**
 * Generate sitemap XML from URL entries
 */
function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlEntries = urls
    .map((url) => {
      let entry = `  <url>
    <loc>${escapeXml(url.loc)}</loc>`;

      if (url.lastmod) {
        entry += `
    <lastmod>${url.lastmod}</lastmod>`;
      }
      if (url.changefreq) {
        entry += `
    <changefreq>${url.changefreq}</changefreq>`;
      }
      if (url.priority !== undefined) {
        entry += `
    <priority>${url.priority}</priority>`;
      }
      if (url.image) {
        entry += `
    <image:image>
      <image:loc>${escapeXml(url.image)}</image:loc>
    </image:image>`;
      }

      entry += `
  </url>`;
      return entry;
    })
    .join("\n");

  // Include image namespace if any URLs have images
  const hasImages = urls.some((url) => url.image);
  const namespaces = hasImages
    ? 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${namespaces}>
${urlEntries}
</urlset>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
