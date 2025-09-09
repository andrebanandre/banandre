import { getAllBlogPosts } from "../../lib/blog-utils";
import { siteConfig } from "../config";

// Required for static export compatibility
export const revalidate = 3600; // Revalidate every hour

const CONFIG = {
  title: siteConfig.title,
  siteUrl: siteConfig.url,
  description: siteConfig.description,
  lang: "en-us",
};

export async function GET() {
  try {
    const allPosts = await getAllBlogPosts();

    // Sort posts by date (newest first)
    const sortedPosts = allPosts
      .filter((post) => post.date) // Only include posts with dates
      .sort((a, b) => {
        const dateA = new Date(a.date!);
        const dateB = new Date(b.date!);
        return dateB.getTime() - dateA.getTime();
      });

    const postsXml = sortedPosts
      .map((post) => {
        const postUrl = `${CONFIG.siteUrl}${post.slug}`;
        const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString();

        return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      ${post.tags && post.tags.length > 0 ? post.tags.map((tag) => `<category><![CDATA[${tag}]]></category>`).join("\n      ") : ""}
    </item>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${CONFIG.title}]]></title>
    <link>${CONFIG.siteUrl}</link>
    <atom:link href="${CONFIG.siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description><![CDATA[${CONFIG.description}]]></description>
    <language>${CONFIG.lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js RSS Generator</generator>
${postsXml}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=UTF-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
