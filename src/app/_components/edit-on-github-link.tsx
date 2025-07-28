'use client'

import { usePathname } from 'next/navigation'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

export function EditOnGitHubLink() {
  const pathname = usePathname()
  const editUrl = `https://github.com/latyaodessa/banandre/blob/main/src/app${pathname}/page.mdx`

  return (
    <a
      href={editUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="brutalist-link"
    >
      <GitHubLogoIcon style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5em' }} />
      Edit this page on GitHub
    </a>
  )
}