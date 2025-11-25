"use client";

import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export function Pagination({ currentPage, totalPages, baseUrl = "/" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const getPageUrl = (page: number) => {
    // Page 1 uses the base URL
    if (page === 1) return baseUrl;

    // For homepage pagination: /page/2, /page/3, etc.
    if (baseUrl === "/") {
      return `/page/${page}`;
    }

    // For category pagination: /categories/ai/2, /categories/ai/3, etc.
    return `${baseUrl}/${page}`;
  };

  const shouldShowPrevious = currentPage > 1;
  const shouldShowNext = currentPage < totalPages;

  return (
    <nav className="flex justify-center items-center mt-16 mb-8">
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        {shouldShowPrevious && (
          <Link href={getPageUrl(currentPage - 1)}>
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--card)] text-[var(--accent)] font-bold uppercase tracking-wide brutalist-border hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all duration-200 cursor-pointer">
              <ChevronLeftIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>
          </Link>
        )}

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <Link href={getPageUrl(page as number)}>
                <button
                  className={`
                    px-4 py-2 font-bold uppercase tracking-wide brutalist-border transition-all duration-200 cursor-pointer
                    ${
                      currentPage === page
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                        : "bg-[var(--card)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                    }
                  `}
                >
                  {page}
                </button>
              </Link>
            )}
          </div>
        ))}

        {/* Next Button */}
        {shouldShowNext && (
          <Link href={getPageUrl(currentPage + 1)}>
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--card)] text-[var(--accent)] font-bold uppercase tracking-wide brutalist-border hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all duration-200 cursor-pointer">
              <span className="hidden sm:inline">Next</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
