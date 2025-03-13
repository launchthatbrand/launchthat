'use client'

import {
  AudioWaveform,
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  TerminalSquare,
} from 'lucide-react'

import { NavMain } from '@acme/ui/general/nav-main'
import { SidebarHeader } from '@acme/ui/components/sidebar'
import { TeamSwitcher } from '@acme/ui/general/team-switcher'
import { useConfig } from '@payloadcms/ui'

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
}

export default function DefaultSidebar() {
  const { config } = useConfig()
  const navMain = [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: TerminalSquare,
      isActive: true,
    },
    // Dynamically add collections to the navigation
    ...config.collections.map((collection) => ({
      title:
        typeof collection.labels?.singular === 'string'
          ? collection.labels.singular
          : collection.slug,
      url: `/admin/collections/${collection.slug}`,
      icon: BookOpen, // Using a default icon, can be customized further
    })),
  ]

  return (
    <>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <NavMain items={navMain} />
    </>
  )
}
