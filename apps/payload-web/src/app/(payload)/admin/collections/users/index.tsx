import { CollectionConfig } from 'payload'
import { authenticated } from '@acme/payload-cms/access/authenticated'

// Default Users collection configuration
export const UsersBase: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
    components: {
      views: {
        list: {
          Component: '@/app/(payload)/admin/collections/users/custom-users-list-view',
        },
      },
    },
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}

// Export the default Users collection for backward compatibility
export const Users = UsersBase
