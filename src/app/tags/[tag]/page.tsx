import { getPostsByTag, getAllTags, parseTagFromUrl } from "../../../lib/blog-utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tag } from "../../_components/tag";
import { BlogGrid } from "../../_components/blog-card";
import type { Metadata } from "next";
import {
  generateTagPageSchema,
  generateBreadcrumbSchema,
  safeJsonLdStringify,
} from "../../../lib/json-ld";
import { Head } from "nextra/components";
import { siteConfig } from "../../config";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();

  return tags.map(({ tag }) => ({
    tag: tag.toLowerCase().replace(/[^a-z0-9]/g, ""),
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  try {
    const { tag: urlTag } = await params;
    const displayTag = parseTagFromUrl(urlTag);
    const posts = await getPostsByTag(displayTag);

    const title = `#${displayTag} - ${siteConfig.name}`;
    const description = `Articles tagged with ${displayTag}. ${posts.length} article${posts.length !== 1 ? "s" : ""} found.`;

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
  const displayTag = parseTagFromUrl(urlTag);

  const posts = await getPostsByTag(displayTag);

  if (posts.length === 0) {
    notFound();
  }

  // Generate JSON-LD schemas
  const tagSchema = generateTagPageSchema(displayTag, posts);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tags", url: "/tags" },
    { name: `#${displayTag}`, url: `/tags/${urlTag}` },
  ]);

  return (
    <>
      <Head>
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
      </Head>
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
