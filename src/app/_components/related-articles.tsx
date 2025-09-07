"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { type BlogMetadata } from "../../lib/blog-utils";
import { BlogCard } from "./blog-card";

interface RelatedArticlesClientProps {
  relatedPosts: (BlogMetadata & { sharedTags: string[] })[];
}

export function RelatedArticlesClient({ relatedPosts }: RelatedArticlesClientProps) {
  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="my-16 pt-12 border-t-4 border-[var(--accent)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title text-[var(--accent)] mb-8 uppercase tracking-wide">
          Related Articles
        </h2>

        {/* Mobile: Vertical Stack | Desktop: Horizontal Scroll */}
        <div className="relative">
          {/* Mobile Layout - Vertical Stack */}
          <div className="block md:hidden">
            <div className="space-y-4 mb-6">
              {relatedPosts.slice(0, 3).map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <BlogCard post={post} size="medium" />
                </motion.div>
              ))}
            </div>

            {/* Mobile "View More" link when there are more than 3 articles */}
            {relatedPosts.length > 3 && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Link
                  href="/tags"
                  className="inline-block px-4 py-2 bg-[var(--accent)] text-[var(--blue-accent)] font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors brutalist-border hover:shadow-[4px_4px_0px_var(--accent)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                >
                  View All Related ({relatedPosts.length})
                </Link>
              </motion.div>
            )}
          </div>

          {/* Desktop Layout - Horizontal Scroll */}
          <div className="hidden md:block relative overflow-hidden">
            <motion.div
              className="flex gap-6 pb-4 related-articles-scroll"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                scrollSnapType: "x mandatory",
                overflowX: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "var(--accent) transparent",
              }}
            >
              {relatedPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  className="flex-shrink-0 w-80"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  style={{ scrollSnapAlign: "start" }}
                >
                  <BlogCard post={post} size="medium" />
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll indicator - Desktop only */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--border)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-[var(--accent)]"
                initial={{ width: "0%" }}
                animate={{ width: "30%" }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </motion.div>
          </div>
        </div>

        {relatedPosts.length >= 6 && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Link
              href="/tags"
              className="inline-block px-6 py-3 bg-[var(--accent)] text-[var(--blue-accent)] font-bold uppercase tracking-wider hover:bg-white transition-colors brutalist-border hover:shadow-[4px_4px_0px_var(--accent)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              View All Tags
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
