import { NextRequest, NextResponse } from "next/server";
import { searchPosts } from "@/lib/wordpress";

// Force dynamic rendering for search API (uses query parameters)
export const dynamic = 'force-dynamic';

// Cache the response for 2 minutes
export const revalidate = 120;

/**
 * Search API endpoint
 *
 * Benefits:
 * - Hides WordPress URL from client
 * - Server-side caching reduces load on WordPress
 * - Single point for rate limiting and security
 * - Better error handling
 *
 * Rate Limiting Options:
 * 1. Use Cloudflare Rate Limiting rules (recommended for production)
 * 2. Use Cloudflare KV for custom rate limiting
 * 3. Use Cloudflare Workers Rate Limiting API
 *
 * To add Cloudflare Rate Limiting:
 * - Go to Cloudflare Dashboard > Security > WAF > Rate limiting rules
 * - Create rule for /api/search/* path
 * - Set threshold (e.g., 20 requests per minute per IP)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const perPage = parseInt(searchParams.get("perPage") || "10", 10);

    // Validate query parameter
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    // Validate query length to prevent abuse
    if (query.length > 100) {
      return NextResponse.json(
        { error: "Query too long (max 100 characters)" },
        { status: 400 }
      );
    }

    // Validate perPage parameter
    if (perPage < 1 || perPage > 50) {
      return NextResponse.json(
        { error: "perPage must be between 1 and 50" },
        { status: 400 }
      );
    }

    // Fetch search results from WordPress
    // This call is cached server-side via Next.js cache
    const posts = await searchPosts(query, perPage);

    // Return results with aggressive cache headers
    // This reduces load on both WordPress and your edge workers
    return NextResponse.json(posts, {
      status: 200,
      headers: {
        // Cache for 2 minutes, allow stale for 4 minutes while revalidating
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240",
        // Add CORS headers if needed for external access
        // "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
