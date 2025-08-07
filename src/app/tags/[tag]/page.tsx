import { getPostsByTag, getAllTags, parseTagFromUrl } from '../../../lib/blog-utils'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Tag } from '../../_components/tag'
import type { Metadata } from 'next'

interface TagPageProps {
  params: Promise<{
    tag: string
  }>
}

export async function generateStaticParams() {
  const tags = await getAllTags()
  
  return tags.map(({ tag }) => ({
    tag: tag.toLowerCase().replace(/[^a-z0-9]/g, '')
  }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  try {
    const { tag: urlTag } = await params
    const displayTag = parseTagFromUrl(urlTag)
    const posts = await getPostsByTag(displayTag)
    
    const title = `#${displayTag} - Banandre`
    const description = `Articles tagged with ${displayTag}. ${posts.length} article${posts.length !== 1 ? 's' : ''} found.`
    
    return {
      title,
      description,
      keywords: [displayTag, 'coding', 'programming', 'software development', 'technology', 'blog'],
      authors: [{ name: 'Banandre' }],
      creator: 'Banandre',
      publisher: 'Banandre',
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title,
        description,
        type: 'website',
        siteName: 'Banandre',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Tag - Banandre',
      description: 'Articles by tag',
    }
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: urlTag } = await params
  const displayTag = parseTagFromUrl(urlTag)
  
  const posts = await getPostsByTag(displayTag)
  
  if (posts.length === 0) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-[var(--background)] px-6 md:px-12 py-8 lg:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <Link 
            href="/tags" 
            className="text-[var(--accent)] hover:text-white transition-colors mb-4 inline-block"
          >
            ← Back to all tags
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <h1 className="display-title text-white text-shadow-brutal">
              Tagged with
            </h1>
            <Tag tag={displayTag} />
          </div>
          
          <p className="text-gray-200 text-lg">
            {posts.length} article{posts.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="grid gap-8">
          {posts.map((post) => (
            <article 
              key={post.slug}
              className="bg-[var(--card)] brutalist-border p-6 hover:bg-[var(--muted)] transition-colors group"
            >
              <Link href={post.slug} className="block">
                <div className="flex flex-col gap-4">
                  {post.image && (
                    <Image 
                      src={post.image} 
                      alt={post.title}
                      width={800}
                      height={192}
                      className="w-full h-48 object-cover brutalist-border"
                    />
                  )}
                  
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[var(--accent)] transition-colors">
                      {post.title}
                    </h2>
                    
                    {post.description && (
                      <p className="text-gray-300 mb-4">
                        {post.description}
                      </p>
                    )}
                    
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="text-xs bg-[var(--accent)] bg-opacity-20 text-[var(--blue-accent)] px-2 py-1 font-bold uppercase"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
} 