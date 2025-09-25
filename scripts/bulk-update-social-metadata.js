#!/usr/bin/env node

/**
 * Bulk update all blog posts with social media metadata
 * Usage: npm run social:bulk-update
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

function extractYearSlugFromPath(filePath) {
  // Extract from path like: src/app/blog/2025-09/some-slug/page.mdx
  const parts = filePath.split("/");
  const blogIndex = parts.indexOf("blog");
  if (blogIndex >= 0 && parts.length > blogIndex + 2) {
    const yearMonth = parts[blogIndex + 1];
    const slug = parts[blogIndex + 2];
    return { yearMonth, slug };
  }
  return null;
}

function generateSocialMetadataForPost(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data: frontmatter, content } = matter(fileContent);

    // Skip if already has complete social metadata
    if (frontmatter.openGraph && frontmatter.twitter && frontmatter.jsonLd) {
      console.log(`⏭️  Skipping ${frontmatter.title} - already has complete metadata`);
      return false;
    }

    const pathInfo = extractYearSlugFromPath(filePath);
    if (!pathInfo) {
      console.warn(`⚠️  Could not extract path info from: ${filePath}`);
      return false;
    }

    const { yearMonth, slug } = pathInfo;
    const baseUrl = "https://banandre.com";
    const blogUrl = `${baseUrl}/blog/${yearMonth}/${slug}`;
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
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: frontmatter.title,
        description: frontmatter.description,
        image: imageUrl,
        url: blogUrl,
        datePublished: new Date(frontmatter.date).toISOString(),
        dateModified: new Date(frontmatter.date).toISOString(),
        author: {
          "@type": "Person",
          name: frontmatter.author || "Banandre",
          url: "https://banandre.com",
        },
        publisher: {
          "@type": "Organization",
          name: "Banandre",
          url: "https://banandre.com",
          logo: {
            "@type": "ImageObject",
            url: "https://banandre.com/banana.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": blogUrl,
        },
      },
    };

    // Write back to file
    const newContent = matter.stringify(content, enhancedFrontmatter);
    fs.writeFileSync(filePath, newContent);

    console.log(`✅ Enhanced: ${frontmatter.title}`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function bulkUpdateSocialMetadata(blogDir = "src/app/blog") {
  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanDirectory(itemPath);
      } else if (item === "page.mdx") {
        const result = generateSocialMetadataForPost(itemPath);
        if (result === true) {
          processedCount++;
        } else if (result === false) {
          skippedCount++;
        } else {
          errorCount++;
        }
      }
    }
  }

  console.log("🚀 Starting bulk social metadata update...\n");

  if (fs.existsSync(blogDir)) {
    scanDirectory(blogDir);
  } else {
    console.error(`❌ Blog directory not found: ${blogDir}`);
    return;
  }

  console.log("\n📊 Bulk Update Results:");
  console.log(`✅ Updated: ${processedCount} posts`);
  console.log(`⏭️  Skipped: ${skippedCount} posts (already complete)`);
  console.log(`❌ Errors: ${errorCount} posts`);
  console.log(`\n🎉 Total posts processed: ${processedCount + skippedCount + errorCount}`);

  if (processedCount > 0) {
    console.log("\n💡 Next steps:");
    console.log("1. Run `npm run build` to verify everything works");
    console.log("2. Run `npm run social:validate` to confirm all metadata is complete");
    console.log("3. Test social sharing on a few updated posts");
  }
}

// Command line usage
if (require.main === module) {
  const blogDir = process.argv[2] || "src/app/blog";
  bulkUpdateSocialMetadata(blogDir);
}

module.exports = { bulkUpdateSocialMetadata };
