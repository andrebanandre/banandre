import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Redirect old WordPress date-based URLs to new structure
  async redirects() {
    return [
      {
        source: '/:year(\\d{4})-:month(\\d{2})/:slug*',
        destination: '/blog/:slug*',
        permanent: true, // 301 redirect
      },
    ];
  },
  // Removed output: "export" to enable SSR/ISR for WordPress integration
  outputFileTracingRoot: process.cwd(),
  // Allow more time for slow external data sources during SSR/ISR
  staticPageGenerationTimeout: 180,
  images: {
    // Configure remote patterns for WordPress images
    remotePatterns: [
      {
        protocol: (process.env.WORDPRESS_PROTOCOL as "http" | "https") || "https",
        hostname: process.env.WORDPRESS_HOSTNAME || "your-wordpress-site.com",
        port: process.env.WORDPRESS_PORT || "",
        pathname: process.env.WORDPRESS_PATHNAME || "/wp-content/uploads/**",
      },
      // Development: Allow localhost WordPress
      {
        protocol: "http",
        hostname: "localhost",
        port: "9999",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "9999",
        pathname: "/wp-content/uploads/**",
      },
      // Production: Allow all HTTPS images as fallback
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Optimize images for better performance
    unoptimized: false,
  },
  eslint: {
    // Only run ESLint on specific directories during production builds
    dirs: ["src", "pages", "app", "components", "lib"],
  },
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

export default nextConfig;
