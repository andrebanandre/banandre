/** @type {import('next-sitemap').IConfig} */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Function to read MDX frontmatter and get the actual date
function getBlogPostDate(blogPath) {
  try {
    // Convert URL path to file system path
    // /blog/2025-09/some-post -> src/app/blog/2025-09/some-post/page.mdx
    const urlParts = blogPath.split("/").filter(Boolean);
    if (urlParts[0] !== "blog" || urlParts.length < 3) {
      return null;
    }

    const filePath = path.join(
      process.cwd(),
      "src",
      "app",
      "blog",
      urlParts[1],
      urlParts[2],
      "page.mdx"
    );

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContent);

      if (data.date) {
        // Convert date to ISO string
        return new Date(data.date).toISOString();
      }
    }
  } catch (error) {
    console.warn(`Could not read date from ${blogPath}:`, error.message);
  }
  return null;
}

module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.banandre.com",
  generateRobotsTxt: true,
  output: "export",
  outDir: "build",
  sourceDir: "build",
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/api/*", "/_next/*", "/404", "/500", "/private/*", "/admin/*"],
  // Custom transformation for MDX pages
  transform: async (config, path) => {
    // Exclude certain paths
    if (path.includes("/api/") || path.includes("/_next/")) {
      return null;
    }

    // Set different priorities for different page types
    let priority = config.priority;
    let changefreq = config.changefreq;
    let lastmod;

    // Homepage gets highest priority
    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    }
    // Blog posts get high priority
    else if (path.includes("/blog/")) {
      priority = 0.8;
      changefreq = "weekly";

      // Read the actual date from the MDX frontmatter
      const actualDate = getBlogPostDate(path);
      if (actualDate) {
        lastmod = actualDate;
      }
    }
    // Tag pages get medium priority
    else if (path.includes("/tags/")) {
      priority = 0.6;
      changefreq = "monthly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: lastmod || (config.autoLastmod ? new Date().toISOString() : undefined),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  // Add additional paths if needed
  additionalPaths: async (config) => {
    const result = [];

    // You can add dynamic paths here if needed
    // For example, if you have dynamic blog posts from a CMS

    return result;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/api/", "/_next/", "/private/"],
      },
    ],
    additionalSitemaps: [
      // Add any additional sitemaps here if needed
    ],
  },
};
