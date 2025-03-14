'use client'

import { BookOpen, TerminalSquare } from 'lucide-react'

import { NavMain } from '@acme/ui/general/nav-main'
import React from 'react'
import { SidebarHeader } from '@acme/ui/components/sidebar'
import { useConfig } from '@payloadcms/ui'

export function PayloadSidebar() {
  const { config } = useConfig()

  const navMain = [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: TerminalSquare,
      isActive: typeof window !== 'undefined' && window.location.pathname === '/admin',
    },
    // Dynamically add collections to the navigation
    ...(config?.collections || []).map((collection) => ({
      title:
        typeof collection.labels?.singular === 'string'
          ? collection.labels.singular
          : collection.slug,
      url: `/admin/collections/${collection.slug}`,
      icon: BookOpen,
      isActive:
        typeof window !== 'undefined' &&
        window.location.pathname.includes(`/admin/collections/${collection.slug}`),
    })),
  ]

  return (
    <>
      <SidebarHeader>
        <h3 className="text-lg font-semibold">Payload CMS</h3>
      </SidebarHeader>
      <NavMain items={navMain} />
    </>
  )
}
