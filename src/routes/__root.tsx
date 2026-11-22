import type { ReactNode } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import css from '../styles/global.css?url'

const SITE = 'https://fuxx.fitzfitz.site'
const TITLE = 'fuxx — the terminal for people who run AI agents'
const DESCRIPTION =
  'A native, GPU-fast terminal for people who run AI coding agents and refuse to babysit them.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { name: 'theme-color', content: '#05070a' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: SITE },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:image', content: `${SITE}/og.png` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESCRIPTION },
      { name: 'twitter:image', content: `${SITE}/og.png` },
    ],
    links: [
      { rel: 'stylesheet', href: css },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'canonical', href: SITE },
    ],
  }),
  component: () => (
    <RootDocument>
      <Outlet />
    </RootDocument>
  ),
})

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
