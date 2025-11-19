import { NextResponse } from "next/server";
import { getAllCategories } from "@/lib/wordpress";

export async function GET() {
  try {
    const categories = await getAllCategories();

    // Sort by count (most used first) and return top categories
    const sortedCategories = categories
      .sort((a, b) => b.count - a.count)
      .map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        count: category.count,
      }));

    return NextResponse.json({ categories: sortedCategories });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories", categories: [] },
      { status: 500 }
    );
  }
}
