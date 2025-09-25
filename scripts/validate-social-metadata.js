#!/usr/bin/env node

/**
 * Validate social media metadata in blog posts
 * Usage: npm run social:validate [directory]
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

function validateSocialMetadata(blogDir = "src/app/blog") {
  const issues = [];
  const successes = [];

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanDirectory(itemPath);
      } else if (item === "page.mdx") {
        validatePost(itemPath);
      }
    }
  }

  function validatePost(filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const { data: frontmatter } = matter(content);

      const postIssues = [];
      const postPath = filePath.replace(process.cwd() + "/", "");

      // Check required fields
      const requiredFields = ["title", "description", "image", "date"];
      for (const field of requiredFields) {
        if (!frontmatter[field]) {
          postIssues.push(`Missing ${field}`);
        }
      }

      // Check OpenGraph
      if (!frontmatter.openGraph) {
        postIssues.push("Missing openGraph metadata");
      } else {
        const og = frontmatter.openGraph;
        const ogRequired = ["type", "title", "description", "url", "siteName", "images"];
        for (const field of ogRequired) {
          if (!og[field]) {
            postIssues.push(`Missing openGraph.${field}`);
          }
        }

        if (og.images && og.images.length > 0) {
          const img = og.images[0];
          if (!img.url || !img.width || !img.height || !img.alt) {
            postIssues.push("Incomplete openGraph image metadata");
          }
        }
      }

      // Check Twitter
      if (!frontmatter.twitter) {
        postIssues.push("Missing twitter metadata");
      } else {
        const twitter = frontmatter.twitter;
        const twitterRequired = ["card", "site", "creator", "title", "description", "images"];
        for (const field of twitterRequired) {
          if (!twitter[field]) {
            postIssues.push(`Missing twitter.${field}`);
          }
        }
      }

      // Check JSON-LD
      if (!frontmatter.jsonLd) {
        postIssues.push("Missing jsonLd structured data");
      } else {
        const jsonLd = frontmatter.jsonLd;
        const jsonLdRequired = [
          "@context",
          "@type",
          "headline",
          "description",
          "image",
          "url",
          "datePublished",
          "author",
          "publisher",
        ];
        for (const field of jsonLdRequired) {
          if (!jsonLd[field]) {
            postIssues.push(`Missing jsonLd.${field}`);
          }
        }
      }

      // Check URL consistency
      if (frontmatter.openGraph?.url && frontmatter.jsonLd?.url) {
        if (frontmatter.openGraph.url !== frontmatter.jsonLd.url) {
          postIssues.push("URL mismatch between openGraph and jsonLd");
        }
      }

      // Check image consistency
      if (frontmatter.openGraph?.images?.[0]?.url && frontmatter.twitter?.images?.[0]) {
        if (frontmatter.openGraph.images[0].url !== frontmatter.twitter.images[0]) {
          postIssues.push("Image URL mismatch between openGraph and twitter");
        }
      }

      if (postIssues.length > 0) {
        issues.push({
          file: postPath,
          issues: postIssues,
        });
      } else {
        successes.push({
          file: postPath,
          title: frontmatter.title,
        });
      }
    } catch (error) {
      issues.push({
        file: filePath.replace(process.cwd() + "/", ""),
        issues: [`Error reading file: ${error.message}`],
      });
    }
  }

  // Start scanning
  if (fs.existsSync(blogDir)) {
    scanDirectory(blogDir);
  } else {
    console.error(`❌ Blog directory not found: ${blogDir}`);
    return;
  }

  // Report results
  console.log("\n🔍 Social Media Metadata Validation Results\n");

  if (successes.length > 0) {
    console.log(`✅ ${successes.length} posts with complete metadata:`);
    successes.forEach((success) => {
      console.log(`   ✓ ${success.title}`);
    });
    console.log("");
  }

  if (issues.length > 0) {
    console.log(`⚠️  ${issues.length} posts with issues:`);
    issues.forEach((issue) => {
      console.log(`\n   📄 ${issue.file}`);
      issue.issues.forEach((problemItem) => {
        console.log(`      • ${problemItem}`);
      });
    });
    console.log("\n💡 Use the template or scripts to fix these issues.");
  } else {
    console.log("🎉 All blog posts have complete social media metadata!");
  }

  console.log(`\n📊 Summary: ${successes.length} complete, ${issues.length} need attention`);
}

// Command line usage
if (require.main === module) {
  const blogDir = process.argv[2] || "src/app/blog";
  validateSocialMetadata(blogDir);
}

module.exports = { validateSocialMetadata };
