import type { Metadata } from "next";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import type { FC, ReactNode } from "react";
import { NextraTheme } from "./_components/nextra-theme";
import GoogleAnalytics from "./_components/google-analytics";
import {
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateBlogSchema,
  safeJsonLdStringify,
} from "../lib/json-ld";
import "./globals.css";
import "./sidebar.css";
import "nextra-theme-blog/style.css";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://banandre.com";

export const metadata: Metadata = {
  title: {
    absolute: "",
    template: "%s - Banandre",
    default: "Banandre - Software Engineering Insights & AI Analysis",
  },
  description:
    "Deep dives into software architecture, AI development, and engineering insights. Practical analysis of modern tech trends and development practices.",
  authors: [{ name: "Banandre", url: baseUrl }],
  creator: "Banandre",
  publisher: "Banandre",
  metadataBase: new URL(baseUrl),
  // OpenGraph and Twitter metadata handled by individual pages/blog posts
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "software engineering",
    "artificial intelligence",
    "programming",
    "technology insights",
    "software architecture",
    "AI development",
    "tech analysis",
    "machine learning",
    "software development",
    "engineering management",
    "product management",
    "tech blog",
    "coding",
    "developer tools",
  ],
  category: "technology",
  classification: "Software Engineering & AI Analysis",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/banana.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
};

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const pageMap = await getPageMap();
  const websiteSchema = generateWebSiteSchema();
  const organizationSchema = generateOrganizationSchema();
  const blogSchema = generateBlogSchema();

  return (
    <html lang="en" dir="ltr">
      <Head faviconGlyph="✦">
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />

        {/* Preconnect to critical resources */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />

        {/* Performance optimizations */}
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
        <link rel="modulepreload" href="/_next/static/chunks/webpack.js" />

        {/* Security */}
        <link rel="canonical" href="https://www.banandre.com" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLdStringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLdStringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLdStringify(blogSchema),
          }}
        />
      </Head>
      <body style={{ margin: 0 }}>
        <NextraTheme pageMap={pageMap}>{children}</NextraTheme>
        <GoogleAnalytics />
      </body>
    </html>
  );
};

export default RootLayout;
