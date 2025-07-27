This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Sitemap Configuration

This project uses [next-sitemap](https://github.com/iamvishnusankar/next-sitemap) to automatically generate sitemaps for all your MDX pages.

### Configuration

The sitemap is configured in `next-sitemap.config.js` with the following features:

- **Automatic MDX page discovery**: All your MDX pages in `/demo/` and `/docs/` are automatically included
- **Smart priority assignment**: 
  - Homepage: 1.0 priority, daily updates
  - Blog posts: 0.8 priority, weekly updates  
  - Tag pages: 0.6 priority, monthly updates
- **Robots.txt generation**: Automatically creates a robots.txt file
- **Static export compatible**: Works with your `output: 'export'` configuration

### Environment Variables

Create a `.env.local` file in your project root and add:

```bash
SITE_URL=https://your-domain.com
```

### Usage

The sitemap is automatically generated after each build via the `postbuild` script. To generate it manually:

```bash
npm run build
# or
npx next-sitemap
```

### Generated Files

After building, you'll find these files in your `build/` directory:
- `sitemap.xml` - Main sitemap index
- `robots.txt` - Robots file with sitemap references
- `sitemap-*.xml` - Individual sitemap files (if you have many pages)
