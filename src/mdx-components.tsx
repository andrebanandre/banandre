import React from "react";
import { useMDXComponents as getNextraComponents } from "nextra/mdx-components";
import { TOC } from "./app/_components/toc";
import { InlineTags, TagList } from "./app/_components/tag";
import { RelatedArticles, RelatedArticlesMDX } from "./app/_components/related-articles-server";
import Link from "next/link";
import Image from "next/image";

// Extend the Nextra metadata type with blog-specific properties
interface BlogNextraMetadata {
  title: string;
  description?: string | null;
  image?: string;
  tags?: string[];
  slug?: string;
  date?: string;
  filePath: string;
  timestamp?: number;
  readingTime?: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
}

const components = {
  h1: (props: Record<string, unknown>) => (
    <h1
      className="scroll-m-20 display-title text-white mb-8 mt-12 first:mt-0 text-shadow-brutal"
      {...props}
    />
  ),
  h2: (props: Record<string, unknown>) => (
    <h2
      className="section-title text-[var(--accent)] mt-16 mb-6 first:mt-0 pb-4 border-b-4 border-[var(--accent)] uppercase tracking-wide text-shadow-subtle"
      {...props}
    />
  ),
  h3: (props: Record<string, unknown>) => (
    <h3
      className="scroll-m-20 text-2xl md:text-3xl font-bold tracking-tight text-white mt-12 mb-4 uppercase letter-spacing-wide"
      {...props}
    />
  ),
  h4: (props: Record<string, unknown>) => (
    <h4
      className="scroll-m-20 text-xl font-bold tracking-tight text-[var(--accent)] mt-8 mb-3 uppercase"
      {...props}
    />
  ),
  h5: (props: Record<string, unknown>) => (
    <h5
      className="scroll-m-20 text-lg font-semibold tracking-tight text-white mt-6 mb-2"
      {...props}
    />
  ),
  h6: (props: Record<string, unknown>) => (
    <h6
      className="scroll-m-20 text-base font-semibold tracking-tight text-gray-300 mt-4 mb-2"
      {...props}
    />
  ),
  p: (props: Record<string, unknown>) => {
    // Check if this paragraph contains tags in the format "**Tags:** #tag1 #tag2"
    const children = props.children;

    // Handle case where children is an array with strong element and text
    if (Array.isArray(children) && children.length >= 2) {
      const firstChild = children[0];
      const secondChild = children[1];

      // Check if first child is a strong element with "Tags:" and second is hashtag text
      if (
        firstChild &&
        typeof firstChild === "object" &&
        "props" in firstChild &&
        firstChild.props &&
        firstChild.props.children === "Tags:" &&
        typeof secondChild === "string" &&
        secondChild.includes("#")
      ) {
        // Reconstruct the full text for InlineTags component
        const fullText = `**Tags:**${secondChild}`;
        return <InlineTags>{fullText}</InlineTags>;
      }
    }

    // Handle case where children is a single string (fallback)
    if (typeof children === "string" && children.includes("**Tags:**")) {
      return <InlineTags>{children}</InlineTags>;
    }

    // Check if the children contain any paragraph elements to avoid nesting
    const hasNestedParagraphs = React.Children.toArray(children as React.ReactNode).some(
      (child) => {
        if (typeof child === "object" && child !== null && "type" in child) {
          return (
            child.type === "p" ||
            (typeof child.type === "string" && child.type.toLowerCase() === "p")
          );
        }
        return false;
      }
    );

    // Check if any of the children have className that suggests they're already styled paragraphs
    const hasStyledParagraphs = React.Children.toArray(children as React.ReactNode).some(
      (child) => {
        if (typeof child === "object" && child !== null && "props" in child && child.props) {
          const className = (child.props as { className?: string }).className;
          return (
            typeof className === "string" &&
            (className.includes("hero-description") ||
              className.includes("leading-relaxed") ||
              className.includes("text-lg"))
          );
        }
        return false;
      }
    );

    // If we have nested paragraphs or styled paragraphs, render a div instead
    if (hasNestedParagraphs || hasStyledParagraphs) {
      return <div className="leading-relaxed text-lg mb-6 [&:not(:first-child)]:mt-6" {...props} />;
    }

    return <p className="leading-relaxed text-lg mb-6 [&:not(:first-child)]:mt-6" {...props} />;
  },
  ol: (props: Record<string, unknown>) => (
    <ol className="my-8 ml-8 list-decimal space-y-3 [&>li]:text-lg" {...props} />
  ),
  ul: (props: Record<string, unknown>) => (
    <ul className="my-8 ml-8 list-none space-y-3 " {...props} />
  ),
  li: (props: Record<string, unknown>) => (
    <li
      className='relative pl-8 text-lg before:content-["▶"] before:absolute before:left-0 before:text-[var(--accent)] before:font-bold'
      {...props}
    />
  ),
  em: (props: Record<string, unknown>) => (
    <em className="italic text-[var(--accent)] font-medium" {...props} />
  ),
  strong: (props: Record<string, unknown>) => {
    // Check if this strong element contains tags
    const children = props.children as string;
    if (typeof children === "string" && children.startsWith("Tags:")) {
      // Find the next text node that contains hashtags
      return (
        <strong
          className="font-bold text-[var(--blue-accent)] bg-[var(--accent)] bg-opacity-20 px-1 py-0.5 rounded-md"
          {...props}
        />
      );
    }
    return (
      <strong
        className="font-bold text-[var(--blue-accent)] bg-[var(--accent)] bg-opacity-20 px-1 py-0.5 rounded-md"
        {...props}
      />
    );
  },
  a: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    props: Record<string, unknown>;
  }) => {
    const className =
      "font-bold text-[var(--accent)] underline decoration-2 underline-offset-4 hover:text-[var(--blue-accent)] hover:bg-[var(--accent)] hover:bg-opacity-20 transition-all duration-200 px-1 py-0.5 rounded-md brutalist-link";
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
        {children} ↗
      </a>
    );
  },

  table: (props: Record<string, unknown>) => (
    <div className="my-12 w-full md:overflow-x-auto">
      <table className="w-full max-md:block brutalist-border bg-[var(--card)]" {...props} />
    </div>
  ),

  thead: (props: Record<string, unknown>) => (
    <thead
      className="max-md:hidden md:table-header-group bg-[var(--accent)] text-[var(--blue-accent)]"
      {...props}
    />
  ),

  tbody: (props: Record<string, unknown>) => (
    <tbody className="max-md:block md:table-row-group" {...props} />
  ),

  tr: (props: Record<string, unknown>) => (
    <tr
      className="max-md:block max-md:mb-4 max-md:border-2 max-md:border-[var(--border)] md:table-row md:border-b-2 md:border-[var(--border)] even:bg-[var(--muted)] hover:bg-[var(--accent)] hover:bg-opacity-10 hover:text-[var(--blue-accent)] transition-colors duration-200"
      {...props}
    />
  ),

  th: (props: Record<string, unknown>) => (
    <th
      className="border-r-2 border-[var(--blue-accent)] px-6 py-4 text-left font-black uppercase tracking-wide text-[var(--blue-accent)] [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),

  td: (props: Record<string, unknown>) => (
    <td
      className="max-md:block max-md:p-4 max-md:text-right max-md:border-b max-md:border-[var(--border)] 
                   md:table-cell md:border-r-2 md:px-6 md:py-4 md:text-left
                   max-md:before:content-[attr(data-label)] max-md:before:float-left max-md:before:font-bold max-md:before:uppercase
                   [&&[align=center]]:text-center [&&[align=right]]:text-right"
      {...props}
    />
  ),

  blockquote: (props: Record<string, unknown>) => (
    <blockquote
      className="my-12 border-l-8 border-[var(--accent)] bg-[var(--muted)] pl-8 pr-6 py-6 italic text-xl  font-medium brutalist-border-accent"
      {...props}
    />
  ),

  // Custom code block styling
  pre: (props: Record<string, unknown>) => (
    <pre
      className="my-8 rounded-md bg-black border-2 border-[var(--accent)] p-4 md:p-6 text-sm font-mono whitespace-pre-wrap break-words"
      {...props}
    />
  ),

  code: (props: Record<string, unknown>) => (
    <code
      className="rounded-md px-2 py-1 font-mono text-sm text-[var(--accent)] font-bold"
      {...props}
    />
  ),

  // Custom horizontal rule
  hr: (props: Record<string, unknown>) => (
    <hr
      className="my-16 border-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
      {...props}
    />
  ),

  // Custom image wrapper
  img: (props: Record<string, unknown>) => {
    const { src, alt, ...restProps } = props;
    return (
      <Image
        src={src as string}
        alt={(alt as string) || ""}
        width={800}
        height={600}
        className="my-8 w-full h-auto brutalist-border"
        {...restProps}
      />
    );
  },

  // Related Articles components
  RelatedArticles,
  RelatedArticlesMDX,
};

const defaultComponents = getNextraComponents({
  wrapper({ children, toc, metadata }) {
    // Cast metadata to our extended type
    const blogMetadata = metadata as BlogNextraMetadata;
    console.log("wrapper props:", { children, toc, metadata: blogMetadata });
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--background)]">
        <div className="flex-1 px-6 md:px-12 py-1 max-w-4xl mx-auto lg:mx-0">
          <div className="hero-container">
            <img
              src={blogMetadata.image}
              alt={blogMetadata.title}
              className="hero-image brutalist-border"
            />
            <div className="hero-overlay" />
            <div className="hero-content">
              <h1 className="scroll-m-20 display-title text-white mb-8 mt-12 first:mt-0 text-shadow-brutal">
                {blogMetadata.title}
              </h1>

              <h5 className="scroll-m-20 text-lg font-semibold tracking-tight text-white mt-6 mb-2">
                {blogMetadata.description}
              </h5>
            </div>
          </div>
          {children}
          {blogMetadata.tags && <TagList tags={blogMetadata.tags} />}
          {blogMetadata.tags && (
            <RelatedArticlesMDX
              tags={blogMetadata.tags.join(",")}
              slug={blogMetadata.slug}
              maxArticles={4}
            />
          )}
        </div>

        <TOC toc={toc} />
      </div>
    );
  },
});

// Merge components
export function useMDXComponents(componentsFromProps: Record<string, unknown>) {
  return {
    ...defaultComponents,
    // ...themeComponents,
    ...components,
    ...componentsFromProps,
  };
}
