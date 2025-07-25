'use client'

import { GitHubLogoIcon, TwitterLogoIcon, LinkedInLogoIcon, RocketIcon } from '@radix-ui/react-icons'
import { motion, easeInOut, easeOut } from 'framer-motion'

export function Footer() {
  const currentYear = new Date().getFullYear()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut
      }
    }
  }

  const socialIconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: easeInOut
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

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: easeInOut
      }
    }
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: easeInOut
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  }

  return (
    <motion.footer
      className="bg-[var(--background)] border-t-4 border-[var(--accent)] mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand Section */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <div>
              <motion.div 
                className="text-white font-black text-3xl uppercase tracking-wider text-shadow-brutal mb-2"
                whileHover={{ 
                  scale: 1.02,
                  textShadow: "0 0 20px var(--accent)"
                }}
                transition={{ duration: 0.3 }}
              >
                BANANDRE
              </motion.div>
              <motion.div 
                className="text-xs text-gray-400 uppercase tracking-widest font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                AI • INSIGHTS • FUTURE
              </motion.div>
            </div>
            <motion.p 
              className="text-gray-300 text-sm leading-relaxed max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Exploring the intersection of artificial intelligence and human creativity. 
              Bold insights for a bold future.
            </motion.p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <motion.h3 
              className="text-white font-bold text-lg uppercase tracking-wide"
              whileHover={{ color: "var(--accent)" }}
              transition={{ duration: 0.3 }}
            >
              Navigate
            </motion.h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Blog', href: '/docs' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' }
              ].map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                >
                  <motion.a
                    href={link.href}
                    className="text-gray-400 hover:text-[var(--accent)] transition-colors duration-200 text-sm font-medium uppercase tracking-wide flex items-center group"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    <motion.span 
                      className="text-[var(--accent)] mr-2 group-hover:translate-x-1 transition-transform duration-200"
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.3 }}
                    >
                      ▶
                    </motion.span>
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Connect Section */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <motion.h3 
              className="text-white font-bold text-lg uppercase tracking-wide"
              whileHover={{ color: "var(--accent)" }}
              transition={{ duration: 0.3 }}
            >
              Connect
            </motion.h3>
            <div className="flex space-x-4">
              {[
                { icon: GitHubLogoIcon, href: '#', label: 'GitHub' },
                { icon: TwitterLogoIcon, href: '#', label: 'Twitter' },
                { icon: LinkedInLogoIcon, href: '#', label: 'LinkedIn' },
                { icon: RocketIcon, href: '#', label: 'Newsletter' }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="p-3 bg-[var(--muted)] hover:bg-[var(--accent)] text-gray-400 hover:text-[var(--accent-foreground)] transition-colors duration-200 brutalist-border group"
                  aria-label={social.label}
                  variants={socialIconVariants}
                  whileHover="hover"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            
            {/* Newsletter Signup */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <motion.h4 
                className="text-[var(--accent)] font-bold text-sm uppercase tracking-wide mb-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                Stay Updated
              </motion.h4>
              <div className="flex space-x-2">
                <motion.input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 bg-[var(--muted)] border-2 border-gray-600 text-white text-sm focus:border-[var(--accent)] focus:outline-none transition-colors duration-200"
                  variants={inputVariants}
                  whileFocus="focus"
                />
                <motion.button
                  className="px-4 py-2 bg-[var(--accent)] text-[var(--accent-foreground)] font-bold text-sm uppercase hover:bg-[var(--accent-hover)] transition-colors duration-200"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Join
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-16 pt-8 border-t-2 border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <motion.div 
            className="text-gray-400 text-sm font-mono"
            whileHover={{ color: "var(--accent)" }}
            transition={{ duration: 0.3 }}
          >
            © {currentYear} BANANDRE. All rights reserved.
          </motion.div>
          <div className="flex items-center space-x-6 text-sm">
            <motion.a 
              href="/privacy" 
              className="text-gray-400 hover:text-[var(--accent)] transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a 
              href="/terms" 
              className="text-gray-400 hover:text-[var(--accent)] transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Terms of Service
            </motion.a>
            <motion.div 
              className="text-gray-500 font-mono text-xs"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Built with ⚡ & 🍌
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}