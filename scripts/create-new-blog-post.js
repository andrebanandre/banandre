#!/usr/bin/env node

/**
 * Create a new blog post with proper structure and social metadata
 * Usage: npm run blog:new "Your Blog Post Title"
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-")
    .substring(0, 60); // Keep reasonable length
}

function formatDate(date) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

function getYearMonth(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

async function createBlogPost() {
  try {
    console.log("🚀 Creating a new blog post...\n");

    // Get basic information
    const title = await askQuestion("📝 Blog post title: ");
    const description = await askQuestion("📄 Description (for SEO/social): ");
    const category = await askQuestion("📂 Primary category: ");
    const tagsInput = await askQuestion("🏷️  Tags (comma-separated): ");

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    const slug = slugify(title);
    const today = new Date();
    const yearMonth = getYearMonth(today);
    const dateString = formatDate(today);
    const isoDate = today.toISOString();

    // Create directory structure
    const blogDir = path.join(process.cwd(), "src", "app", "blog", yearMonth, slug);
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    // Generate URLs
    const baseUrl = "https://banandre.com";
    const blogUrl = `${baseUrl}/blog/${yearMonth}/${slug}`;
    const imageUrl = `${baseUrl}/blog/2025/${slug}.webp`;

    // Create frontmatter
    const frontmatter = `---
title: "${title}"
description: "${description}"
slug: ${slug}
image: "/blog/2025/${slug}.webp"
date: ${dateString}
tags: [${tags.map((tag) => `"${tag}"`).join(", ")}]
categories: ["${category}"]
author: "Banandre"
type: "article"
openGraph:
  type: "article"
  title: "${title}"
  description: "${description}"
  url: "${blogUrl}"
  siteName: "Banandre"
  images:
    - url: "${imageUrl}"
      width: 1200
      height: 630
      alt: "${title}"
  publishedTime: "${isoDate}"
  authors: ["Banandre"]
  tags: [${tags.map((tag) => `"${tag}"`).join(", ")}]
  section: "${category}"
twitter:
  card: "summary_large_image"
  site: "@banandre"
  creator: "@banandre"
  title: "${title}"
  description: "${description}"
  images: ["${imageUrl}"]
jsonLd:
  "@context": "https://schema.org"
  "@type": "BlogPosting"
  headline: "${title}"
  description: "${description}"
  image: "${imageUrl}"
  url: "${blogUrl}"
  datePublished: "${isoDate}"
  dateModified: "${isoDate}"
  author:
    "@type": "Person"
    name: "Banandre"
    url: "https://banandre.com"
  publisher:
    "@type": "Organization"
    name: "Banandre"
    url: "https://banandre.com"
    logo:
      "@type": "ImageObject"
      url: "https://banandre.com/banana.png"
  mainEntityOfPage:
    "@type": "WebPage"
    "@id": "${blogUrl}"
---

## Introduction

Start with a compelling hook that draws readers in.

## Main Content

Break your content into digestible sections with clear headings.

## Conclusion

Summarize key points and provide a call-to-action.
`;

    // Write the file
    const filePath = path.join(blogDir, "page.mdx");
    fs.writeFileSync(filePath, frontmatter);

    console.log("\n✅ Blog post created successfully!");
    console.log(`📁 Location: ${filePath}`);
    console.log(`🌐 URL: ${blogUrl}`);
    console.log(`🖼️  Don't forget to add your image: /public/blog/2025/${slug}.webp`);
    console.log("\n🚀 You can now start writing your blog post!");
  } catch (error) {
    console.error("❌ Error creating blog post:", error.message);
  } finally {
    rl.close();
  }
}

// Command line usage
if (require.main === module) {
  createBlogPost();
}
