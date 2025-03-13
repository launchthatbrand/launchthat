'use server'

import '@payloadcms/next/css'
import './custom.scss'

import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'

import { CustomNav } from '@/_components/admin/CustomNav'
import { Providers } from '../providers'
import React from 'react'
import type { ServerFunctionClient } from 'payload'
import StandardLayout from '@acme/ui/layout/StandardLayout'
import config from '@payload-config'
import { importMap } from './admin/importMap.js'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
// import config from '@acme/payload-cms/payload.config'

type Args = {
  children: React.ReactNode
  sidebar: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children, sidebar }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    <Providers>
      <StandardLayout sidebar={sidebar} appName="WSA">
        {children}
      </StandardLayout>
    </Providers>
  </RootLayout>

  // <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
  //   {children}
  // </RootLayout>
)

export default Layout
