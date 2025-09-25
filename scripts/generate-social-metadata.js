#!/usr/bin/env node

/**
 * Auto-generate OpenGraph and Twitter metadata for blog posts
 * Usage: node scripts/generate-social-metadata.js path/to/blog-post.mdx
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

function generateSocialMetadata(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    return;
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data: frontmatter, content } = matter(fileContent);

  // Extract year and slug from file path
  const pathParts = filePath.split("/");
  const fileName = pathParts[pathParts.length - 1];
  const year = pathParts.find((part) => part.match(/^\d{4}-\d{2}$/));
  const slug = frontmatter.slug || fileName.replace(".mdx", "");

  // Generate URLs
  const baseUrl = "https://banandre.com";
  const blogUrl = `${baseUrl}/blog/${year}/${slug}`;
  const imageUrl = frontmatter.image
    ? `${baseUrl}${frontmatter.image}`
    : `${baseUrl}/blog/2025/default-blog-image.webp`;

  // Create enhanced frontmatter
  const enhancedFrontmatter = {
    ...frontmatter,
    author: frontmatter.author || "Banandre",
    type: frontmatter.type || "article",
    openGraph: {
      type: "article",
      title: frontmatter.title,
      description: frontmatter.description,
      url: blogUrl,
      siteName: "Banandre",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
      publishedTime: new Date(frontmatter.date).toISOString(),
      authors: [frontmatter.author || "Banandre"],
      tags: frontmatter.tags || [],
      section: frontmatter.categories?.[0] || "Blog",
    },
    twitter: {
      card: "summary_large_image",
      site: "@banandre",
      creator: "@banandre",
      title: frontmatter.title,
      description: frontmatter.description,
      images: [imageUrl],
    },
  };

  // Write back to file
  const newContent = matter.stringify(content, enhancedFrontmatter);
  fs.writeFileSync(filePath, newContent);

  console.log("✅ Enhanced social metadata for:", filePath);
  console.log("📱 Twitter Card URL:", blogUrl);
  console.log("🖼️ Image URL:", imageUrl);
}

// Command line usage
if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: node scripts/generate-social-metadata.js path/to/blog-post.mdx");
    process.exit(1);
  }
  generateSocialMetadata(filePath);
}

module.exports = { generateSocialMetadata };
