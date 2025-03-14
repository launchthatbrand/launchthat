import '@payloadcms/next/css'

import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'

import React from 'react'
import type { ServerFunctionClient } from 'payload'
import config from '@payload-config'
import { importMap } from './(payload)/admin/importMap'

// Server function for PayloadCMS operations
const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

// Root layout that serves as the base for both admin and frontend content
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
