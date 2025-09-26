import nextra from "nextra";
import type { NextConfig } from "next";
import rehypeMeta from "rehype-meta";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// Set up Nextra with its configuration
const withNextra = nextra({
  search: true,
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["anchor"],
          },
        },
      ],
      // Remove rehype-meta as it doesn't work properly with Nextra static exports
    ],
  },
  defaultShowCopyCode: true,
});

// Export the final Next.js config with Nextra included
const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: process.cwd(),
  images: {
    unoptimized: true, // mandatory for static export
  },
  eslint: {
    // Only run ESLint on specific directories during production builds
    dirs: ["src", "pages", "app", "components", "lib"],
  },
  distDir: "build",
  // Ensure proper TypeScript compilation
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has TypeScript errors, but only for build phase
    ignoreBuildErrors: false,
  },
  // Optimize for modern browsers to avoid unnecessary polyfills
  experimental: {
    // Use modern JavaScript features without transpilation for supported browsers
    esmExternals: true,
  },
  // Disable core-js polyfills for modern browsers
  webpack: (config, { dev, isServer }) => {
    if (!isServer && !dev) {
      // Remove core-js from the bundle
      config.resolve.alias = {
        ...config.resolve.alias,
        "core-js": false,
        "core-js-pure": false,
      };
    }
    return config;
  },
};

export default withNextra(nextConfig);
