"use client";

import { useState, useEffect } from "react";
import { ChevronUpIcon } from "@radix-ui/react-icons";
import { motion, easeInOut, easeOut } from "framer-motion";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down more than 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Animation variants
  const buttonVariants = {
    hover: {
      scale: 1.1,
      rotate: -5,
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

  const iconVariants = {
    hover: {
      y: -3,
      transition: {
        duration: 0.2,
        ease: easeInOut,
      },
    },
  };

  return (
    <motion.button
      onClick={scrollToTop}
      className={`
        fixed z-40 bg-[var(--accent)] text-[var(--accent-foreground)] p-4 brutalist-border 
        font-bold hover:bg-[var(--accent-hover)] transition-colors duration-200
        ${isVisible ? "pointer-events-auto" : "pointer-events-none"}
        bottom-24 right-6
      `}
      aria-label="Scroll to top"
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
        y: isVisible ? 0 : 20,
      }}
      transition={{
        duration: 0.4,
        ease: easeOut,
      }}
    >
      <motion.div variants={iconVariants}>
        <ChevronUpIcon className="w-6 h-6" />
      </motion.div>
    </motion.button>
  );
}
