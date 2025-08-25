"use client";

import { usePathname } from "next/navigation";
import type { PageMapItem } from "nextra";
import { normalizePages } from "nextra/normalize-pages";
import { motion, easeOut, easeInOut } from "framer-motion";
import { SidebarItem, filterPagesByMeta } from "./sidebar-item";

export function Sidebar({ pageMap }: { pageMap: PageMapItem[] }) {
  const pathname = usePathname();
  const { docsDirectories } = normalizePages({
    list: pageMap,
    route: pathname || "/",
  });

  // Filter the pages based on _meta.json configuration
  const filteredDirectories = filterPagesByMeta(docsDirectories);

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
          {filteredDirectories.map((item, index) => (
            <SidebarItem
              key={item.route || index}
              item={item}
              index={index}
              pathname={pathname || "/"}
            />
          ))}
        </motion.ul>
      </nav>
    </motion.aside>
  );
}
