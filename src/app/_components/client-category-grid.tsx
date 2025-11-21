"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BlogGrid } from "./blog-card";
import { Pagination } from "./pagination";
import { BlogGridSkeleton } from "./blog-card-skeleton";
import { type NormalizedPost } from "../../lib/content-types";
import { getPostsByCategorySlug } from "../../lib/wordpress";
import { normalizeWordPressPost } from "../../lib/content-types";

interface ClientCategoryGridProps {
  initialPosts: NormalizedPost[];
  totalPages: number;
  categorySlug: string;
  baseUrl: string;
}

export function ClientCategoryGrid({
  initialPosts,
  totalPages,
  categorySlug,
  baseUrl,
}: ClientCategoryGridProps) {
  const searchParams = useSearchParams();
  const postsPerPage = 12;

  // Start with page 1 to avoid hydration issues
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<NormalizedPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);

  // Handle page changes and fetch data client-side
  useEffect(() => {
    const pageParam = searchParams?.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const validPage = page >= 1 && page <= totalPages ? page : 1;

    setCurrentPage(validPage);

    // If we're on page 1, use initial posts
    if (validPage === 1) {
      setPosts(initialPosts);
      return;
    }

    // Fetch posts for other pages client-side
    const fetchPagePosts = async () => {
      setIsLoading(true);
      try {
        const response = await getPostsByCategorySlug(categorySlug, validPage, postsPerPage);
        const normalizedPosts = response.data.map(normalizeWordPressPost);
        setPosts(normalizedPosts);
      } catch (error) {
        console.error("Error fetching category posts:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPagePosts();
  }, [searchParams, totalPages, postsPerPage, initialPosts, categorySlug]);

  return (
    <>
      {isLoading ? (
        <BlogGridSkeleton count={12} />
      ) : (
        <BlogGrid posts={posts} />
      )}

      {/* Only show pagination if there are more pages */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={baseUrl} />
      )}
    </>
  );
}
