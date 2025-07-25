import { getAllBlogPosts } from '../../lib/blog-utils'
import { RelatedArticlesClient } from './related-articles'

interface RelatedArticlesProps {
  currentSlug: string
  currentTags: string[]
  maxArticles?: number
}

export async function RelatedArticles({ 
  currentSlug, 
  currentTags, 
  maxArticles = 6 
}: RelatedArticlesProps) {
  try {
    const allPosts = await getAllBlogPosts()
    
    // Filter out current post and calculate similarity scores
    const postsWithScores = allPosts
      .filter(post => post.slug !== currentSlug)
      .map(post => {
        // Calculate shared tags
        const sharedTags = post.tags.filter(tag => 
          currentTags.some(currentTag => 
            currentTag.toLowerCase() === tag.toLowerCase()
          )
        )
        
        return {
          ...post,
          similarityScore: sharedTags.length,
          sharedTags
        }
      })
      .filter(post => post.similarityScore > 0) // Only posts with shared tags
      .sort((a, b) => b.similarityScore - a.similarityScore) // Sort by similarity
      .slice(0, maxArticles)

    return <RelatedArticlesClient relatedPosts={postsWithScores} />
  } catch (error) {
    console.error('Failed to fetch related posts:', error)
    return null
  }
}

// Utility component for easy integration in MDX files
interface RelatedArticlesMDXProps {
  tags: string
  slug?: string
  maxArticles?: number
}

export async function RelatedArticlesMDX({ 
  tags, 
  slug = '', 
  maxArticles = 6 
}: RelatedArticlesMDXProps) {
  const tagArray = tags.split(',').map(tag => tag.trim())
  
  return (
    <RelatedArticles 
      currentSlug={slug}
      currentTags={tagArray}
      maxArticles={maxArticles}
    />
  )
} 