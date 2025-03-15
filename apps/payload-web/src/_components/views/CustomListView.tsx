'use server'

import { ListViewServerProps, ServerProps } from 'payload'

import PayloadAdminLayout from '@acme/payload-cms/admin/components/PayloadAdminLayout'

// Extend Props type to include collection property
type Props = ListViewServerProps &
  ServerProps & {
    collection?: {
      labels?: {
        plural?: string
      }
    }
  }

export default async function CustomListView(props: Props) {
  // Extract only serializable data from the props
  const serializedData = {
    // Data items
    items: props.data?.docs || [],
    // Collection info
    collectionSlug: props.collectionSlug,
    collectionLabel: props.collection?.labels?.plural || 'Items',
    // Pagination info
    totalDocs: props.data?.totalDocs || 0,
    // Permissions
    canCreate: props.hasCreatePermission || false,
  }

  // Log on server side for debugging if needed
  console.log('Server component processing data for: ', serializedData.collectionLabel)

  return (
    <div>
      {/* Pass only serializable data to the client component */}
      <PayloadAdminLayout {...serializedData} />
    </div>
  )
}
