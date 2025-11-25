import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { decode } from "html-entities";
import { cache } from "react";
import {
  getPostBySlug,
  getAllPostSlugs,
} from "@/lib/wordpress";
import { WordPressPostRenderer } from "@/app/_components/wordpress-post-renderer";
import { Category } from "@/app/_components/category";
import { Tag } from "@/app/_components/tag";
import { ScrollToTop } from "@/app/_components/scroll-to-top";
import { BlogSidebar } from "@/app/_components/blog-sidebar";
import { Footer } from "@/app/_components/footer";
import { RelatedPosts } from "@/app/_components/related-posts";
import { siteConfig } from "@/app/config";
import "../blog-styles.css";

// Enable ISR - revalidate every hour
export const revalidate = 3600;

// Cache post data to prevent duplicate API calls
const getPostData = cache(async (slug: string) => {
  return await getPostBySlug(slug);
});

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for most recent blog posts at build time
// Cloudflare Workers has limits, so we pre-generate most recent posts
// Others will be generated on-demand with ISR (revalidate: 3600)
export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
    // Pre-generate first 200 posts to balance build time vs pre-generation
    // Adjust this number based on your Cloudflare Workers build limits
    return slugs.slice(0, 200);
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPostData(slug);

    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    // Extract clean text from HTML
    const cleanExcerpt = decode(post.excerpt.rendered.replace(/<[^>]*>/g, "").trim());
    const cleanTitle = decode(post.title.rendered.replace(/<[^>]*>/g, "").trim());

    // Get featured image
    const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

    // Get author
    const authorName = post._embedded?.author?.[0]?.name || "Banandre";

    // Get categories
    const categories =
      post._embedded?.["wp:term"]
        ?.find((terms) => terms.length > 0 && terms[0].taxonomy === "category")
        ?.map((cat) => cat.name) || [];

    // Get tags
    const tags =
      post._embedded?.["wp:term"]
        ?.find((terms) => terms.length > 0 && terms[0].taxonomy === "post_tag")
        ?.map((tag) => tag.name) || [];

    const url = `${siteConfig.url}/blog/${slug}`;

    return {
      title: cleanTitle,
      description: cleanExcerpt,
      authors: [{ name: authorName }],
      openGraph: {
        type: "article",
        title: cleanTitle,
        description: cleanExcerpt,
        url: url,
        siteName: siteConfig.name,
        images: featuredImage
          ? [
              {
                url: featuredImage,
                width: 1200,
                height: 630,
                alt: cleanTitle,
              },
            ]
          : [
              {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: siteConfig.name,
              },
            ],
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: [authorName],
        tags: tags,
        section: categories[0],
      },
      twitter: {
        card: "summary_large_image",
        site: "@andre_banandre",
        creator: "@andre_banandre",
        title: cleanTitle,
        description: cleanExcerpt,
        images: featuredImage ? [featuredImage] : [siteConfig.ogImage],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post",
    };
  }
}

export default async function WordPressBlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  try {
    // Fetch the post by slug (cached)
    const post = await getPostData(slug);

    if (!post) {
      notFound();
    }

    // Extract data from embedded responses
    const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0];
    const author = post._embedded?.author?.[0];

    // Extract categories
    const categories =
      post._embedded?.["wp:term"]
        ?.find((terms) => terms.length > 0 && terms[0].taxonomy === "category")
        ?.slice(0, 3) || []; // Limit to 3 categories

    // Extract tags
    const tags =
      post._embedded?.["wp:term"]
        ?.find((terms) => terms.length > 0 && terms[0].taxonomy === "post_tag")
        ?.slice(0, 10) || []; // Limit to 10 tags

    // Format date
    const date = new Date(post.date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Get clean title and excerpt
    const cleanTitle = decode(post.title.rendered.replace(/<[^>]*>/g, "").trim());
    const cleanExcerpt = decode(post.excerpt.rendered.replace(/<[^>]*>/g, "").trim());

    // Generate JSON-LD schemas
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: cleanTitle,
      description: cleanExcerpt,
      image: featuredImage?.source_url || siteConfig.ogImage,
      url: `${siteConfig.url}/blog/${slug}`,
      datePublished: post.date,
      dateModified: post.modified,
      author: {
        "@type": "Person",
        name: author?.name || siteConfig.name,
        url: siteConfig.url,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: siteConfig.ogImage,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/blog/${slug}`,
      },
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${siteConfig.url}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: cleanTitle,
          item: `${siteConfig.url}/blog/${slug}`,
        },
      ],
    };

    return (
      <>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        <div className="min-h-screen">
          {/* Full-Width Hero Section with Featured Image */}
          {featuredImage && (
            <div className="relative w-full h-[400px] md:h-[500px]">
              <Image
                src={featuredImage.source_url}
                alt={featuredImage.alt_text || cleanTitle}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                <div className="max-w-7xl mx-auto">
                  {categories.length > 0 && (
                    <div className="mb-4">
                      <Category category={categories[0].name} slug={categories[0].slug} />
                    </div>
                  )}
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    {cleanTitle}
                  </h1>
                  <p className="text-lg text-white/90">{cleanExcerpt}</p>
                  {/* Meta Information in Hero */}
                  <div className="flex items-center gap-4 text-sm text-white/80 mt-4">
                    <time dateTime={post.date}>{date}</time>
                    {author && (
                      <>
                        <span>•</span>
                        <span>by {author.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Two-Column Layout: Sidebar + Content */}
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-6">
              {/* Sidebar - Desktop only */}
              <BlogSidebar />

              {/* Main Content Area */}
              <div className="flex-1 min-w-0">
                <article className="max-w-4xl mx-auto px-4 md:px-6 py-8">
            {/* Article Header (if no featured image) */}
            {!featuredImage && (
              <header className="mb-8">
                {categories.length > 0 && (
                  <div className="mb-4">
                    <Category category={categories[0].name} slug={categories[0].slug} />
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {cleanTitle}
                </h1>
                <p className="text-xl text-muted-foreground">{cleanExcerpt}</p>
              </header>
            )}

            {/* Meta Information (only if no featured image, otherwise shown in hero) */}
            {!featuredImage && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
                <time dateTime={post.date}>{date}</time>
                {author && (
                  <>
                    <span>•</span>
                    <span>by {author.name}</span>
                  </>
                )}
              </div>
            )}

            {/* WordPress Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <WordPressPostRenderer post={post} />
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                {tags.map((tag) => (
                  <Tag key={tag.id} tag={tag.name} />
                ))}
              </div>
            )}

            {/* Categories */}
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.slice(1).map((category) => (
                  <Category key={category.id} category={category.name} slug={category.slug} />
                ))}
              </div>
            )}
          </article>

                {/* Related Posts - Client Side */}
                {post.categories.length > 0 && (
                  <RelatedPosts
                    currentPostId={post.id}
                    categoryId={post.categories[0]}
                  />
                )}

                {/* Scroll to Top */}
                <ScrollToTop />
              </div>
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </>
    );
    } catch (error) {
      console.error("Error rendering WordPress post:", error);
      notFound();
    }
  }
