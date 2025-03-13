'use server'

import '@payloadcms/next/css'
import './custom.scss'

import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'

import React from 'react'
import type { ServerFunctionClient } from 'payload'
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
// import config from '@acme/payload-cms/payload.config'
import config from '@payload-config'
import { importMap } from './admin/importMap.js'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
