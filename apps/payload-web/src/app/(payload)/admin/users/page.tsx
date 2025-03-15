import { StandardLayout } from '@acme/ui/layout'
import { UsersClientPage } from './users-client'
import { createCallerForRequest } from '~/utils/api'

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string }
}) {
  // Pre-fetch the initial data on the server
  const api = await createCallerForRequest()
  const initialData = await api.payload.users.find({
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit) : 10,
  })

  return (
    <StandardLayout appName="PayloadCMS" topbar={<div className="p-4">Custom Users View</div>}>
      <div className="container mx-auto p-6">
        <UsersClientPage initialData={initialData} />
      </div>
    </StandardLayout>
  )
}
