'use client'

import Link from 'next/link'
import { ArrowRightIcon, LightningBoltIcon, RocketIcon, MagicWandIcon } from '@radix-ui/react-icons'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden py-24 lg:py-32"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            {/* Hero Title */}
            <div>
              <h1 className="display-title text-white text-shadow-brutal mb-8">
                WELCOME TO<br />
                <span className="text-[var(--accent)]">BANANDRE</span>
              </h1>
            </div>

            {/* Hero Subtitle */}
            <p
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Where <strong className="text-[var(--accent)]">Artificial Intelligence</strong> meets 
              <strong className="text-white"> Brutal Design</strong>. 
              Uncompromising insights for the digital future.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/demo">
                <button
                  className="bg-[var(--accent)] text-[var(--accent-foreground)] px-8 py-4 font-black text-lg uppercase tracking-wide brutalist-border hover:bg-[var(--accent-hover)] transition-colors duration-200 flex items-center space-x-3"
                >
                  <span>Explore The Future</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </Link>

              <Link href="/docs">
                <button
                  className="border-2 border-[var(--accent)] text-[var(--accent)] px-8 py-4 font-bold text-lg uppercase tracking-wide hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all duration-200 flex items-center space-x-3"
                >
                  <span>Read The Blog</span>
                  <RocketIcon className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div
          className="absolute top-20 left-10 w-32 h-32 border-4 border-[var(--accent)] opacity-20"
        />
        <div
          className="absolute bottom-20 right-10 w-24 h-24 bg-[var(--accent)] opacity-10"
        />
      </section>

      {/* Features Section */}
      <section
        className="py-24 bg-[var(--card)]"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            className="text-center mb-16"
          >
            <h2 className="section-title text-[var(--accent)] mb-6 uppercase">
              Why BANANDRE?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We don&apos;t just follow trends—we break them. Our approach to AI content 
              is as revolutionary as the technology we cover.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: LightningBoltIcon,
                title: "Uncompromising",
                description: "No soft edges. No gentle curves. Just raw, powerful insights that cut through the noise."
              },
              {
                icon: MagicWandIcon,
                title: "Innovative",
                description: "We explore AI from angles others won't dare. Brutal honesty meets cutting-edge analysis."
              },
              {
                icon: RocketIcon,
                title: "Future-Forward",
                description: "While others catch up, we're already building tomorrow. Join us at the forefront of AI evolution."
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="text-center"
              >
                <div
                  className="inline-flex items-center justify-center w-20 h-20 bg-[var(--accent)] text-[var(--accent-foreground)] brutalist-border mb-6"
                >
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Preview */}
      <section
        className="py-24"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div
            className="text-center mb-16"
          >
            <h2 className="section-title text-[var(--accent)] mb-6 uppercase">
              Latest Insights
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fresh perspectives on AI, delivered with the force of conviction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "The Brutalist Manifesto for AI",
                excerpt: "Why the future of artificial intelligence needs bold design and uncompromising vision.",
                href: "/demo"
              },
              {
                title: "Beyond GPT: What Comes Next",
                excerpt: "Exploring the next frontier of AI development and what it means for humanity.",
                href: "/docs"
              }
            ].map((post) => (
              <div
                key={post.title}
              >
                <Link href={post.href}>
                  <article
                    className="bg-[var(--card)] border-l-4 border-[var(--accent)] p-8 hover:bg-[var(--muted)] transition-colors duration-200 cursor-pointer"
                  >
                    <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-[var(--accent)] font-bold text-sm uppercase tracking-wide">
                      <span>Read More</span>
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
