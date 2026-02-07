"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  Cross1Icon,
  ClockIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { decode } from "html-entities";
import { transformMediaUrlClient } from "@/lib/wordpress";

interface SearchResult {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  categories: number[];
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
  date: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export function SearchModal({ isOpen, onClose, categories }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem("banandre-recent-searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&perPage=10`
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const posts: SearchResult[] = await response.json();

        // Filter by category if selected
        let filteredPosts = posts;
        if (selectedCategory) {
          filteredPosts = posts.filter((post) =>
            post.categories?.includes(selectedCategory)
          );
        }

        setResults(filteredPosts);

        // Save to recent searches if it's a valid search
        if (!recentSearches.includes(query) && query.length > 2) {
          const newRecent = [query, ...recentSearches].slice(0, 5);
          setRecentSearches(newRecent);
          localStorage.setItem(
            "banandre-recent-searches",
            JSON.stringify(newRecent)
          );
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, selectedCategory, recentSearches]);

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setSelectedCategory(null);
    onClose();
  };

  const handleResultClick = (slug: string) => {
    handleClose();
    router.push(`/blog/${slug}`);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("banandre-recent-searches");
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "").trim();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Search Modal */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b-4 border-[var(--accent)] shadow-2xl"
          >
            <div className="max-w-4xl mx-auto w-full">
              {/* Search Header */}
              <div className="flex items-center gap-4 p-4 h-20">
                <MagnifyingGlassIcon className="w-6 h-6 text-[var(--accent)]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search posts, topics, or keywords..."
                  className="flex-1 bg-transparent text-xl md:text-2xl font-bold text-white placeholder:text-gray-500 focus:outline-none"
                />
                {isLoading && (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-[var(--accent)] border-t-transparent" />
                )}
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-[var(--accent)] hover:bg-opacity-20 rounded transition-colors"
                >
                  <Cross1Icon className="w-6 h-6 text-[var(--accent)]" />
                </button>
              </div>

              {/* Categories Filter */}
              <div className="px-4 pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wide transition-all whitespace-nowrap border-2 ${
                    selectedCategory === null
                      ? "bg-[var(--accent)] text-[var(--blue-accent)] border-[var(--accent)]"
                      : "bg-transparent text-gray-400 border-gray-600 hover:border-[var(--accent)] hover:text-white"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wide transition-all whitespace-nowrap border-2 ${
                      selectedCategory === category.id
                        ? "bg-[var(--accent)] text-[var(--blue-accent)] border-[var(--accent)]"
                        : "bg-transparent text-gray-400 border-gray-600 hover:border-[var(--accent)] hover:text-white"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Results Area */}
              <div className="border-t-4 border-[var(--accent)] max-h-[70vh] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--accent)] border-t-transparent" />
                  </div>
                ) : query ? (
                  <div className="p-4">
                    {results.length > 0 ? (
                      <div className="grid gap-2">
                        {results.map((post) => (
                          <button
                            key={post.id}
                            onClick={() => handleResultClick(post.slug)}
                            className="flex items-start gap-4 p-3 hover:bg-[var(--accent)] hover:bg-opacity-10 transition-colors text-left group border-2 border-transparent hover:border-[var(--accent)]"
                          >
                            <div className="relative w-24 h-16 md:w-32 md:h-20 flex-shrink-0 overflow-hidden bg-[var(--card)] border-2 border-[var(--accent)]">
                              {post._embedded?.["wp:featuredmedia"]?.[0]
                                ?.source_url ? (
                                <Image
                                  src={
                                    transformMediaUrlClient(post._embedded["wp:featuredmedia"][0].source_url) ||
                                    post._embedded["wp:featuredmedia"][0].source_url
                                  }
                                  alt={decode(stripHtml(post.title.rendered))}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                  <MagnifyingGlassIcon className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-white group-hover:text-[var(--blue-accent)] transition-colors line-clamp-2">
                                {decode(stripHtml(post.title.rendered))}
                              </h3>
                              <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                                {decode(stripHtml(post.excerpt.rendered))}
                              </p>
                            </div>
                            <ArrowRightIcon className="w-5 h-5 text-[var(--accent)] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all flex-shrink-0 mt-2" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-400 font-bold uppercase tracking-wide">
                          No results found for "{query}"
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          Try different keywords or remove category filter
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Recent Searches State
                  <div className="p-4">
                    {recentSearches.length > 0 ? (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3 px-2">
                          <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--accent)]">
                            Recent Searches
                          </h3>
                          <button
                            onClick={clearRecent}
                            className="text-xs font-bold uppercase text-gray-400 hover:text-[var(--accent)] transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="grid gap-2">
                          {recentSearches.map((term, i) => (
                            <button
                              key={i}
                              onClick={() => setQuery(term)}
                              className="flex items-center gap-3 p-3 hover:bg-[var(--accent)] hover:bg-opacity-10 transition-colors text-left text-sm border-2 border-transparent hover:border-[var(--accent)]"
                            >
                              <ClockIcon className="w-4 h-4 text-gray-500" />
                              <span className="text-white font-medium">
                                {term}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MagnifyingGlassIcon className="w-12 h-12 text-[var(--accent)] mx-auto mb-4 opacity-50" />
                        <p className="text-gray-400 font-bold uppercase tracking-wide">
                          Start typing to search
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          Search through all blog posts
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
