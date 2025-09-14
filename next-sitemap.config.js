/** @type {import('next-sitemap').IConfig} */
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

      // Try to extract date from blog post path (format: /blog/YYYY-MM/title)
      const dateMatch = path.match(/\/blog\/(\d{4}-\d{2})\//);
      if (dateMatch) {
        // Set lastmod to the first day of the month the post was published
        lastmod = new Date(dateMatch[1] + '-01').toISOString();
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
