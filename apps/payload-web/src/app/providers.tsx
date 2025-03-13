'use client'

import BaseProvider from '@acme/ui/providers/BaseProvider'
import type { ReactNode } from 'react'
import { ThemeToggle } from '@acme/ui/components/theme'
import { env } from '~/env'
import { useEffect } from 'react'

// import { TRPCReactProvider } from "~/trpc/react";





export function Providers({ children }: { children: ReactNode }) {
  // Register service worker on component mount
  useEffect(() => {
    try {
      console.log('[PWA] Registering service worker...')

      console.log('[PWA] Service worker registration initiated')

      // Log browser support for installation
      if (typeof window !== 'undefined') {
        console.log('[PWA] BeforeInstallPrompt support:', 'onbeforeinstallprompt' in window)
        console.log('[PWA] Service Worker support:', 'serviceWorker' in navigator)

        // Listen for installation events to debug
        window.addEventListener('beforeinstallprompt', (e) => {
          console.log('[PWA] Install prompt event triggered', e)
          // Prevent default browser behavior
          e.preventDefault()
        })

        window.addEventListener('appinstalled', (e) => {
          console.log('[PWA] App was successfully installed', e)
        })
      }
    } catch (error) {
      console.error('[PWA] Service worker registration failed:', error)
    }
  }, [])

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
