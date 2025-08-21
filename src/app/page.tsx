import { LandingBlogGrid } from "./_components/landing-blog-grid";
import { AllTagsDisplay } from "./_components/all-tags";
import { FallingBananasTitle } from "./_components/falling-bananas";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banandre - No One Cares About Code",
  description:
    "A brutalist blog about coding, technology, and everything in between. Raw, unfiltered thoughts on software development.",
  keywords: ["coding", "programming", "software development", "technology", "blog"],
  authors: [{ name: "Banandre" }],
  creator: "Banandre",
  publisher: "Banandre",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Banandre - No One Cares About Code",
    description: "A brutalist blog about coding, technology, and everything in between.",
    type: "website",
    siteName: "Banandre",
  },
  twitter: {
    card: "summary_large_image",
    title: "Banandre - No One Cares About Code",
    description: "A brutalist blog about coding, technology, and everything in between.",
  },
};

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header Section - Like screenshot */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            {/* Falling Bananas Title */}
            <div className="flex-1">
              <FallingBananasTitle />
            </div>

            {/* Read Our Blog Button */}
            {/* <div className="hidden md:block ml-8">
              <Link href="/tags">
                <button className="bg-[var(--muted)] text-white px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-[var(--accent)] hover:text-[var(--blue-accent)] transition-all duration-200 flex items-center space-x-2">
                  <span>All Articles</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </Link>
            </div> */}
          </div>

          {/* Navigation Bar like in screenshot */}
          {/* <div className="border-t-2 border-b-2 border-white py-2 mb-8">
            <div className="flex flex-wrap gap-6 text-white text-sm font-bold uppercase tracking-wider">
              <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
              <Link href="/demo" className="hover:text-[var(--accent)] transition-colors">Editorial</Link>
              <Link href="/docs" className="hover:text-[var(--accent)] transition-colors">Essentials</Link>
              <Link href="/tags" className="hover:text-[var(--accent)] transition-colors">Blog</Link>
            </div>
          </div> */}

          {/* Tag categories from actual blog posts */}
          <div className="mb-8">
            <AllTagsDisplay />
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <Link href="/tags">
              <button className="bg-[var(--muted)] text-white px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-[var(--accent)] hover:text-[var(--blue-accent)] transition-all duration-200 flex items-center space-x-2 w-full justify-center">
                <span>Read Our Blog</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Blog Grid - The Primary Content */}
      <LandingBlogGrid />
    </div>
  );
}
