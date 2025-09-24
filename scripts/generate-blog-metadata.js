// NOT USED IN PRODUCTION
// IT IS POC
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const crypto = require("crypto");

// Extract tags from MDX content (both frontmatter and inline tags)
function extractTagsFromContent(content) {
  const tags = [];

  // Match tags in the format: **Tags:** #AI #Design #Brutalism
  const tagRegex = /\*\*Tags:\*\*\s*((?:#\w+\s*)+)/g;
  const matches = content.match(tagRegex);

  if (matches) {
    matches.forEach((match) => {
      // Extract individual hashtags
      const hashtagMatches = match.match(/#(\w+)/g);
      if (hashtagMatches) {
        hashtagMatches.forEach((hashtag) => {
          const tag = hashtag.replace("#", "");
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
      }
    });
  }

  return tags;
}

// Get all blog posts from the app directory
async function getAllBlogPosts() {
  const posts = [];
  const appDir = path.join(process.cwd(), "src/app");

  // Recursively find all page.mdx files
  const findMdxFiles = (dir) => {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      // Skip _components and other internal directories
      if (item.startsWith("_") || item === "node_modules") continue;

      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...findMdxFiles(fullPath));
      } else if (item === "page.mdx") {
        files.push(fullPath);
      }
    }

    return files;
  };

  const mdxFiles = findMdxFiles(appDir);

  for (const filePath of mdxFiles) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data: frontmatter, content } = matter(fileContent);

      // Extract slug from file path
      const relativePath = path.relative(appDir, filePath);
      const slug = path.dirname(relativePath).replace(/\\/g, "/");

      // Skip root page
      if (slug === ".") continue;

      // Extract tags from content
      const tagsFromContent = extractTagsFromContent(content);
      const tagsFromFrontmatter = frontmatter.tags || [];
      const allTags = [...new Set([...tagsFromFrontmatter, ...tagsFromContent])];

      // Extract categories from frontmatter
      const categoriesFromFrontmatter = frontmatter.categories || [];
      const allCategories = [...new Set(categoriesFromFrontmatter)];

      posts.push({
        title: frontmatter.title || "Untitled",
        description: frontmatter.description || "",
        image: frontmatter.image,
        slug: slug.startsWith("/") ? slug : `/${slug}`,
        tags: allTags,
        categories: allCategories,
        date: frontmatter.date,
      });
    } catch (error) {
      console.warn(`Failed to parse ${filePath}:`, error);
    }
  }

  return posts;
}

// Generate tag counts
function generateTagCounts(posts) {
  const tagCounts = {};

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

// Generate category counts
function generateCategoryCounts(posts) {
  const categoryCounts = {};

  posts.forEach((post) => {
    post.categories.forEach((category) => {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
  });

  return Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

async function generateBlogMetadata() {
  console.log("🚀 Generating blog metadata...");

  try {
    const posts = await getAllBlogPosts();
    const tags = generateTagCounts(posts);
    const categories = generateCategoryCounts(posts);

    const metadata = {
      posts,
      tags,
      categories,
      generatedAt: new Date().toISOString(),
      totalPosts: posts.length,
      totalTags: tags.length,
      totalCategories: categories.length,
    };

    // Generate hash from content + timestamp for cache busting
    const content = JSON.stringify(metadata);
    const timestamp = Date.now();
    const hash = crypto
      .createHash("md5")
      .update(content + timestamp)
      .digest("hex")
      .substring(0, 8);
    const filename = `blog-metadata.${hash}.json`;

    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Clean up old metadata files
    const existingFiles = fs
      .readdirSync(publicDir)
      .filter(
        (file) => file.startsWith("blog-metadata.") && file.endsWith(".json") && file !== filename
      );
    existingFiles.forEach((file) => {
      try {
        fs.unlinkSync(path.join(publicDir, file));
        console.log(`🗑️  Cleaned up old metadata file: ${file}`);
      } catch (error) {
        console.warn(`Warning: Could not delete ${file}:`, error.message);
      }
    });

    // Write new metadata file
    const outputPath = path.join(publicDir, filename);
    fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));

    // Create manifest file to track current metadata file
    const manifest = {
      currentFile: filename,
      hash,
      generatedAt: metadata.generatedAt,
      totalPosts: posts.length,
    };
    const manifestPath = path.join(publicDir, "blog-metadata-manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(
      `✅ Generated blog metadata with ${posts.length} posts, ${tags.length} tags, and ${categories.length} categories`
    );
    console.log(`📁 Written to: ${outputPath}`);
    console.log(`📋 Manifest: ${manifestPath}`);
    console.log(`🔑 Cache-busting hash: ${hash}`);
  } catch (error) {
    console.error("❌ Error generating blog metadata:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateBlogMetadata();
}

module.exports = { generateBlogMetadata };
