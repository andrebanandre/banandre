"use client";

import { useState, useEffect } from "react";
import { ListBulletIcon, Cross1Icon } from "@radix-ui/react-icons";
import type { Heading } from "nextra";
import { motion, easeInOut, easeOut } from "framer-motion";

export function TOC({ toc }: { toc: Heading[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Handle initial hash navigation on page load
    if (window.location.hash) {
      const elementId = window.location.hash.slice(1);
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }

    // Set up intersection observer for scroll spy
    const headingElements = toc
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -80% 0%",
        threshold: 0,
      }
    );

    // Start observing all headings
    headingElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    // Cleanup
    return () => {
      headingElements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [toc]);

  if (!toc || toc.length === 0) return null;

  const toggleTOC = () => setIsOpen(!isOpen);

  // Animation variants
  const buttonVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: easeInOut,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: easeOut,
      },
    },
  };

  const sidebarVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        duration: 0.4,
        ease: easeOut,
      },
    },
  };

  const desktopVariants = {
    hidden: { opacity: 0, x: 20 },
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

  return (
    <>
      {/* Mobile TOC Toggle Button */}
      <motion.button
        onClick={toggleTOC}
        className="fixed bottom-6 right-6 z-50 lg:hidden bg-[var(--accent)] text-[var(--accent-foreground)] p-4 brutalist-border font-bold hover:bg-[var(--accent-hover)] transition-colors duration-200"
        aria-label="Toggle table of contents"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: easeInOut }}
        >
          {isOpen ? <Cross1Icon className="w-6 h-6" /> : <ListBulletIcon className="w-6 h-6" />}
        </motion.div>
      </motion.button>

      {/* Mobile TOC Overlay */}
      <motion.div
        className={`fixed inset-0 z-40 lg:hidden ${isOpen ? "block" : "hidden"}`}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        variants={overlayVariants}
      >
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-75"
          onClick={toggleTOC}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-[var(--background)] border-l-4 border-[var(--accent)] p-6 overflow-y-auto"
          variants={sidebarVariants}
        >
          <TOCContent toc={toc} activeId={activeId} onItemClick={() => setIsOpen(false)} />
        </motion.div>
      </motion.div>

      {/* Desktop TOC - Made sticky and full height */}
      <motion.aside
        className="hidden lg:block w-80 flex-shrink-0 sticky top-0 h-screen bg-[var(--card)] border-l-4 border-[var(--accent)]"
        initial="hidden"
        animate="visible"
        variants={desktopVariants}
      >
        <div className="h-full overflow-y-auto p-8">
          <TOCContent toc={toc} activeId={activeId} />
        </div>
      </motion.aside>
    </>
  );
}

function TOCContent({
  toc,
  activeId,
  onItemClick,
}: {
  toc: Heading[];
  activeId: string;
  onItemClick?: () => void;
}) {
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

  const linkVariants = {
    hover: {
      x: 5,
      transition: {
        duration: 0.2,
        ease: easeInOut,
      },
    },
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Update URL hash
      history.pushState(null, "", `#${id}`);
    }
    if (onItemClick) onItemClick();
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h3
          className="text-[var(--accent)] font-black text-xl uppercase tracking-wide mb-6 text-shadow-subtle"
          variants={titleVariants}
          whileHover="hover"
        >
          Table of Contents
        </motion.h3>
      </motion.div>

      <nav className="flex-1">
        <ul className="space-y-3">
          {toc.map((item: Heading, index: number) => {
            const isActive = activeId === item.id;
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                <motion.a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`
                    text-sm font-medium flex items-center group transition-all duration-200 py-2 px-3 rounded-md

                    ${item.depth === 2 ? "font-bold" : item.depth === 3 ? "ml-4" : "ml-8"}
                    ${
                      isActive
                        ? "bg-[var(--accent)] bg-opacity-20 border-l-4 border-[var(--accent)] text-[var(--blue-accent)] font-bold"
                        : "hover:bg-[var(--accent)] hover:bg-opacity-10 hover:text-[var(--blue-accent)]"
                    }
                    ${
                      !isActive
                        ? item.depth === 2
                          ? "text-white"
                          : item.depth === 3
                            ? "text-gray-300"
                            : "text-gray-400"
                        : ""
                    }
                  `}
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <motion.span
                    className={`mr-2 group-hover:translate-x-1 transition-transform duration-200 ${
                      isActive ? "text-[var(--blue-accent)]" : "text-[var(--accent)]"
                    }`}
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                    animate={{ rotate: isActive ? 90 : 0 }}
                  >
                    ▶
                  </motion.span>
                  {item.value}
                </motion.a>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Edit on GitHub Link - Always at the bottom */}
      {/* <motion.div
        className="mt-auto pt-6 border-t border-[var(--accent)] border-opacity-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <EditOnGitHubLink />
      </motion.div> */}
    </div>
  );
}
