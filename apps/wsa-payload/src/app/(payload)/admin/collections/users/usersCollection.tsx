'use server'

import type { ListViewServerProps } from 'payload'
import { PayloadAdminLayout } from '@acme/payload-cms/admin/components'

// Server component for custom users list view
export default async function CustomUsersListView(props: ListViewServerProps) {
  // You can log props for debugging (server-side only)
  console.log(props.data)

  // Extract only the serializable data needed by the component
  const userData = {
    docs: props.data?.docs || [],
    totalDocs: props.data?.totalDocs || 0,
    hasNextPage: props.data?.hasNextPage || false,
    hasPrevPage: props.data?.hasPrevPage || false,
    page: props.data?.page || 1,
    totalPages: props.data?.totalPages || 1,
  }

  return (
    <div className="p-0">
      {/* Pass only the specific props that PayloadAdminLayout needs */}
      <PayloadAdminLayout userData={userData} />
    </div>
  )
}
