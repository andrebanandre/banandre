"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { transformMediaUrlClient } from "@/lib/wordpress";

interface SearchResult {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
  date: string;
}

interface WordPressSearchProps {
  placeholder?: string;
  className?: string;
}

export function WordPressSearch({
  placeholder = "Search blog posts...",
  className = "",
}: WordPressSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Use Next.js API route instead of calling WordPress directly
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&perPage=10`
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const posts: SearchResult[] = await response.json();
        setResults(posts);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (slug: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/blog/${slug}`);
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "").trim();
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-2 border-2 border-[var(--accent)] rounded-md leading-5 bg-[var(--background)] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-200"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[var(--accent)] border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[var(--card)] border-2 border-[var(--accent)] rounded-md shadow-lg max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400">
              {isLoading ? "Searching..." : "No results found."}
            </div>
          ) : (
            <ul className="py-2">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    onClick={() => handleResultClick(result.slug)}
                    className="w-full px-4 py-3 text-white hover:text-[var(--blue-accent)] hover:bg-[var(--accent-hover)] transition-colors duration-150 text-left flex items-start gap-3 cursor-pointer"
                  >
                    {result._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                      <div className="flex-shrink-0 w-16 h-16 relative">
                        <Image
                          src={transformMediaUrlClient(result._embedded["wp:featuredmedia"][0].source_url) || result._embedded["wp:featuredmedia"][0].source_url}
                          alt={stripHtml(result.title.rendered)}
                          fill
                          className="object-cover rounded"
                          sizes="64px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-white hover:text-[var(--blue-accent)] hover:bg-[var(--accent-hover)] font-bold text-sm mb-1 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: result.title.rendered }}
                      />
                      <div
                        className="text-white hover:text-[var(--blue-accent)] hover:bg-[var(--accent-hover)] text-xs line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: result.excerpt.rendered }}
                      />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
