'use client'

import { DefaultListView } from '@payloadcms/ui'
import React from 'react'

// Client component to wrap DefaultListView
// This handles the client/server boundary
export function ClientListViewWrapper(props: any) {
  return (
    <div>
      {/* We use DefaultListView here since it's a client component */}
      <DefaultListView {...props} />
    </div>
  )
}
