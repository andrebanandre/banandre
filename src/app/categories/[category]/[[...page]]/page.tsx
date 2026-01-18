import {
  getAllCategories,
  getPostsByCategorySlug,
  getCategoryBySlug,
} from "@/lib/wordpress";
import { normalizeWordPressPost } from "@/lib/content-types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Category } from "../../../_components/category";
import { BlogGrid } from "../../../_components/blog-card";
import { Pagination } from "../../../_components/pagination";
import type { Metadata } from "next";
import {
  generateCategoryPageSchema,
  generateBreadcrumbSchema,
  safeJsonLdStringify,
} from "../../../../lib/json-ld";
import { siteConfig } from "../../../config";
import { Suspense } from "react";

// Allow dynamic params for routes not in generateStaticParams
export const dynamicParams = true;

// Fetch category data
async function getCategoryData(urlCategory: string, page: number) {
  const category = await getCategoryBySlug(urlCategory);
  if (!category) return null;

  // Fetch requested page with pagination info
  const response = await getPostsByCategorySlug(urlCategory, page, 12);
  const posts = response.data.map(normalizeWordPressPost);
  const totalPages = response.headers.totalPages;

  return { category, posts, totalPages };
}

interface CategoryPageProps {
  params: Promise<{
    category: string;
    page?: string[];
  }>;
}

export async function generateStaticParams() {
  // Fetch WordPress categories only
  const wpCategories = await getAllCategories();

  // Generate static params for first page only
  // Other pages will be generated on-demand with ISR
  return wpCategories.map((cat) => ({
    category: cat.slug,
    page: undefined, // This generates /categories/[category]
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const urlCategory = resolvedParams.category;
    // Extract page number from optional catch-all route
    // /categories/ai → page = 1
    // /categories/ai/2 → page = 2
    const page = resolvedParams.page?.[0] ? parseInt(resolvedParams.page[0], 10) : 1;

    // Use cached function to prevent duplicate API calls
    const data = await getCategoryData(urlCategory, page);
    if (!data) {
      return {
        title: `Category - ${siteConfig.name}`,
        description: "Category not found",
      };
    }

    const { category, posts } = data;
    const displayCategory = category.name;

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
  const resolvedParams = await params;
  const urlCategory = resolvedParams.category;
  // Extract page number from optional catch-all route
  // /categories/ai → page = 1
  // /categories/ai/2 → page = 2
  const page = resolvedParams.page?.[0] ? parseInt(resolvedParams.page[0], 10) : 1;

  // Use cached function to prevent duplicate API calls
  const data = await getCategoryData(urlCategory, page);
  if (!data || data.posts.length === 0) {
    notFound();
  }

  const { category, posts, totalPages } = data;
  const displayCategory = category.name;

  // Generate JSON-LD schemas
  const categorySchema = generateCategoryPageSchema(displayCategory, posts);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Categories", url: "/categories" },
    { name: displayCategory, url: `/categories/${urlCategory}` },
  ]);

  return (
    <>
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
              Showing page {page} of {totalPages}
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <BlogGrid posts={posts} />

            {/* Only show pagination if there are more pages */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl={`/categories/${urlCategory}`}
              />
            )}
          </Suspense>
        </div>
      </div>
    </>
  );
}
