"use client";

import { useState, useEffect } from "react";
import { getPostsByCategoryClient } from "@/lib/wordpress";
import { BlogCard } from "./blog-card";
import { normalizeWordPressPost } from "@/lib/content-types";
import type { Post } from "@/lib/wordpress.d";

interface RelatedPostsProps {
  currentPostId: number;
  categoryId: number;
}

export function RelatedPosts({ currentPostId, categoryId }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        const posts = await getPostsByCategoryClient(categoryId, 4, currentPostId);
        // Only take the first 3 posts
        setRelatedPosts(posts.slice(0, 3));
      } catch (error) {
        console.warn("Failed to fetch related posts:", error);
        setRelatedPosts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRelatedPosts();
  }, [currentPostId, categoryId]);

  // Don't render anything if loading or no posts
  if (isLoading) {
    return (
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold text-[var(--accent)] mb-8 uppercase tracking-wide">
          Related Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-[var(--card)] border-2 border-[var(--accent)] rounded animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <h2 className="text-2xl font-bold text-[var(--accent)] mb-8 uppercase tracking-wide">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedPosts.map((relatedPost) => {
          const normalizedPost = normalizeWordPressPost(relatedPost);
          return (
            <BlogCard
              key={relatedPost.id}
              post={normalizedPost}
              size="medium"
            />
          );
        })}
      </div>
    </section>
  );
}
