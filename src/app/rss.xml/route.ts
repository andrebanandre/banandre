import { getAllPosts } from "../../lib/wordpress";
import { normalizeWordPressPost } from "../../lib/content-types";
import { siteConfig } from "../config";

// Required for ISR - revalidate every hour
export const revalidate = 3600;

const CONFIG = {
  title: siteConfig.title,
  siteUrl: siteConfig.url,
  description: siteConfig.description,
  lang: "en-us",
};

export async function GET() {
  try {
    // Fetch posts from WordPress
    const wordpressPosts = await getAllPosts();
    const allPosts = wordpressPosts.map(normalizeWordPressPost);

    const postsXml = allPosts
      .map((post) => {
        const postUrl = `${CONFIG.siteUrl}${post.url}`;
        const pubDate = new Date(post.date).toUTCString();

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
