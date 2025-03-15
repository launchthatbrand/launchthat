import { appRouter, createCaller, createTRPCContext } from '@acme/api-payload'

import { auth } from '@acme/auth'
import { headers } from 'next/headers'

export const createCallerForRequest = async () => {
  const session = await auth()

  const context = await createTRPCContext({
    session,
    headers: headers(),
  })

  return createCaller(context)
}
