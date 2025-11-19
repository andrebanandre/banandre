"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BlogGrid } from "./blog-card";
import { Pagination } from "./pagination";
import { type NormalizedPost } from "../../lib/content-types";

interface ClientBlogGridProps {
  posts: NormalizedPost[];
}

export function ClientBlogGrid({ posts }: ClientBlogGridProps) {
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
    <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
      <BlogGrid posts={currentPosts} currentPage={currentPage} totalPages={totalPages} />

      {/* Only show pagination if there are more pages */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/" />
      )}
    </div>
  );
}
