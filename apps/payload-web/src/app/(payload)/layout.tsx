'use server'

import '@payloadcms/next/css'
import './custom.scss'

import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'

import React from 'react'
import type { ServerFunctionClient } from 'payload'
import config from '@payload-config'
import { importMap } from './admin/importMap.js'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
// import config from '@acme/payload-cms/payload.config'

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
    <div className="flex bg-blue-500">
      <div className="w-[300px] bg-red-400"></div>
      <div className="w-3/4">{children}</div>
    </div>
  </RootLayout>
  // <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
  //   {children}
  // </RootLayout>
)

export default Layout
