"use client";

import Link from "next/link";
import { motion, easeInOut, easeOut } from "framer-motion";

// Format tag for URL (lowercase, spaces to dashes, no special chars)
// Note: WordPress tags already have slugs - prefer using tag.slug directly
function formatTagForUrl(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^a-z0-9-]/g, ""); // Remove all non-alphanumeric except dashes
}

interface TagProps {
  tag: string;
  className?: string;
  showHash?: boolean;
}

export function Tag({ tag, className = "", showHash = true }: TagProps) {
  const formattedTag = formatTagForUrl(tag);

  // Animation variants for individual tags
  const tagVariants = {
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

  return (
    <motion.div variants={tagVariants} whileHover="hover" whileTap="tap">
      <Link
        href={`/tags/${formattedTag}`}
        className={`
          inline-block
          px-3 py-1
          bg-[var(--muted)]
          text-gray-400
          font-bold
          text-sm
          uppercase
          tracking-wider
          hover:bg-[var(--accent)]
          hover:text-[var(--accent-foreground)]
          transition-all
          duration-200
          brutalist-border
          hover:shadow-[2px_2px_0px_var(--accent)]
          hover:translate-x-[-2px]
          hover:translate-y-[-2px]
          ${className}
        `}
      >
        {showHash && "#"}
        {tag}
      </Link>
    </motion.div>
  );
}

interface TagListProps {
  tags: string[];
  className?: string;
}

export function TagList({ tags, className = "" }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  // Animation variants for tag list container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  return (
    <motion.div
      className={`flex flex-wrap gap-3 ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {tags.map((tag, index) => (
        <motion.div
          key={tag}
          variants={itemVariants}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
        >
          <Tag tag={tag} />
        </motion.div>
      ))}
    </motion.div>
  );
}

// Component to replace the "**Tags:** #tag1 #tag2" text with clickable tags
interface InlineTagsProps {
  children: string;
}

export function InlineTags({ children }: InlineTagsProps) {
  // Check if this is a tags line
  const tagMatch = children.match(/\*\*Tags:\*\*\s*((?:#\w+\s*)+)/);

  if (!tagMatch) {
    return <span>{children}</span>;
  }

  // Extract hashtags
  const hashtagMatches = tagMatch[1].match(/#(\w+)/g) || [];
  const tags = hashtagMatches.map((hashtag) => hashtag.replace("#", ""));

  // Animation variants for the entire tags section
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
      },
    },
  };

  const labelVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  return (
    <motion.div
      className="mt-8 pt-6 border-t-2 border-[var(--accent)]"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="flex items-center gap-4 flex-wrap">
        <motion.span
          className="text-[var(--accent)] font-bold uppercase tracking-wider text-sm"
          variants={labelVariants}
          whileHover={{
            scale: 1.05,
            rotate: 1,
            transition: { duration: 0.2, ease: easeInOut },
          }}
        >
          Tags:
        </motion.span>
        <TagList tags={tags} />
      </div>
    </motion.div>
  );
}
