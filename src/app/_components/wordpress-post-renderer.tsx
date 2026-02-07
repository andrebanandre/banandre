// WordPress Post Renderer Component
// Renders WordPress HTML content with proper styling and safety
"use client";

import React from "react";

interface WordPressPostRendererProps {
  /** Pre-transformed HTML content (URLs already proxied on server) */
  content: string;
  className?: string;
}

export function WordPressPostRenderer({
  content,
  className = "",
}: WordPressPostRendererProps) {
  return (
    <article
      className={`wordpress-content prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
}

interface WordPressTitleProps {
  title: string;
  className?: string;
}

export function WordPressTitle({ title, className = "" }: WordPressTitleProps) {
  return (
    <h1
      className={className}
      dangerouslySetInnerHTML={{ __html: title }}
    />
  );
}

interface WordPressExcerptProps {
  excerpt: string;
  className?: string;
}

export function WordPressExcerpt({
  excerpt,
  className = "",
}: WordPressExcerptProps) {
  // Strip HTML tags for clean excerpt display
  const cleanExcerpt = excerpt.replace(/<[^>]*>/g, "").trim();

  return <p className={className}>{cleanExcerpt}</p>;
}
