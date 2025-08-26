import {
  getPostsByCategory,
  getAllCategories,
  parseCategoryFromUrl,
  formatCategoryForUrl,
} from "../../../lib/blog-utils";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Category } from "../../_components/category";
import type { Metadata } from "next";
import {
  generateCategoryPageSchema,
  generateBreadcrumbSchema,
  safeJsonLdStringify,
} from "../../../lib/json-ld";
import { Head } from "nextra/components";
import { siteConfig } from "../../config";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();

  return categories.map(({ category }) => ({
    category: formatCategoryForUrl(category),
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const { category: urlCategory } = await params;
    const displayCategory = parseCategoryFromUrl(urlCategory);
    const posts = await getPostsByCategory(displayCategory);

    const title = `${displayCategory} - ${siteConfig.name}`;
    const description = `Articles in ${displayCategory}. ${posts.length} article${posts.length !== 1 ? "s" : ""} found.`;

    return {
      title,
      description,
      keywords: [
        displayCategory,
        "coding",
        "programming",
        "software development",
        "technology",
        "blog",
      ],
      authors: [
        {
          name: siteConfig.name,
          url: siteConfig.url,
        },
      ],
      alternates: {
        canonical: `/categories/${urlCategory}`,
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
        url: `${siteConfig.url}/categories/${urlCategory}`,
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
      title: `Category - ${siteConfig.name}`,
      description: "Articles by category",
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: urlCategory } = await params;
  const displayCategory = parseCategoryFromUrl(urlCategory);

  const posts = await getPostsByCategory(displayCategory);

  if (posts.length === 0) {
    notFound();
  }

  // Generate JSON-LD schemas
  const categorySchema = generateCategoryPageSchema(displayCategory, posts);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Categories", url: "/categories" },
    { name: displayCategory, url: `/categories/${urlCategory}` },
  ]);

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLdStringify(categorySchema),
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
              href="/categories"
              className="text-[var(--accent)] hover:text-white transition-colors mb-4 inline-block"
            >
              ← Back to all categories
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <h1 className="display-title text-white text-shadow-brutal">Category:</h1>
              <Category category={displayCategory} />
            </div>

            <p className="text-gray-200 text-lg">
              {posts.length} article{posts.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="grid gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-[var(--card)] brutalist-border p-6 hover:bg-[var(--muted)] transition-colors group"
              >
                <Link href={post.slug} className="block">
                  <div className="flex flex-col gap-4">
                    {post.image && (
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={800}
                        height={192}
                        className="w-full h-48 object-cover brutalist-border"
                      />
                    )}

                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[var(--accent)] transition-colors">
                        {post.title}
                      </h2>

                      {post.description && <p className="text-gray-300 mb-4">{post.description}</p>}

                      <div className="flex flex-wrap gap-2">
                        {post.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {post.categories.map((category) => (
                              <span
                                key={category}
                                className="text-xs bg-[var(--accent)] bg-opacity-20 text-[var(--blue-accent)] px-2 py-1 font-bold uppercase"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        )}

                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-[var(--muted)] bg-opacity-50 text-[var(--foreground)] px-2 py-1 font-bold uppercase"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
