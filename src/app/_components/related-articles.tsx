'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { type BlogMetadata } from '../../lib/blog-utils'

interface RelatedArticlesClientProps {
  relatedPosts: (BlogMetadata & { sharedTags: string[] })[]
}

export function RelatedArticlesClient({ relatedPosts }: RelatedArticlesClientProps) {
  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="my-16 pt-12 border-t-4 border-[var(--accent)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title text-[var(--accent)] mb-8 uppercase tracking-wide">
          Related Articles
        </h2>
        
        <div className="relative overflow-hidden">
          <motion.div 
            className="flex gap-6 pb-4 related-articles-scroll"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              scrollSnapType: 'x mandatory',
              overflowX: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--accent) transparent'
            }}
          >
            {relatedPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                className="flex-shrink-0 w-80 bg-[var(--card)] brutalist-border group hover:shadow-[8px_8px_0px_var(--accent)] transition-all duration-300"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  transition: { duration: 0.2 }
                }}
                style={{ scrollSnapAlign: 'start' }}
              >
                <Link href={post.slug} className="block p-6 h-full">
                  <div className="flex flex-col h-full">
                    {post.image && (
                      <motion.div
                        className="mb-4 overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image 
                          src={post.image} 
                          alt={post.title}
                          width={320}
                          height={128}
                          className="w-full h-32 object-cover brutalist-border"
                        />
                      </motion.div>
                    )}
                    
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--accent)] transition-colors uppercase tracking-wide line-clamp-2">
                        {post.title}
                      </h3>
                      
                      {post.description && (
                        <p className="text-gray-300 text-sm mb-4 flex-1 line-clamp-3">
                          {post.description}
                        </p>
                      )}
                      
                      <div className="mt-auto">
                        {post.sharedTags && post.sharedTags.length > 0 && (
                          <div className="mb-3">
                            <div className="text-xs text-[var(--accent)] font-bold uppercase tracking-wider mb-1">
                              Shared Tags:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {post.sharedTags.slice(0, 3).map((tag) => (
                                <span 
                                  key={tag}
                                  className="text-xs bg-[var(--accent)] bg-opacity-20 text-[var(--blue-accent)] px-2 py-1 font-bold uppercase"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {post.sharedTags.length > 3 && (
                                <span className="text-xs text-gray-400 px-2 py-1">
                                  +{post.sharedTags.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <motion.div 
                          className="text-[var(--accent)] text-sm font-bold uppercase tracking-wide group-hover:translate-x-2 transition-transform duration-200"
                          whileHover={{ x: 4 }}
                        >
                          Read More →
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--border)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.div 
              className="h-full bg-[var(--accent)]"
              initial={{ width: "0%" }}
              animate={{ width: "30%" }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
          </motion.div>
        </div>

        {relatedPosts.length >= 6 && (
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Link 
              href="/tags"
              className="inline-block px-6 py-3 bg-[var(--accent)] text-[var(--blue-accent)] font-bold uppercase tracking-wider hover:bg-white transition-colors brutalist-border hover:shadow-[4px_4px_0px_var(--accent)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              View All Tags
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
} 