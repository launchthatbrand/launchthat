import {
  CollectionAfterOperationHook,
  CollectionAfterReadHook,
  CollectionBeforeOperationHook,
  CollectionConfig,
} from 'payload'

import { Courses as BaseCourses } from '@acme/payload-cms/collections'
import { createCaller } from '@acme/api'

// Custom context creation for tRPC
const createTRPCContext = async (req: any) => {
  // Create a simplified context for tRPC calls
  return {
    headers: new Headers(req?.headers || {}),
    session: null,
    db: {} as any,
    token: null,
  }
}

// Define custom beforeOperation hook
const beforeOperationHook: CollectionBeforeOperationHook = async ({
  args,
  operation,
  req,
  collection,
  context,
}) => {
  console.log(`beforeOperationHook - operation: ${operation}`)
  console.log(`beforeOperationHook - collection`, collection)

  // Only process read operations
  if (operation === 'read') {
    try {
      // If we're in a read operation, we can prepare for tRPC fetching here
      console.log('Preparing for tRPC data fetching on read operation')

      // We don't modify args here, but you could if needed
    } catch (error) {
      console.error('Error in beforeOperationHook:', error)
    }
  }

  return args
}

// Define custom afterRead hook that works for both admin and non-admin
const afterReadHook: CollectionAfterReadHook = async ({ req, doc, collection, query }) => {
  // Only log URL and other safe properties
  console.log(`afterReadHook - request URL: ${req?.url || 'undefined'}`)
  console.log(`afterReadHook - document ID: ${doc?.id || 'undefined'}`)
  console.log(`afterReadHook - collection slug: ${collection?.slug || 'undefined'}`)

  if (!req) return doc

  try {
    // Determine what type of read operation this is
    const isAdminRequest = req.url?.includes('/admin') || false
    const isSingleItemRequest = Boolean(doc.id) // If doc.id exists, it's a single item request

    console.log(
      `Read operation details - Admin: ${isAdminRequest}, Single Item: ${isSingleItemRequest}`,
    )

    // Create tRPC context and caller
    const trpcContext = await createTRPCContext(req)
    const caller = createCaller(trpcContext)

    // Get the ID from the document or URL if needed
    let id = doc.id

    // Extract ID from URL if not present in document
    if (!id && req.url) {
      const urlParts = req.url.split('/')
      const idIndex = urlParts.indexOf('courses') + 1

      if (idIndex < urlParts.length) {
        const potentialId = urlParts[idIndex]
        if (potentialId && !['create', 'edit'].includes(potentialId)) {
          id = potentialId
        }
      }
    }

    // Check if courses router exists in tRPC and handle based on operation type
    if ('courses' in caller) {
      if (isSingleItemRequest && id) {
        // Single item request - use byId
        console.log('Fetching single course from tRPC API, id:', id)
        const course = await (caller as any).courses.byId({ id })

        if (course) {
          return {
            ...doc,
            ...course,
            id: doc.id || course.id,
            createdAt: doc.createdAt || course.createdAt || new Date().toISOString(),
            updatedAt: doc.updatedAt || course.updatedAt || new Date().toISOString(),
          }
        }
      } else {
        // This might be a list view operation, but we'll handle single items for now
        // If you need list operations, you would implement this similarly in the afterOperation hook
        console.log('Not enhancing list view in afterRead hook')
      }
    } else {
      console.log('No courses router found in tRPC caller')
    }

    return doc
  } catch (error) {
    console.error('Error enhancing course with tRPC data:', error)
    return doc
  }
}

const afterOperationHook: CollectionAfterOperationHook = async ({ result, operation }) => {
  console.log(`afterOperationHook - operation`, operation)
  console.log(`afterOperationHook - result`, result)
  return null
}

// Clone the base Courses collection and add our custom hooks
// Using type assertion to handle complex types
const baseHooks = BaseCourses.hooks || {}
const baseBeforeOperation = baseHooks.beforeOperation || []
const baseAfterRead = baseHooks.afterRead || []
const baseAfterOperation = baseHooks.afterOperation || []
// Extend the base Courses collection with our custom hooks
export const CoursesCollection: CollectionConfig = {
  ...BaseCourses,
  hooks: {
    ...baseHooks,
    beforeOperation: [...baseBeforeOperation, beforeOperationHook],
    afterRead: [...baseAfterRead, afterReadHook],
    afterOperation: [...baseAfterOperation, afterOperationHook],
  },
} as CollectionConfig

// Export the default collection
export const Courses = CoursesCollection
