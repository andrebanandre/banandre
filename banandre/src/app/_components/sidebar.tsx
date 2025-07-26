'use client'
 
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { PageMapItem } from 'nextra'
import { Anchor } from 'nextra/components'
import { normalizePages } from 'nextra/normalize-pages'
import { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon, FileIcon, ReaderIcon } from '@radix-ui/react-icons'
import { motion, easeInOut, easeOut } from 'framer-motion'

// Meta configuration to control sidebar visibility
const META_CONFIG = {
  demo: "Demo",
  docs: { title: "Documentation", hidden: true },
  tags: { title: "Tags", hidden: true }
}

// Function to filter pages based on _meta.json configuration
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterPagesByMeta(pages: any[]): any[] {
  return pages.filter(page => {
    const pageName = page.name || page.route?.split('/').pop() || ''
    
    // Check if page is hidden in meta config
    if (META_CONFIG[pageName as keyof typeof META_CONFIG]) {
      const metaItem = META_CONFIG[pageName as keyof typeof META_CONFIG]
      if (typeof metaItem === 'object' && metaItem.hidden) {
        return false
      }
    }
    
    // Recursively filter children
    if (page.children) {
      page.children = filterPagesByMeta(page.children)
    }
    
    return true
  })
}
 
export function Sidebar({ pageMap }: { pageMap: PageMapItem[] }) {
  const pathname = usePathname()
  const { docsDirectories } = normalizePages({
    list: pageMap,
    route: pathname
  })

  // Filter the pages based on _meta.json configuration
  const filteredDirectories = filterPagesByMeta(docsDirectories)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
        staggerChildren: 0.1
      }
    }
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut
      }
    }
  }

  const titleVariants = {
    hover: {
      scale: 1.02,
      color: "var(--accent)",
      transition: {
        duration: 0.3,
        ease: easeInOut
      }
    }
  }

  return (
    <motion.aside
      className="w-80 bg-[var(--card)] border-r-4 border-[var(--accent)] p-6 overflow-y-auto hidden lg:block"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="mb-8"
        variants={headerVariants}
      >
        <motion.h2 
          className="text-[var(--accent)] font-black text-xl uppercase tracking-wide mb-6 text-shadow-subtle"
          variants={titleVariants}
          whileHover="hover"
        >
          Navigation
        </motion.h2>
        <motion.div 
          className="h-1 bg-[var(--accent)] w-16"
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ delay: 0.3, duration: 0.6, ease: easeOut }}
        />
      </motion.div>

      <nav>
        <motion.ul
          className="space-y-3"
          variants={containerVariants}
        >
          {filteredDirectories.map((item, index) => (
            <SidebarItem key={item.route || index} item={item} index={index} pathname={pathname} />
          ))}
        </motion.ul>
      </nav>
    </motion.aside>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SidebarItem({ item, index, pathname }: { item: any, index: number, pathname: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const route = item.route || ('href' in item ? (item.href as string) : '')
  const { title } = item
  const hasChildren = 'children' in item && item.children?.length > 0
  const isActive = pathname === route

  const toggleExpanded = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + index * 0.1,
        duration: 0.5,
        ease: easeOut
      }
    }
  }

  const linkVariants = {
    hover: {
      x: 5,
      transition: {
        duration: 0.2,
        ease: easeInOut
      }
    }
  }

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: easeInOut
      }
    }
  }

  const chevronVariants = {
    expanded: { rotate: 90 },
    collapsed: { rotate: 0 }
  }

  const childrenVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: easeOut,
        staggerChildren: 0.05
      }
    }
  }

  return (
    <motion.li
      variants={itemVariants}
    >
      <motion.div
        className={`
          text-sm font-medium flex items-center group transition-all duration-200 py-2 px-3 rounded-md cursor-pointer
          ${isActive 
            ? 'bg-[var(--accent)] bg-opacity-20 border-l-4 border-[var(--accent)] text-[var(--blue-accent)] font-bold' 
            : 'hover:bg-[var(--accent)] hover:bg-opacity-10 hover:text-[var(--blue-accent)]'
          }
          ${!isActive 
            ? 'text-white' 
            : ''
          }
        `}
        onClick={toggleExpanded}
        variants={linkVariants}
        whileHover="hover"
      >
        {hasChildren ? (
          <>
            <motion.div
              variants={iconVariants}
              whileHover="hover"
            >
              <ReaderIcon
                className={`
                  w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200
                  ${isActive ? 'text-[var(--blue-accent)]' : 'text-[var(--accent)]'}
                `}
              />
            </motion.div>
            <span className="flex-1 font-medium uppercase tracking-wide text-sm">{title}</span>
            <motion.div
              initial={false}
              animate={isExpanded ? "expanded" : "collapsed"}
              variants={chevronVariants}
              transition={{ duration: 0.3, ease: easeInOut }}
            >
              {isExpanded ? (
                <ChevronDownIcon
                  className={`
                    w-4 h-4
                    ${isActive ? 'text-[var(--blue-accent)]' : 'text-[var(--accent)]'}
                  `}
                />
              ) : (
                <ChevronRightIcon
                  className={`
                    w-4 h-4
                    ${isActive ? 'text-[var(--blue-accent)]' : 'text-[var(--accent)]'}
                  `}
                />
              )}
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              variants={iconVariants}
              whileHover="hover"
            >
              <FileIcon
                className={`
                  w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200
                  ${isActive ? 'text-[var(--blue-accent)]' : 'text-[var(--accent)]'}
                `}
              />
            </motion.div>
            <Anchor 
              href={route} 
              className="flex-1 font-medium uppercase tracking-wide text-sm text-decoration-none"
            >
              {title}
            </Anchor>
          </>
        )}
      </motion.div>

      {hasChildren && (
        <motion.ul
          className="ml-4 mt-2 space-y-3"
          initial="hidden"
          animate={isExpanded ? "visible" : "hidden"}
          variants={childrenVariants}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {item.children.map((child: any, childIndex: number) => (
            <motion.div
              key={child.route || childIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + childIndex * 0.05, duration: 0.3 }}
            >
              <SidebarItem 
                item={child} 
                index={childIndex} 
                pathname={pathname} 
              />
            </motion.div>
          ))}
        </motion.ul>
      )}
    </motion.li>
  )
}