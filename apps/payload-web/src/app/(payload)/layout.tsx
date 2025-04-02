'use server'

import './custom.scss'
import '@payloadcms/next/css'

import { Providers } from '../providers'
import React from 'react'
import StandardLayout from '@acme/ui/layout/StandardLayout'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
// import config from '@acme/payload-cms/payload.config'

type Args = {
  children: React.ReactNode
  sidebar: React.ReactNode
}

// No need for server function or RootLayout as they're already in the main layout
export default async function PayloadLayout({ children, sidebar }: Args) {
  return (
    <div className="payload-admin-container">
      <Providers>
        <StandardLayout sidebar={sidebar} appName="WSA">
          {children}
        </StandardLayout>
      </Providers>
    </div>
  )
}
