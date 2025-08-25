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

export const metadata: Metadata = {
  title: {
    absolute: "",
    template: "%s - Banandre",
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
