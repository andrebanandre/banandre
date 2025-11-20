import { LandingBlogGrid } from "./_components/landing-blog-grid";
import { AllCategoriesDisplay } from "./_components/all-categories";
import { FallingBananasTitle } from "./_components/falling-bananas";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import { siteConfig } from "./config";

// Enable ISR - revalidate every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.title}`,
  description: siteConfig.description,
  keywords: ["AI", "software architecture", "software development", "enterprise", "blog"],
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
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
    url: siteConfig.url,
    title: siteConfig.name,
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
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@andre_banandre",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
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
      <LandingBlogGrid />
    </div>
  );
}
