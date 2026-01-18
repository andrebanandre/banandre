import { LandingBlogGrid } from "../../_components/landing-blog-grid";
import { AllCategoriesDisplay } from "../../_components/all-categories";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import { siteConfig } from "../../config";
import { getPostsPaginated } from "../../../lib/wordpress";

// Allow dynamic params for routes not in generateStaticParams
export const dynamicParams = true;

interface PageProps {
  params: Promise<{
    number: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { number } = await params;
  const page = parseInt(number, 10);

  return {
    title: `${siteConfig.name} - Page ${page}`,
    description: siteConfig.description,
    keywords: ["AI", "software architecture", "software development", "enterprise", "blog"],
    authors: [
      {
        name: siteConfig.name,
        url: siteConfig.url,
      },
    ],
    alternates: {
      canonical: page === 1 ? "/" : `/page/${page}`,
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
      url: `${siteConfig.url}/page/${page}`,
      title: `${siteConfig.name} - Page ${page}`,
      description: siteConfig.description,
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
      title: `${siteConfig.name} - Page ${page}`,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: "@andre_banandre",
    },
  };
}

export async function generateStaticParams() {
  // Get total pages to pre-generate some pagination pages
  const response = await getPostsPaginated(1, 12);
  const totalPages = response.headers.totalPages;

  // Pre-generate first 10 pages (adjust as needed)
  const pagesToGenerate = Math.min(totalPages, 10);

  return Array.from({ length: pagesToGenerate - 1 }, (_, i) => ({
    number: String(i + 2), // Start from page 2 since page 1 is the root
  }));
}

export default async function PaginatedPage({ params }: PageProps) {
  const { number } = await params;
  const page = parseInt(number, 10);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header Section */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Category navigation from actual blog posts */}
          <div className="mb-8">
            <AllCategoriesDisplay />
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <Link href="/categories">
              <button className="bg-[var(--muted)] text-white px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-[var(--accent)] hover:text-[var(--blue-accent)] transition-all duration-200 flex items-center space-x-2 w-full justify-center">
                <span>Browse Categories</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Blog Grid - The Primary Content */}
      <LandingBlogGrid page={page} />
    </div>
  );
}
