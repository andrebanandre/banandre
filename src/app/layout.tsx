import type { Metadata } from 'next'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { FC, ReactNode } from 'react'
import { NextraTheme } from './_components/nextra-theme'
import GoogleAnalytics from './_components/google-analytics'
import './globals.css'
import './sidebar.css'
import 'nextra-theme-blog/style.css'

export const metadata: Metadata = {
  title: {
    absolute: '',
    template: '%s - Banandre'
  }
}
 
const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr">
      <Head faviconGlyph="✦" />
      <body style={{ margin: 0 }}>
        <NextraTheme pageMap={pageMap}>
          {children}
          </NextraTheme>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
 
export default RootLayout