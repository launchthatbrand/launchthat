'use client'

import { createTRPCClient, loggerLink, unstable_httpBatchStreamLink } from '@trpc/client'

import type { AppRouter } from '@acme/api-payload'
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import SuperJSON from 'superjson'
import { createQueryClient } from './query-client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import { env } from '~/env'
import { useState } from 'react'

// Set up a singleton query client
let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient()
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient())
  }
}

// Export useTRPC and TRPCProvider from createTRPCContext
// Note: The actual implementation will depend on the version of @trpc/tanstack-react-query
export const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>()

// Use this function to create a client for the provider
const createClient = () =>
  createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (op) =>
          env.NODE_ENV === 'development' || (op.direction === 'down' && op.result instanceof Error),
      }),
      unstable_httpBatchStreamLink({
        transformer: SuperJSON,
        url: getBaseUrl() + '/api/trpc',
        headers() {
          const headers = new Headers()
          headers.set('x-trpc-source', 'nextjs-react')
          return headers
        },
      }),
    ],
  })

// Provider component to wrap the app
export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() => createClient())

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}
