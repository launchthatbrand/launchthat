/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

import { RootPage, generatePageMetadata } from '@payloadcms/next/views'

import type { Metadata } from 'next'
import config from '@payload-config'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) => {
  // Wrapping the RootPage component in a div
  return (
    <div className="admin-content-wrapper bg-red-400">
      <div className="container p-0">{RootPage({ config, params, searchParams, importMap })}</div>
    </div>
  )
}

export default Page
