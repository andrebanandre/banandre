import type { Metadata } from 'next'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { FC, ReactNode } from 'react'
import { NextraTheme } from './_components/nextra-theme'
import HotjarScript from './_components/hotjar-script'
import './globals.css'
import './sidebar.css'
import 'nextra-theme-blog/style.css'

export const metadata: Metadata = {
  title: {
    absolute: '',
    template: '%s - Nextra'
  }
}
 
const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr">
      <Head faviconGlyph="✦" />
      <body style={{ margin: 0 }}>
        <NextraTheme pageMap={pageMap}>{children}</NextraTheme>
        <HotjarScript />
      </body>
    </html>
  )
}
 
export default RootLayout