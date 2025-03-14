'use client'

import BaseProvider from '@acme/ui/providers/BaseProvider'
import type { ReactNode } from 'react'
import { ThemeToggle } from '@acme/ui/components/theme'
import { env } from '~/env'

// import { TRPCReactProvider } from "~/trpc/react";

export function Providers({ children }: { children: ReactNode }) {
  // Register service worker on component mount

  return (
    <BaseProvider>
      {/* <TRPCReactProvider> */}
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <ThemeToggle />
      </div>
      {env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50 rounded bg-black/10 p-2 text-xs">
          DEV MODE - PWA Testing Enabled
        </div>
      )}
      {/* </TRPCReactProvider> */}
    </BaseProvider>
  )
}
