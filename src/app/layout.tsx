import type { Metadata } from 'next'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { FC, ReactNode } from 'react'
import { NextraTheme } from './_components/nextra-theme'
import './globals.css'
import 'nextra-theme-blog/style.css'
import Hotjar from '@hotjar/browser'

const siteId = 6476280;
const hotjarVersion = 6;

if (typeof window !== 'undefined') {
  Hotjar.init(siteId, hotjarVersion);
}

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
      </body>
    </html>
  )
}
 
export default RootLayout

// import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog'
// import { Banner, Head, Search } from 'nextra/components'
// import { getPageMap } from 'nextra/page-map'
// import 'nextra-theme-blog/style.css'
 
// export const metadata = {
//   title: 'Blog Example'
// }
 
// export default async function RootLayout({ children }) {
//   const banner = (
//     <Banner storageKey="4.0-release">
//       🎉 Nextra 4.0 is released.{' '}
//       <a
//         href="#"
//         style={{
//           textDecoration: 'underline',
//           textUnderlinePosition: 'from-font'
//         }}
//       >
//         Read more →
//       </a>
//     </Banner>
//   )
 
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <Head backgroundColor={{ dark: '#0f172a', light: '#fefce8' }} />
//       <body>
//         <Layout banner={banner}>
//           <Navbar pageMap={await getPageMap()}>
//             <Search />
//             <ThemeSwitch />
//           </Navbar>
 
//           {children}
 
//           <Footer>
//             <abbr
//               title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
//               style={{ cursor: 'help' }}
//             >
//               CC BY-NC 4.0
//             </abbr>{' '}
//             {new Date().getFullYear()} © Dimitri POSTOLOV.
//             <a href="/feed.xml" style={{ float: 'right' }}>
//               RSS
//             </a>
//           </Footer>
//         </Layout>
//       </body>
//     </html>
//   )
// }