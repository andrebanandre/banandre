'use client'

import { Anchor } from 'nextra/components'
import { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon, FileIcon, ReaderIcon } from '@radix-ui/react-icons'
import { motion, easeInOut, easeOut } from 'framer-motion'

// Meta configuration to control sidebar visibility
const META_CONFIG = {
  demo: "Demo",
  docs: { title: "Documentation", hidden: true },
  tags: { title: "Tags", hidden: true }
}

interface PageItem {
  name?: string
  route?: string
  title?: string
  href?: string
  children?: PageItem[]
  [key: string]: unknown
}

// Function to filter pages based on _meta.json configuration
export function filterPagesByMeta(pages: PageItem[]): PageItem[] {
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

interface SidebarItemProps {
  item: PageItem
  index: number
  pathname: string
  isMobile?: boolean
  onItemClick?: () => void
  level?: number
}

export function SidebarItem({ 
  item, 
  index, 
  pathname, 
  isMobile = false, 
  onItemClick,
  level = 0 
}: SidebarItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const route = item.route || ('href' in item ? (item.href as string) : '')
  const { title } = item
  const hasChildren = 'children' in item && item.children && item.children.length > 0
  const isActive = pathname === route

  const toggleExpanded = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick()
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
      x: isMobile ? 3 : 5,
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

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: easeOut
      }
    }
  }

  if (isMobile) {
    return (
      <motion.div
        variants={mobileItemVariants}
        whileHover={{ x: 3 }}
        transition={{ duration: 0.2, ease: easeInOut }}
      >
        <div
          className={`
            text-sm font-semibold flex items-center group transition-all duration-200 py-3 px-4 rounded-md cursor-pointer
            ${isActive 
              ? 'bg-[var(--accent)] text-[var(--accent-foreground)] brutalist-border' 
              : 'text-white hover:text-[var(--accent)] hover:bg-[var(--accent)] hover:bg-opacity-10'
            }
          `}
          onClick={hasChildren ? toggleExpanded : handleItemClick}
        >
          {hasChildren ? (
            <>
              <ReaderIcon
                className={`
                  w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform duration-200
                  ${isActive ? 'text-[var(--accent-foreground)]' : 'text-[var(--accent)]'}
                `}
              />
              <span className="flex-1 font-semibold uppercase tracking-wide text-sm">{title}</span>
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
                      ${isActive ? 'text-[var(--accent-foreground)]' : 'text-[var(--accent)]'}
                    `}
                  />
                ) : (
                  <ChevronRightIcon
                    className={`
                      w-4 h-4
                      ${isActive ? 'text-[var(--accent-foreground)]' : 'text-[var(--accent)]'}
                    `}
                  />
                )}
              </motion.div>
            </>
          ) : (
            <>
              <FileIcon
                className={`
                  w-4 h-4 mr-3 group-hover:translate-x-1 transition-transform duration-200
                  ${isActive ? 'text-[var(--accent-foreground)]' : 'text-[var(--accent)]'}
                `}
              />
              <Anchor 
                href={route} 
                className="flex-1 font-semibold uppercase tracking-wide text-sm text-decoration-none"
                onClick={handleItemClick}
              >
                {title}
              </Anchor>
            </>
          )}
        </div>

        {hasChildren && (
          <motion.div
            className="ml-4 mt-2 space-y-2"
            initial="hidden"
            animate={isExpanded ? "visible" : "hidden"}
            variants={childrenVariants}
          >
            {item.children!.map((child: PageItem, childIndex: number) => (
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
                  isMobile={true}
                  onItemClick={onItemClick}
                  level={level + 1}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    )
  }

  // Desktop version
  return (
    <motion.li
      variants={itemVariants}
    >
      <motion.div
        className={`
          text-sm font-semibold flex items-center group transition-all duration-200 py-2 px-3 rounded-md cursor-pointer
          ${isActive 
            ? 'bg-[var(--accent)] bg-opacity-20 border-l-4 border-[var(--accent)] text-[var(--blue-accent)] font-black' 
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
            <span className="flex-1 font-semibold uppercase tracking-wide text-sm">{title}</span>
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
              className="flex-1 font-semibold uppercase tracking-wide text-sm text-decoration-none"
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
          {item.children!.map((child: PageItem, childIndex: number) => (
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
                level={level + 1}
              />
            </motion.div>
          ))}
        </motion.ul>
      )}
    </motion.li>
  )
} 