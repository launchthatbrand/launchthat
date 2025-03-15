'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Create a loading component
const ListViewLoading = () => (
  <div className="p-4">
    <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200"></div>
    <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200"></div>
    <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200"></div>
    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
  </div>
)

// Dynamically import the custom users list view component
// This ensures it's only loaded on the client side
const DynamicListView = dynamic(
  () => import('./client-components').then((mod) => mod.ClientListViewWrapper),
  {
    loading: () => <ListViewLoading />,
    ssr: false, // Disable server-side rendering
  },
)

// Export the dynamic component
export default function DynamicUsersListView(props: any) {
  return <DynamicListView {...props} />
}

// Also export as a named export for Payload's import system
export const CustomUsersListView = DynamicUsersListView
