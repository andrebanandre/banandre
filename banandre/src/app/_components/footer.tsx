'use client'

import { GitHubLogoIcon, TwitterLogoIcon, LinkedInLogoIcon, RocketIcon } from '@radix-ui/react-icons'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="bg-[var(--background)] border-t-4 border-[var(--accent)] mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand Section */}
          <div
            className="space-y-6"
          >
            <div>
              <div className="text-white font-black text-3xl uppercase tracking-wider text-shadow-brutal mb-2">
                BANANDRE
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-widest font-mono">
                AI • INSIGHTS • FUTURE
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Exploring the intersection of artificial intelligence and human creativity. 
              Bold insights for a bold future.
            </p>
          </div>

          {/* Quick Links */}
          <div
            className="space-y-6"
          >
            <h3 className="text-white font-bold text-lg uppercase tracking-wide">
              Navigate
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Blog', href: '/docs' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' }
              ].map((link, index) => (
                <li
                  key={link.name}
                >
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[var(--accent)] transition-colors duration-200 text-sm font-medium uppercase tracking-wide flex items-center group"
                  >
                                          <span className="text-[var(--accent)] mr-2 group-hover:translate-x-1 transition-transform duration-200">▶</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div
            className="space-y-6"
          >
            <h3 className="text-white font-bold text-lg uppercase tracking-wide">
              Connect
            </h3>
            <div className="flex space-x-4">
              {[
                { icon: GitHubLogoIcon, href: '#', label: 'GitHub' },
                { icon: TwitterLogoIcon, href: '#', label: 'Twitter' },
                { icon: LinkedInLogoIcon, href: '#', label: 'LinkedIn' },
                { icon: RocketIcon, href: '#', label: 'Newsletter' }
              ].map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-3 bg-[var(--muted)] hover:bg-[var(--accent)] text-gray-400 hover:text-[var(--accent-foreground)] transition-colors duration-200 brutalist-border group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            
            {/* Newsletter Signup */}
            <div
              className="mt-8"
            >
              <h4 className="text-[var(--accent)] font-bold text-sm uppercase tracking-wide mb-3">
                Stay Updated
              </h4>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 bg-[var(--muted)] border-2 border-gray-600 text-white text-sm focus:border-[var(--accent)] focus:outline-none transition-colors duration-200"
                />
                <button
                  className="px-4 py-2 bg-[var(--accent)] text-[var(--accent-foreground)] font-bold text-sm uppercase hover:bg-[var(--accent-hover)] transition-colors duration-200"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-16 pt-8 border-t-2 border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div className="text-gray-400 text-sm font-mono">
            © {currentYear} BANANDRE. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-[var(--accent)] transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-[var(--accent)] transition-colors duration-200">
              Terms of Service
            </a>
            <div className="text-gray-500 font-mono text-xs">
              Built with ⚡ & 🍌
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}