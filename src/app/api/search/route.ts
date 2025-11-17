import { NextRequest, NextResponse } from "next/server";
import { getPostsPaginated } from "@/lib/wordpress";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.trim() === "") {
    return NextResponse.json({ results: [] });
  }

  try {
    const response = await getPostsPaginated(1, 10, {
      search: query,
      _embed: true,
    });

    const results = response.data.map((post) => ({
      id: post.id,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      slug: post.slug,
      featuredImage: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
      date: post.date,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Search failed", results: [] },
      { status: 500 }
    );
  }
}
