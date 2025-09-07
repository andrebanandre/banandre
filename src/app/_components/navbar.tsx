"use client";

import { usePathname } from "next/navigation";
import type { PageMapItem } from "nextra";
import { Anchor, Search } from "nextra/components";
import { normalizePages } from "nextra/normalize-pages";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import { motion, easeInOut, easeOut } from "framer-motion";
import { SidebarItem, filterPagesByMeta } from "./sidebar-item";
import { SidebarCategories } from "./sidebar-categories";

export const Navbar: FC<{ pageMap: PageMapItem[] }> = ({ pageMap }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const { topLevelNavbarItems, docsDirectories } = normalizePages({
    list: pageMap,
    route: pathname || "/",
  });

  // Filter the sidebar pages based on _meta.json configuration
  const filteredSidebarItems = filterPagesByMeta(docsDirectories);

  // Customize sidebar items same as in Sidebar component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customizeDirectories = (directories: any[]) => {
    return directories
      .map((item) => {
        // Rename "Banandre - No one cares about code" to "Home" and redirect to home
        if (item.title && item.title.includes("Banandre")) {
          return {
            ...item,
            title: "Home",
            route: "/",
            href: "/",
          };
        }
        // Remove CATEGORIES item - we'll add it as a custom section
        if (item.title === "CATEGORIES" || item.name === "categories") {
          return null;
        }
        return item;
      })
      .filter(Boolean); // Remove null items
  };

  const customSidebarItems = customizeDirectories(filteredSidebarItems);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    // Re-enable body scroll
    document.body.style.overflow = "unset";
  };

  const activateSearch = () => {
    setIsSearchActive(true);
    setIsMenuOpen(false); // Close mobile menu when search activates
    // Prevent body scroll when search dialog is open
    document.body.style.overflow = "hidden";
  };

  const deactivateSearch = () => {
    setIsSearchActive(false);
    // Re-enable body scroll
    document.body.style.overflow = "unset";
  };

  // Cleanup effect to restore scroll on unmount or route change
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Close search dialog on route change
  useEffect(() => {
    deactivateSearch();
  }, [pathname]);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: easeOut,
      },
    },
  };

  const logoVariants = {
    hover: {
      scale: 1.05,
      rotate: 2,
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
  };

  const navItemVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: easeInOut,
      },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: easeOut,
        staggerChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: easeOut,
      },
    },
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b-4 border-[var(--accent)] shadow-lg"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div className="flex-shrink-0" variants={itemVariants}>
              <Anchor href="/" className="text-decoration-none">
                <div>
                  <motion.div
                    className="inline-block text-[var(--blue-accent)] font-black text-3xl uppercase tracking-wider bg-[var(--accent)] bg-opacity-20 px-1 py-0.5 rounded mb-2 cursor-pointer"
                    variants={logoVariants}
                    whileHover="hover"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + 3 * 0.1, duration: 0.5 }}
                  >
                    BANANDRE
                  </motion.div>
                  <motion.div
                    className="text-xs text-gray-400 uppercase tracking-widest font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    NO ONE CARES ABOUT CODE
                  </motion.div>
                </div>
              </Anchor>
            </motion.div>

            <div className="flex items-center space-x-8">
              {/* Search Bar */}
              <motion.div className="hidden md:block flex-1 max-w-md mx-8" variants={itemVariants}>
                <Search
                  placeholder="Search..."
                  emptyResult="No results found."
                  errorText="Search failed to load."
                  loading="Searching..."
                />
              </motion.div>

              {/* Desktop Navigation */}
              <motion.div className="hidden md:block" variants={itemVariants}>
                <div className="flex items-baseline space-x-8">
                  {topLevelNavbarItems.map((item, index) => {
                    const route = item.route || ("href" in item ? item.href! : "");
                    const isActive = pathname === route;

                    return (
                      <motion.div
                        key={route}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                      >
                        <motion.div variants={navItemVariants} whileHover="hover">
                          <Anchor
                            href={route}
                            className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all duration-200 text-decoration-none brutalist-link
                              ${
                                isActive
                                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] brutalist-border"
                                  : "text-white hover:text-[var(--accent)] hover:bg-[var(--accent)] hover:bg-opacity-10"
                              }`}
                          >
                            {item.title}
                          </Anchor>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <motion.div className="md:hidden" variants={itemVariants}>
              <motion.button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 text-[var(--accent)] hover:bg-[var(--accent)] hover:bg-opacity-10 hover:text-[var(--blue-accent)] transition-colors duration-200"
                aria-label="Toggle menu"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: easeInOut }}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: easeInOut }}
                >
                  {isMenuOpen ? (
                    <Cross1Icon className="block h-6 w-6" />
                  ) : (
                    <HamburgerMenuIcon className="block h-6 w-6" />
                  )}
                </motion.div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu */}
      <motion.div
        className={`fixed inset-x-0 top-20 bottom-0 z-40 md:hidden ${isMenuOpen ? "block" : "hidden"}`}
        initial="hidden"
        animate={isMenuOpen ? "visible" : "hidden"}
        variants={mobileMenuVariants}
      >
        <motion.div
          className="bg-[var(--background)] border-b-4 border-[var(--accent)] shadow-lg h-full overflow-y-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
        >
          <div className="px-6 py-6 space-y-4 min-h-full">
            {/* Mobile Search */}
            <motion.div variants={mobileItemVariants} className="mb-4">
              <div className="relative" onFocus={activateSearch} onClick={activateSearch}>
                <Search
                  className="custom-search-input"
                  placeholder="Search BANANDRE..."
                  emptyResult="No results found."
                  errorText="Search failed to load."
                  loading="Searching..."
                />
              </div>
            </motion.div>

            {/* Top Level Navigation Items */}
            {topLevelNavbarItems.map((item) => {
              const route = item.route || ("href" in item ? item.href! : "");
              const isActive = pathname === route;

              return (
                <motion.div
                  key={route}
                  variants={mobileItemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2, ease: easeInOut }}
                >
                  <Anchor
                    href={route}
                    className={`block px-4 py-3 text-base font-bold uppercase tracking-wide transition-all duration-200 text-decoration-none
                      ${
                        isActive
                          ? "bg-[var(--accent)] text-[var(--accent-foreground)] brutalist-border"
                          : "text-white hover:text-[var(--accent)] hover:bg-[var(--accent)] hover:bg-opacity-10"
                      }`}
                    onClick={closeMenu}
                  >
                    {item.title}
                  </Anchor>
                </motion.div>
              );
            })}

            {/* Sidebar Navigation Items */}
            {customSidebarItems.length > 0 && (
              <>
                <motion.div
                  variants={mobileItemVariants}
                  className="pt-6 mt-6 border-t-2 border-[var(--accent)] border-opacity-30"
                >
                  <h3 className="text-[var(--accent)] font-black text-lg uppercase tracking-wide mb-4 px-4">
                    Navigation
                  </h3>
                </motion.div>

                {customSidebarItems.map((item, index) => (
                  <SidebarItem
                    key={item.route || index}
                    item={item}
                    index={index}
                    pathname={pathname || "/"}
                    isMobile={true}
                    onItemClick={closeMenu}
                  />
                ))}
              </>
            )}

            {/* Categories Section */}
            <motion.div
              variants={mobileItemVariants}
              className="pt-6 mt-6 border-t-2 border-[var(--accent)] border-opacity-30"
            >
              <div className="px-4">
                <SidebarCategories />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile Search Dialog */}
      {isSearchActive && (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={deactivateSearch}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Dialog Content */}
          <motion.div
            className="absolute inset-0 bg-[var(--background)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: easeOut }}
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between p-6 border-b-4 border-[var(--accent)] bg-[var(--background)]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {/* Logo */}
              <Anchor href="/" className="text-decoration-none">
                <div>
                  <motion.div
                    className="inline-block text-[var(--blue-accent)] font-black text-2xl uppercase tracking-wider bg-[var(--accent)] bg-opacity-20 px-1 py-0.5 rounded mb-1 cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    BANANDRE
                  </motion.div>
                  <motion.div
                    className="text-xs text-gray-400 uppercase tracking-widest font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    NO ONE CARES ABOUT CODE
                  </motion.div>
                </div>
              </Anchor>
              <motion.button
                onClick={deactivateSearch}
                className="p-2 text-[var(--accent)] hover:bg-[var(--accent)] hover:bg-opacity-10 hover:text-[var(--blue-accent)] transition-colors duration-200 rounded-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close search"
              >
                <Cross1Icon className="w-6 h-6" />
              </motion.button>
            </motion.div>

            {/* Search Content */}
            <motion.div
              className="p-6 h-full overflow-y-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {/* Search Input and Results */}
              <div className="max-w-4xl mx-auto">
                <Search
                  className="w-full"
                  placeholder="Search BANANDRE..."
                  emptyResult="No results found."
                  errorText="Search failed to load."
                  loading="Searching..."
                />

                {/* Search Results will appear here automatically from Nextra Search component */}
                <div className="mt-6">
                  {/* This space allows the search results to expand naturally */}
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-6 border-t-2 border-[var(--accent)] border-opacity-30 bg-[var(--background)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <motion.button
                onClick={deactivateSearch}
                className="w-full px-6 py-3 bg-[var(--accent)] text-[var(--accent-foreground)] font-bold uppercase tracking-wide rounded-lg hover:bg-opacity-90 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close Search
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};
