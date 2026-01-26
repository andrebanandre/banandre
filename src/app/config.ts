export const sitemapConfig = {
  postsPerSitemap: 500, // Posts per sitemap file
  revalidate: 21600, // 6 hours in seconds
};

export const siteConfig = {
  name: "Banandre",
  title: "No One Cares About Code.",
  url: "https://www.banandre.com",
  ogImage: "https://www.banandre.com/banana-open.png",
  description:
    "Raw and unfiltered insights on AI, software architecture, and enterprise solutions. A blog sharing the truth about tech without the buzzwords.",
  locale: "en_US",
  links: {
    twitter: "https://x.com/andre_banandre",
    github: "https://github.com/andrebanandre",
    linkedin: "https://www.linkedin.com/in/andrii-fedorenko-65905863/",
  },
};

export type SiteConfig = typeof siteConfig;
