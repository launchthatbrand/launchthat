import { Link } from '@payloadcms/ui'
import React from 'react'

export const CustomNav: React.FC = () => {
  return (
    <nav>
      {/* Your custom navigation content */}
      <ul>
        <li>
          <Link href="/admin/dashboard">Dashboardsss</Link>
        </li>
        {/* Add your custom navigation items */}
      </ul>
    </nav>
  )
}
