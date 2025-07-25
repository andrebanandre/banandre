'use client'
 
import { usePathname } from 'next/navigation'
import type { PageMapItem } from 'nextra'
import { Anchor } from 'nextra/components'
import { normalizePages } from 'nextra/normalize-pages'
import type { FC } from 'react'
import { useState } from 'react'
import { HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons'
 
export const Navbar: FC<{ pageMap: PageMapItem[] }> = ({ pageMap }) => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const { topLevelNavbarItems } = normalizePages({
    list: pageMap,
    route: pathname
  })

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
 
  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b-4 border-[var(--accent)] shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              className="flex-shrink-0"
            >
              <Anchor href="/" className="text-decoration-none">
                <div className="text-white font-black text-2xl md:text-3xl uppercase tracking-wider text-shadow-brutal">
                  BANANDRE
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-mono">
                  AI • INSIGHTS • FUTURE
                </div>
              </Anchor>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {topLevelNavbarItems.map((item, index) => {
                  const route = item.route || ('href' in item ? item.href! : '')
                  const isActive = pathname === route
                  
                  return (
                    <div
                      key={route}
                    >
                      <Anchor 
                        href={route} 
                        className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all duration-200 text-decoration-none brutalist-link
                          ${isActive 
                            ? 'bg-[var(--accent)] text-[var(--accent-foreground)] brutalist-border' 
                            : 'text-white hover:text-[var(--accent)] hover:bg-[var(--accent)] hover:bg-opacity-10'
                          }`}
                      >
                        {item.title}
                      </Anchor>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 text-[var(--accent)] hover:bg-[var(--accent)] hover:bg-opacity-10 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <Cross1Icon className="block h-6 w-6" />
                ) : (
                  <HamburgerMenuIcon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed inset-x-0 top-20 z-40 md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
      >
        <div className="bg-[var(--background)] border-b-4 border-[var(--accent)] shadow-lg">
          <div className="px-6 py-6 space-y-4">
            {topLevelNavbarItems.map((item, index) => {
              const route = item.route || ('href' in item ? item.href! : '')
              const isActive = pathname === route
              
              return (
                <div
                  key={route}
                >
                  <Anchor 
                    href={route} 
                    className={`block px-4 py-3 text-base font-bold uppercase tracking-wide transition-all duration-200 text-decoration-none
                      ${isActive 
                        ? 'bg-[var(--accent)] text-[var(--accent-foreground)] brutalist-border' 
                        : 'text-white hover:text-[var(--accent)] hover:bg-[var(--accent)] hover:bg-opacity-10'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </Anchor>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-20"></div>
    </>
  )
}