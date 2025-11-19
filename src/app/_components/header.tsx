"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HamburgerMenuIcon,
  Cross1Icon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import { WordPressSearch } from "./wordpress-search";
import { formatCategoryForUrl } from "@/lib/url-utils";

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "unset";
  };

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error("Failed to fetch categories:", err));

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isCategoriesOpen && !target.closest("[data-categories-dropdown]")) {
        setIsCategoriesOpen(false);
      }
    };

    if (isCategoriesOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isCategoriesOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b-4 border-[var(--accent)] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div>
                <div className="inline-block text-[var(--blue-accent)] font-black text-xl sm:text-2xl lg:text-3xl uppercase tracking-wider bg-[var(--accent)] bg-opacity-20 px-1 py-0.5 rounded cursor-pointer hover:scale-105 transition-transform">
                  BANANDRE
                </div>
                <div className="hidden sm:block text-xs text-gray-400 uppercase tracking-widest font-mono mt-1">
                  NO ONE CARES ABOUT CODE
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {/* Categories Dropdown */}
              <div className="relative" data-categories-dropdown>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all duration-200 text-white hover:text-[var(--blue-accent)] hover:bg-[var(--accent-hover)] rounded flex items-center gap-2"
                  aria-label="Categories menu"
                >
                  Categories
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isCategoriesOpen && (
                  <div className="absolute top-full mt-2 left-0 bg-[var(--card)] border-4 border-[var(--accent)] rounded shadow-lg min-w-[250px] max-h-[400px] overflow-y-auto z-50">
                    {categories.length > 0 ? (
                      <ul className="py-2">
                        {categories.map((category) => (
                          <li key={category.id}>
                            <Link
                              href={`/categories/${formatCategoryForUrl(category.name)}`}
                              onClick={() => setIsCategoriesOpen(false)}
                              className="block px-4 py-2 text-sm text-white hover:text-[var(--blue-accent)] hover:bg-[var(--accent-hover)] transition-colors"
                            >
                              <span className="font-bold">{category.name}</span>
                              <span className="text-gray-400 ml-2">({category.count})</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-400">Loading categories...</div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-[var(--accent)] hover:text-[var(--blue-accent)] hover:bg-[var(--accent-hover)] transition-colors rounded"
                aria-label="Toggle search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-[var(--accent)] hover:bg-[var(--accent)] hover:bg-opacity-10 transition-colors rounded"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <Cross1Icon className="h-6 w-6" />
              ) : (
                <HamburgerMenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Search Bar */}
          {isSearchOpen && (
            <div className="hidden md:block pb-4">
              <WordPressSearch placeholder="Search blog posts..." />
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-16 sm:top-20 bottom-0 z-40 md:hidden bg-[var(--background)] border-b-4 border-[var(--accent)] overflow-y-auto">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <WordPressSearch placeholder="Search blog posts..." />
            </div>

            {/* Categories List */}
            <div className="mb-6">
              <h3 className="px-4 py-2 text-sm font-black uppercase tracking-wide text-[var(--accent)] mb-2">
                Categories
              </h3>
              {categories.length > 0 ? (
                <ul className="space-y-1">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/categories/${formatCategoryForUrl(category.name)}`}
                        onClick={closeMenu}
                        className="block px-4 py-2 text-sm text-white hover:bg-[var(--accent)] hover:bg-opacity-20 transition-colors rounded"
                      >
                        <span className="font-bold">{category.name}</span>
                        <span className="text-gray-400 ml-2">({category.count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-2 text-sm text-gray-400">Loading categories...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from being hidden behind fixed header */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
}
