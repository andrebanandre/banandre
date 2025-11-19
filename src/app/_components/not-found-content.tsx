"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { HomeIcon, ArrowLeftIcon } from "@radix-ui/react-icons";

export function NotFoundContent() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0, rotate: -5 },
    visible: {
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const glitchVariants = {
    hidden: { x: 0, y: 0 },
    visible: {
      x: [0, -2, 2, -2, 0],
      y: [0, 2, -2, 2, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "mirror" as const,
        repeatDelay: 3,
      },
    },
  };

  const bananaVariants = {
    hidden: { y: -100, opacity: 0, rotate: 0 },
    visible: {
      y: 0,
      opacity: 1,
      rotate: 360,
      transition: {
        type: "spring",
        bounce: 0.6,
        duration: 1.5,
      },
    },
    hover: {
      rotate: [0, -10, 10, -10, 0],
      scale: 1.1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-[var(--accent)] rounded-full" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-[var(--accent)] rounded-none rotate-12" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[var(--blue-accent)] rounded-full" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-2xl mx-auto"
      >
        {/* Giant 404 */}
        <motion.div variants={itemVariants} className="relative mb-8">
          <motion.h1
            className="text-[150px] md:text-[200px] font-black leading-none text-[var(--accent)] select-none"
            style={{ textShadow: "10px 10px 0px var(--foreground)" }}
            variants={glitchVariants}
          >
            404
          </motion.h1>

          {/* Floating Banana */}
          <motion.div
            className="absolute top-0 right-0 md:-right-10 md:top-10 w-32 h-32 md:w-48 md:h-48"
            variants={bananaVariants}
            whileHover="hover"
            drag
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
          >
            <Image
              src="/banana-open.png"
              alt="Lost Banana"
              width={200}
              height={200}
              className="w-full h-full object-contain drop-shadow-[5px_5px_0px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          variants={itemVariants}
          className="space-y-6 bg-[var(--card)] p-8 border-4 border-[var(--foreground)] shadow-[8px_8px_0px_var(--accent)]"
        >
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
            You've slipped on a bad link
          </h2>
          <p className="text-xl text-gray-400 font-mono">
            The page you're looking for has peeled away or never existed.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/" passHref>
              <motion.button
                className="w-full sm:w-auto px-8 py-4 bg-[var(--accent)] text-[var(--blue-accent)] font-black text-lg uppercase tracking-wider border-2 border-[var(--foreground)] shadow-[4px_4px_0px_var(--foreground)] flex items-center justify-center gap-2"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "6px 6px 0px var(--foreground)",
                  translateY: -2,
                  translateX: -2,
                }}
                whileTap={{
                  scale: 0.95,
                  boxShadow: "0px 0px 0px var(--foreground)",
                  translateY: 2,
                  translateX: 2,
                }}
              >
                <HomeIcon className="w-6 h-6" />
                Go Home
              </motion.button>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 py-4 bg-[var(--background)] text-[var(--foreground)] font-bold text-lg uppercase tracking-wider border-2 border-[var(--foreground)] shadow-[4px_4px_0px_var(--accent)] flex items-center justify-center gap-2 hover:bg-[var(--muted)] transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
              Go Back
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
