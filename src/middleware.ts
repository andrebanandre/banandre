import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RESERVED_ROOT_SEGMENTS = new Set([
  "api",
  "blog",
  "categories",
  "impressum",
  "page",
  "privacy",
  "sitemap",
  "tags",
  "terms",
]);

export function middleware(request: NextRequest): NextResponse {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);

  // Only redirect old root-level slugs: /post-slug -> /blog/post-slug
  if (segments.length !== 1) {
    return NextResponse.next();
  }

  const slug = segments[0];

  // Skip explicit root assets/routes such as /sitemap.xml, /rss.xml, /robots.txt, etc.
  if (slug.includes(".") || RESERVED_ROOT_SEGMENTS.has(slug)) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/blog/${slug}`;

  return NextResponse.redirect(redirectUrl, 301);
}

export const config = {
  matcher: "/:path*",
};
