'use client'

import Link from 'next/link'

// Format tag for URL (lowercase, no special chars)
function formatTagForUrl(tag: string): string {
  return tag.toLowerCase().replace(/[^a-z0-9]/g, '')
}

interface TagProps {
  tag: string
  className?: string
  showHash?: boolean
}

export function Tag({ tag, className = '', showHash = true }: TagProps) {
  const formattedTag = formatTagForUrl(tag)
  
  return (
    <Link
      href={`/tags/${formattedTag}`}
      className={`
        inline-block
        px-3 py-1
        bg-[var(--accent)]
        text-[var(--blue-accent)]
        font-bold
        text-sm
        uppercase
        tracking-wider
        hover:bg-white
        hover:text-[var(--blue-accent)]
        transition-all
        duration-200
        brutalist-border
        hover:shadow-[2px_2px_0px_var(--accent)]
        hover:translate-x-[-2px]
        hover:translate-y-[-2px]
        ${className}
      `}
    >
      {showHash && '#'}{tag}
    </Link>
  )
}

interface TagListProps {
  tags: string[]
  className?: string
}

export function TagList({ tags, className = '' }: TagListProps) {
  if (!tags || tags.length === 0) return null
  
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {tags.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </div>
  )
}

// Component to replace the "**Tags:** #tag1 #tag2" text with clickable tags
interface InlineTagsProps {
  children: string
}

export function InlineTags({ children }: InlineTagsProps) {
  // Check if this is a tags line
  const tagMatch = children.match(/\*\*Tags:\*\*\s*((?:#\w+\s*)+)/)
  
  if (!tagMatch) {
    return <span>{children}</span>
  }
  
  // Extract hashtags
  const hashtagMatches = tagMatch[1].match(/#(\w+)/g) || []
  const tags = hashtagMatches.map(hashtag => hashtag.replace('#', ''))
  
  return (
    <div className="mt-8 pt-6 border-t-2 border-[var(--accent)]">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-[var(--accent)] font-bold uppercase tracking-wider text-sm">
          Tags:
        </span>
        <TagList tags={tags} />
      </div>
    </div>
  )
} 