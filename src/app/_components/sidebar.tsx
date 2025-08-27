"use client";

import { usePathname } from "next/navigation";
import type { PageMapItem } from "nextra";
import { normalizePages } from "nextra/normalize-pages";
import { motion, easeOut, easeInOut } from "framer-motion";
import { SidebarItem, filterPagesByMeta } from "./sidebar-item";
import { SidebarCategories } from "./sidebar-categories";

export function Sidebar({ pageMap }: { pageMap: PageMapItem[] }) {
  const pathname = usePathname();
  const { docsDirectories } = normalizePages({
    list: pageMap,
    route: pathname || "/",
  });

  // Filter the pages based on _meta.json configuration
  const filteredDirectories = filterPagesByMeta(docsDirectories);

  // Customize sidebar items
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

  const customDirectories = customizeDirectories(filteredDirectories);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
        staggerChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  const titleVariants = {
    hover: {
      scale: 1.02,
      color: "var(--accent)",
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
  };

  return (
    <motion.aside
      className="w-80 bg-[var(--card)] border-r-4 border-[var(--accent)] p-6 overflow-y-auto hidden lg:block"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="mb-8" variants={headerVariants}>
        <motion.h2
          className="text-[var(--accent)] font-black text-xl uppercase tracking-wide mb-6 text-shadow-subtle"
          variants={titleVariants}
          whileHover="hover"
        >
          Navigation
        </motion.h2>
        <motion.div
          className="h-1 bg-[var(--accent)] w-16"
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ delay: 0.3, duration: 0.6, ease: easeOut }}
        />
      </motion.div>

      <nav>
        <motion.ul className="space-y-3" variants={containerVariants}>
          {customDirectories.map((item, index) => (
            <SidebarItem
              key={item.route || index}
              item={item}
              index={index}
              pathname={pathname || "/"}
            />
          ))}
        </motion.ul>

        {/* Categories Section */}
        <motion.div
          className="mt-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ delay: 0.5 }}
        >
          <SidebarCategories />
        </motion.div>
      </nav>
    </motion.aside>
  );
}
