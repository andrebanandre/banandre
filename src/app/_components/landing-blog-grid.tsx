import { Suspense } from 'react'
import { getAllBlogPosts } from '../../lib/blog-utils'
import { ClientBlogGrid } from './client-blog-grid'

export async function LandingBlogGrid() {
  try {
    const allPosts = await getAllBlogPosts()
    
    // Sort posts by date (newest first) - if no date, treat as oldest
    const sortedPosts = allPosts.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
    
    if (sortedPosts.length === 0) {
      return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center py-16">
          <h2 className="text-2xl font-bold text-[var(--accent)] mb-4 uppercase tracking-wide">
            No Articles Found
          </h2>
          <p className="text-gray-300 text-lg">
            Start writing to see them here!
          </p>
        </div>
      )
    }

    // Pass all posts to client component for client-side pagination
    return (
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      }>
        <ClientBlogGrid posts={sortedPosts} />
      </Suspense>
    )
    
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center py-16">
        <h2 className="text-2xl font-bold text-[var(--accent)] mb-4 uppercase tracking-wide">
          Error Loading Articles
        </h2>
        <p className="text-gray-300 text-lg">
          Unable to load articles at the moment.
        </p>
      </div>
    )
  }
}