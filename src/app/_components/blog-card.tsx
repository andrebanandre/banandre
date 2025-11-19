"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { decode } from "html-entities";

import { type NormalizedPost } from "../../lib/content-types";
import { ArrowRightIcon } from "@radix-ui/react-icons";

interface BlogCardProps {
  post: NormalizedPost;
  featured?: boolean;
  size?: "small" | "medium" | "large" | "featured";
}

export function BlogCard({ post, featured = false, size = "medium" }: BlogCardProps) {
  // Simplified card variants with minimal animation
  const cardVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Grid classes for different card sizes - simplified
  const sizeClasses = {
    small: "col-span-1",
    medium: "col-span-1 md:col-span-1",
    large: "col-span-1 md:col-span-2",
    featured: "col-span-1 md:col-span-2 lg:col-span-2",
  };

  return (
    <motion.div
      className={`
        ${sizeClasses[size]}
        h-[400px]
        bg-[var(--card)] 
        group 
        hover:shadow-[4px_4px_0px_var(--accent)] 
        transition-all 
        duration-200
        overflow-hidden
        rounded-md
        ${featured ? "border-[var(--accent)] border-2" : ""}
      `}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -2,
        transition: { duration: 0.1 },
      }}
    >
      <Link href={post.url} className="block h-full">
        <div className="h-full flex flex-col relative">
          {/* Image Cover - Full width, no gaps */}
          {post.image && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority={featured}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Category Badge */}
              {post.tags && post.tags.length > 0 && (
                <div className="absolute top-3 left-3">
                  <span className="bg-[var(--accent)] text-[var(--blue-accent)] px-2 py-1 text-xs font-bold uppercase tracking-wider">
                    {post.tags[0]}
                  </span>
                </div>
              )}

              {/* Featured Badge */}
              {featured && (
                <div className="absolute top-3 right-3">
                  <span className="bg-[var(--accent)] text-[var(--blue-accent)] px-2 py-1 text-xs font-bold uppercase tracking-wider">
                    Featured
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Content Section - Calculated height */}
          <div className="flex-1 p-4 flex flex-col min-h-0">
            <div className="flex-1 min-h-0">
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--accent)] transition-colors uppercase tracking-wide line-clamp-2">
                {decode(post.title)}
              </h3>

              {post.description && (
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{decode(post.description)}</p>
              )}
            </div>

            {/* Bottom section with tags and read more - Fixed positioning */}
            <div className="mt-auto space-y-3">
              {/* Tags with overflow handling */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 overflow-hidden max-h-8">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-[var(--accent)] bg-opacity-20 text-[var(--blue-accent)] px-2 py-1 font-bold uppercase"
                    >
                      #{tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-gray-400 px-1 py-1">...</span>
                  )}
                </div>
              )}

              {/* Read More - Always visible */}
              <motion.div
                className="text-[var(--accent)] text-sm font-bold uppercase tracking-wide group-hover:translate-x-1 transition-transform duration-200 flex items-center"
                whileHover={{ x: 2 }}
              >
                <span>Read More</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

interface BlogGridProps {
  posts: NormalizedPost[];
  currentPage?: number;
  totalPages?: number;
}

export function BlogGrid({ posts, currentPage, totalPages }: BlogGridProps) {
  if (!posts || posts.length === 0) return null;

  // Define a masonry-like layout pattern
  const getCardSize = (index: number): "small" | "medium" | "large" | "featured" => {
    if (index === 0) return "featured"; // First post is featured
    if (index === 1 || index === 4 || index === 7) return "large";
    if (index % 6 === 5) return "small";
    return "medium";
  };

  return (
    <div>
      {/* Page indicator */}
      {currentPage && totalPages && currentPage > 1 && (
        <div className="text-center mb-8">
          <span className="bg-[var(--accent)] text-[var(--blue-accent)] px-4 py-2 font-bold uppercase tracking-wider">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}

      {/* Grid layout similar to screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.map((post, index) => {
          return (
            <BlogCard key={post.url} post={post} featured={index === 0} size={getCardSize(index)} />
          );
        })}
      </div>
    </div>
  );
}
