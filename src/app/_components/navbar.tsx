"use client";

import { usePathname } from "next/navigation";
import type { PageMapItem } from "nextra";
import { Anchor, Search } from "nextra/components";
import { normalizePages } from "nextra/normalize-pages";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { HamburgerMenuIcon, Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { motion, easeInOut, easeOut } from "framer-motion";
import { SidebarItem, filterPagesByMeta } from "./sidebar-item";
import { SidebarCategories } from "./sidebar-categories";

export const Navbar: FC<{ pageMap: PageMapItem[] }> = ({ pageMap }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { topLevelNavbarItems, docsDirectories } = normalizePages({
    list: pageMap,
    route: pathname || "/",
  });

  // Filter the sidebar pages based on _meta.json configuration
  const filteredSidebarItems = filterPagesByMeta(docsDirectories);

  // Customize sidebar items same as in Sidebar component
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

  // Cleanup effect to restore scroll on unmount or route change
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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
              <Search
                className="custom-search-input"
                placeholder="Search BANANDRE..."
                emptyResult="No results found."
                errorText="Search failed to load."
                loading="Searching..."
              />
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

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-20"></div>
    </>
  );
};
