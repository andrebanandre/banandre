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
  openGraph: {
    type: "website",
    title: "Banandre - Software Engineering Insights & AI Analysis",
    description:
      "Deep dives into software architecture, AI development, and engineering insights. Practical analysis of modern tech trends and development practices.",
    url: baseUrl,
    siteName: "Banandre",
    images: [
      {
        url: "/banana.png",
        width: 1200,
        height: 630,
        alt: "Banandre - Software Engineering Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@banandre",
    creator: "@banandre",
    title: "Banandre - Software Engineering Insights & AI Analysis",
    description:
      "Deep dives into software architecture, AI development, and engineering insights. Practical analysis of modern tech trends and development practices.",
    images: ["/banana.png"],
  },
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
  ],
};

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const pageMap = await getPageMap();
  const websiteSchema = generateWebSiteSchema();
  const organizationSchema = generateOrganizationSchema();
  const blogSchema = generateBlogSchema();

  return (
    <html lang="en" dir="ltr">
      <Head faviconGlyph="✦">
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
