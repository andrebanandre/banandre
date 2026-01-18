import { getAllTags, getTagBySlug, getPostsByTagPaginated } from "../../../lib/wordpress";
import { normalizeWordPressPost } from "../../../lib/content-types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Tag } from "../../_components/tag";
import { BlogGrid } from "../../_components/blog-card";
import type { Metadata } from "next";
import {
  generateTagPageSchema,
  generateBreadcrumbSchema,
  safeJsonLdStringify,
} from "../../../lib/json-ld";
import { siteConfig } from "../../config";

// Enable ISR - revalidate every hour
export const revalidate = 3600;

// Allow dynamic params for routes not in generateStaticParams
export const dynamicParams = true;

// Cache tag data to prevent duplicate API calls
const getTagData = cache(async (urlTag: string) => {
  const tag = await getTagBySlug(urlTag);
  if (!tag) return null;

  const { data: wordpressPosts } = await getPostsByTagPaginated(tag.id, 1, 100);
  const posts = wordpressPosts.map(normalizeWordPressPost);

  return { tag, posts };
});

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();

  // Only pre-generate top 50 most used tags
  // Others will be generated on-demand with ISR
  return tags
    .sort((a, b) => b.count - a.count)
    .slice(0, 50)
    .map((tag) => ({
      tag: tag.slug,
    }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  try {
    const { tag: urlTag } = await params;

    // Use cached function to prevent duplicate API calls
    const data = await getTagData(urlTag);
    if (!data) {
      return {
        title: `Tag Not Found - ${siteConfig.name}`,
        description: "Tag not found",
      };
    }

    const { tag, posts: wordpressPosts } = data;
    const displayTag = tag.name;

    const title = `#${displayTag} - ${siteConfig.name}`;
    const description = `Articles tagged with ${displayTag}. ${wordpressPosts.length} article${wordpressPosts.length !== 1 ? "s" : ""} found.`;

    return {
      title,
      description,
      keywords: [displayTag, "coding", "programming", "software development", "technology", "blog"],
      authors: [
        {
          name: siteConfig.name,
          url: siteConfig.url,
        },
      ],
      alternates: {
        canonical: `/tags/${urlTag}`,
      },
      creator: siteConfig.name,
      publisher: siteConfig.name,
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        type: "website",
        locale: siteConfig.locale,
        url: `${siteConfig.url}/tags/${urlTag}`,
        title,
        description,
        siteName: siteConfig.name,
        images: [
          {
            url: siteConfig.ogImage,
            width: 1200,
            height: 630,
            alt: siteConfig.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [siteConfig.ogImage],
        creator: "@andre_banandre",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `Tag - ${siteConfig.name}`,
      description: "Articles by tag",
    };
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: urlTag } = await params;

  // Use cached function to prevent duplicate API calls
  const data = await getTagData(urlTag);
  if (!data || data.posts.length === 0) {
    notFound();
  }

  const { tag, posts } = data;
  const displayTag = tag.name;

  // Generate JSON-LD schemas
  const tagSchema = generateTagPageSchema(displayTag, posts);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tags", url: "/tags" },
    { name: `#${displayTag}`, url: `/tags/${urlTag}` },
  ]);

  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLdStringify(tagSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLdStringify(breadcrumbSchema),
          }}
        />
      </head>
      <div className="min-h-screen bg-[var(--background)] px-6 md:px-12 py-8 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <Link
              href="/tags"
              className="text-[var(--accent)] hover:text-white transition-colors mb-4 inline-block"
            >
              ← Back to all tags
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <h1 className="display-title text-white text-shadow-brutal">Tagged with</h1>
              <Tag tag={displayTag} />
            </div>

            <p className="text-gray-200 text-lg">
              {posts.length} article{posts.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <BlogGrid posts={posts} />
        </div>
      </div>
    </>
  );
}
