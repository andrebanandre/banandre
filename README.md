# 🍌 Banandre

**No One Cares About Code.**

A brutally honest blog about AI, software architecture, and enterprise solutions. Raw insights without the buzzwords.

🌐 **Live Site:** [https://www.banandre.com](https://www.banandre.com)

---

## 📖 About

Banandre delivers unfiltered insights on the realities of modern software development, AI implementation, and enterprise architecture. The blog covers:

- **Artificial Intelligence** - Real-world AI implementation, pitfalls, and breakthroughs
- **Software Architecture** - Distributed systems, microservices, databases, and architectural decisions
- **Software Development** - Practical development insights and technical debt realities
- **Engineering Management** - Team dynamics, scaling challenges, and leadership
- **Product Management** - Strategy, user feedback, and product-engineering collaboration
- **Data Engineering** - ETL, data pipelines, and infrastructure

---

## 🚀 Tech Stack

This blog is built with modern web technologies:

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Content:** MDX for rich, interactive blog posts
- **Styling:** CSS Modules + Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel
- **Features:**
  - RSS feed generation
  - Sitemap generation
  - SEO optimization with JSON-LD structured data
  - Dynamic blog post routing
  - Categories and tags system
  - Related articles recommendations
  - Google Analytics integration
  - Social media metadata

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/andrebanandre/banandre.git
   cd banandre
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 📝 Contributing

Contributions are welcome! Whether you found a typo, have suggestions for content, or want to improve the codebase, here's how you can help:

### Content Contributions

#### Suggesting Topics
- Open an issue with the `content-suggestion` label
- Describe the topic and why it would be valuable
- Include any relevant resources or research

#### Reporting Issues
- **Typos/Grammar:** Open an issue or submit a PR directly
- **Broken Links:** Report via issues
- **Technical Inaccuracies:** Open an issue with detailed explanation

### Code Contributions

#### Adding New Features

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Write clean, readable TypeScript
   - Test your changes locally

4. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
   Use conventional commits:
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `style:` - Code style changes
   - `refactor:` - Code refactoring
   - `test:` - Test updates
   - `chore:` - Build/config updates

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Wait for review

#### Creating New Blog Posts

New blog posts are created using MDX format in the `src/app/blog/` directory:

1. **Use the template**
   ```bash
   npm run create-post
   ```
   Or manually copy from `templates/blog-post-template.mdx`

2. **File structure**
   ```
   src/app/blog/YYYY-MM/post-slug/page.mdx
   ```

3. **Required frontmatter**
   ```mdx
   export const metadata = {
     title: "Your Post Title",
     publishDate: "YYYY-MM-DD",
     author: "Andrii Fedorenko",
     category: "Category Name",
     tags: ["tag1", "tag2"],
     excerpt: "Brief description",
     readingTime: "X min read"
   };
   ```

4. **Add images**
   Place images in `public/blog/YYYY/your-image.webp`

### Development Guidelines

- **TypeScript:** All new code should be in TypeScript
- **Components:** Use functional components with hooks
- **Styling:** Use CSS Modules or Tailwind classes
- **Testing:** Test changes across different browsers
- **Performance:** Optimize images and lazy-load when possible
- **Accessibility:** Ensure WCAG 2.1 AA compliance

### Code Review Process

1. All PRs require at least one review
2. CI checks must pass
3. Changes should not break existing functionality
4. Documentation should be updated if needed

---

## 📂 Project Structure

```
banandre/
├── src/
│   ├── app/
│   │   ├── _components/     # Reusable React components
│   │   ├── blog/            # Blog posts (MDX)
│   │   ├── categories/      # Category pages
│   │   ├── tags/            # Tag pages
│   │   ├── config.ts        # Site configuration
│   │   └── layout.tsx       # Root layout
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── scripts/                 # Build and utility scripts
└── templates/               # Templates for new content
```

---

## 🔗 Connect

- **Twitter/X:** [@andre_banandre](https://x.com/andre_banandre)
- **GitHub:** [@andrebanandre](https://github.com/andrebanandre)
- **LinkedIn:** [Andrii Fedorenko](https://www.linkedin.com/in/andrii-fedorenko-65905863/)

---

## 📄 License

© 2025 Banandre. All rights reserved.

---

## 🙏 Acknowledgments

Built with 🍌 by Andrii Fedorenko

Special thanks to the open-source community and all the technologies that make this blog possible.

