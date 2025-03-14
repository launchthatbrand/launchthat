import './custom.scss'
import './globals.css'

import { AdminBar } from '@acme/payload-cms/client'
import { Providers as BaseProviders } from '../providers'
import { Footer } from '@acme/payload-cms/server'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Header } from '@acme/payload-cms/server'
import { InitTheme } from '@acme/payload-cms/client'
import type { Metadata } from 'next'
import { Providers } from '@acme/payload-cms/client'
import React from 'react'
import StandardLayout from '@acme/ui/layout/StandardLayout'
import { cn } from '@acme/ui/lib/utils'
import { draftMode } from 'next/headers'
import { getServerSideURL } from '@acme/payload-cms/server'
import { mergeOpenGraph } from '@acme/payload-cms/server'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <BaseProviders>
            <StandardLayout
              appName="WSA"
              topbar={
                <AdminBar
                  adminBarProps={{
                    preview: isEnabled,
                  }}
                />
              }
            >
              <Header />
              {children}
              <Footer className="sticky bottom-0 left-0 right-0" />
            </StandardLayout>
          </BaseProviders>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
