import nextra from 'nextra';
import type { NextConfig } from 'next';

// Set up Nextra with its configuration
const withNextra = nextra({
  search: true,
});

// Export the final Next.js config with Nextra included
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // mandatory, otherwise won't export
  },
  eslint: {
    // Only run ESLint on specific directories during production builds
    dirs: ['src', 'pages', 'app', 'components', 'lib'],
  },
  distDir: 'build',
  // ... Add regular Next.js options here
  turbopack: {
    resolveAlias: {
      "next-mdx-import-source-file": "./src/mdx-components.tsx",
    },
  },
};

export default withNextra(nextConfig);
