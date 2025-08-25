import type { Blog, WebSite, Organization, Person, BreadcrumbList, WithContext } from "schema-dts";
import type { BlogMetadata } from "./blog-utils";

const SITE_URL = "https://banandre.com";
const SITE_NAME = "Banandre";
const SITE_DESCRIPTION =
  "A brutalist blog about AI technology, coding reality, and sharp insights. Raw, unfiltered thoughts on artificial intelligence, software development, and tech industry truths by Andrii Fedorenko.";
const AUTHOR_NAME = "Andrii Fedorenko";
const AUTHOR_ALIAS = "Andre Banandre";
const AUTHOR_EMAIL = "andre@banandre.com";
const GITHUB_URL = "https://github.com/andrebanandre";
const LINKEDIN_URL = "https://www.linkedin.com/in/andrii-fedorenko-65905863/";

export function safeJsonLdStringify(jsonLd: unknown): string {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

export function generateOrganizationSchema(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "Andre Banandre's Blog",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: `${SITE_URL}/banana-open.png`,
    },
    founder: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: AUTHOR_NAME,
      alternateName: AUTHOR_ALIAS,
    },
    email: AUTHOR_EMAIL,
    sameAs: [GITHUB_URL, LINKEDIN_URL],
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Software Development",
      "Technology",
      "Programming",
      "AI Ethics",
      "Tech Industry Analysis",
    ],
  };
}

export function generateWebSiteSchema(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: "en-US",
    copyrightHolder: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
    },
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

export function generateBlogSchema(): WithContext<Blog> {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/#blog`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: "en-US",
    about: [
      "Artificial Intelligence",
      "Technology",
      "Software Development",
      "Machine Learning",
      "Tech Industry Analysis",
      "AI Ethics",
      "Programming",
    ],
    keywords:
      "AI, artificial intelligence, technology, software development, machine learning, tech analysis, programming, AI ethics, coding",
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
    },
    blogPost: [],
  };
}

export function generateAuthorSchema(): WithContext<Person> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: AUTHOR_NAME,
    alternateName: AUTHOR_ALIAS,
    url: SITE_URL,
    email: AUTHOR_EMAIL,
    description:
      "Software developer, AI technology analyst, and technology writer specializing in artificial intelligence, machine learning, and brutal tech industry reality checks.",
    jobTitle: "Software Developer & Technology Writer",
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Software Development",
      "JavaScript",
      "Python",
      "React",
      "Node.js",
      "Tech Industry Analysis",
      "AI Ethics",
    ],
    sameAs: [GITHUB_URL, LINKEDIN_URL],
    worksFor: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateCategoryPageSchema(category: string, posts: BlogMetadata[]) {
  const categoryUrl = `${SITE_URL}/categories/${category.toLowerCase().replace(/\s+/g, "-")}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category} Articles - ${SITE_NAME}`,
    description: `Browse all articles in the ${category} category on ${SITE_NAME}`,
    url: categoryUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}${post.slug}`,
        name: post.title,
      })),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function generateTagPageSchema(tag: string, posts: BlogMetadata[]) {
  const tagUrl = `${SITE_URL}/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tag} Articles - ${SITE_NAME}`,
    description: `Browse all articles tagged with ${tag} on ${SITE_NAME}`,
    url: tagUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 10).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}${post.slug}`,
        name: post.title,
      })),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
