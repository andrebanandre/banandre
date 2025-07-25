'use client'

import { useState } from 'react'
import { ListBulletIcon, Cross1Icon } from '@radix-ui/react-icons'
import type { Heading } from 'nextra'

export function TOC({ toc }: { toc: Heading[] }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!toc || toc.length === 0) return null

  const toggleTOC = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile TOC Toggle Button */}
      <button
        onClick={toggleTOC}
        className="fixed bottom-6 right-6 z-50 lg:hidden bg-[var(--accent)] text-[var(--accent-foreground)] p-4 brutalist-border font-bold hover:bg-[var(--accent-hover)] transition-colors duration-200"
        aria-label="Toggle table of contents"
      >
        {isOpen ? (
          <Cross1Icon className="w-6 h-6" />
        ) : (
          <ListBulletIcon className="w-6 h-6" />
        )}
      </button>

      {/* Mobile TOC Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-75" onClick={toggleTOC} />
        <div
          className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-[var(--background)] border-l-4 border-[var(--accent)] p-6 overflow-y-auto"
        >
          <TOCContent toc={toc} onItemClick={() => setIsOpen(false)} />
        </div>
      </div>

      {/* Desktop TOC */}
      <aside
        className="hidden lg:block w-80 flex-shrink-0 p-8 bg-[var(--card)] border-l-4 border-[var(--accent)] overflow-y-auto max-h-screen"
      >
        <TOCContent toc={toc} />
      </aside>
    </>
  )
}

function TOCContent({ toc, onItemClick }: { toc: Heading[], onItemClick?: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[var(--accent)] font-black text-xl uppercase tracking-wide mb-6 text-shadow-subtle">
          Table of Contents
        </h3>
      </div>

      <nav>
        <ul className="space-y-2">
          {toc.map((item: Heading, index: number) => (
            <li
              key={item.id}
            >
              <a
                href={`#${item.id}`}
                onClick={onItemClick}
                className={`
                  block py-2 px-4 text-sm font-medium transition-all duration-200 border-l-4 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:bg-opacity-10 hover:text-[var(--accent)]
                  ${item.depth === 2 ? 'text-white border-gray-600 font-bold' : 
                    item.depth === 3 ? 'text-gray-300 border-gray-700 ml-4' : 
                    'text-gray-400 border-gray-800 ml-8'}
                `}
              >
                <span className="flex items-center">
                  <span className="text-[var(--accent)] mr-2 font-bold">
                    {item.depth === 2 ? '▶' : item.depth === 3 ? '▷' : '▸'}
                  </span>
                  {item.value}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}