'use client'
 
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { PageMapItem } from 'nextra'
import { Anchor } from 'nextra/components'
import { normalizePages } from 'nextra/normalize-pages'
import { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon, FileIcon, ReaderIcon } from '@radix-ui/react-icons'
 
export function Sidebar({ pageMap }: { pageMap: PageMapItem[] }) {
  const pathname = usePathname()
  const { docsDirectories } = normalizePages({
    list: pageMap,
    route: pathname
  })

  return (
    <aside
      className="w-80 bg-[var(--card)] border-r-4 border-[var(--accent)] p-6 overflow-y-auto hidden lg:block"
    >
      <div
        className="mb-8"
      >
        <h2 className="text-[var(--accent)] font-black text-xl uppercase tracking-wide mb-2 text-shadow-subtle">
          Navigation
        </h2>
                  <div className="h-1 bg-[var(--accent)] w-16"></div>
      </div>

      <nav>
        <ul
          className="space-y-2"
        >
          <li>
            <Link
              href="/tags"
              className={`
                flex items-center py-3 px-4 rounded-none border-l-4 transition-all duration-200 cursor-pointer
                ${pathname === '/tags' 
                  ? 'bg-[var(--accent)] bg-opacity-20 border-[var(--accent)] text-[var(--accent)]'
                  : 'border-transparent text-gray-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:bg-opacity-10 hover:text-[var(--accent)]'
                }
              `}
            >
              <ReaderIcon className="w-4 h-4 mr-3 text-[var(--accent)]" />
              <span className="flex-1 font-medium uppercase tracking-wide text-sm">Tags</span>
            </Link>
          </li>
          {docsDirectories.map((item, index) => (
            <SidebarItem key={item.route || index} item={item} index={index} pathname={pathname} />
          ))}
        </ul>
      </nav>
    </aside>
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

  return (
    <li>
      <div
        className={`
          flex items-center py-3 px-4 rounded-none border-l-4 transition-all duration-200 cursor-pointer
          ${isActive 
                    ? 'bg-[var(--accent)] bg-opacity-20 border-[var(--accent)] text-[var(--accent)]'
        : 'border-transparent text-gray-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:bg-opacity-10 hover:text-[var(--accent)]'
          }
        `}
        onClick={toggleExpanded}
      >
        {hasChildren ? (
          <>
            <ReaderIcon className="w-4 h-4 mr-3 text-[var(--accent)]" />
            <span className="flex-1 font-medium uppercase tracking-wide text-sm">{title}</span>
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-[var(--accent)]" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-[var(--accent)]" />
            )}
          </>
        ) : (
          <>
            <FileIcon className="w-4 h-4 mr-3 text-[var(--accent)]" />
            <Anchor 
              href={route} 
              className="flex-1 font-medium uppercase tracking-wide text-sm text-decoration-none hover:text-[var(--accent)]"
            >
              {title}
            </Anchor>
          </>
        )}
      </div>

      {hasChildren && isExpanded && (
        <ul
          className="ml-6 mt-2 space-y-1 border-l-2 border-gray-600 pl-4"
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {item.children.map((child: any, childIndex: number) => (
            <SidebarItem 
              key={child.route || childIndex} 
              item={child} 
              index={childIndex} 
              pathname={pathname} 
            />
          ))}
        </ul>
      )}
    </li>
  )
}