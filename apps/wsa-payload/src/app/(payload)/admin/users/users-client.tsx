'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/card'

import { Button } from '@acme/ui/components/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTRPC } from '~/trpc/react'

type User = {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export function UsersClientPage({
  initialData,
}: {
  initialData: {
    docs: User[]
    totalDocs: number
    limit: number
    totalPages: number
    page: number
    pagingCounter: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
  }
}) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(initialData.page)
  const trpc = useTRPC()

  // Use the initial data for the first render, then fetch new data when needed
  const { data = initialData, isLoading } = trpc.payload.users.find.useQuery(
    {
      page: currentPage,
      limit: initialData.limit,
    },
    {
      initialData,
      // Only refresh when changing pages
      enabled: currentPage !== initialData.page,
    },
  )

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    router.push(`/admin/users?page=${newPage}&limit=${data.limit}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <Button asChild>
          <Link href="/admin/collections/users/create">Create New User</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({data.totalDocs})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Created</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.docs.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="px-4 py-2">{user.name}</td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/admin/collections/users/${user.id}`}>Edit</Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Page {data.page} of {data.totalPages}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePageChange(data.page - 1)}
                      disabled={!data.hasPrevPage}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePageChange(data.page + 1)}
                      disabled={!data.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
