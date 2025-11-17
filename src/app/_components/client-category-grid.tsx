"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BlogGrid } from "./blog-card";
import { Pagination } from "./pagination";
import { type BlogMetadata } from "../../lib/blog-utils";
import { type NormalizedPost } from "../../lib/content-types";

interface ClientCategoryGridProps {
  posts: (BlogMetadata | NormalizedPost)[];
  baseUrl: string;
}

export function ClientCategoryGrid({ posts, baseUrl }: ClientCategoryGridProps) {
  const searchParams = useSearchParams();
  const postsPerPage = 12;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Start with page 1 to avoid hydration issues
  const [currentPage, setCurrentPage] = useState(1);

  // Single useEffect to handle all page updates
  useEffect(() => {
    const pageParam = searchParams?.get("page");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const validPage = page >= 1 && page <= totalPages ? page : 1;

    setCurrentPage(validPage);
  }, [searchParams, totalPages]);

  // Calculate posts for current page
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  return (
    <>
      <BlogGrid posts={currentPosts} />

      {/* Only show pagination if there are more pages */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={baseUrl} />
      )}
    </>
  );
}
