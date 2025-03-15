import { Categories, Media, Pages, Posts } from '@acme/payload-cms/collections'

import { CollectionConfig } from 'payload'
import { Users } from '@/app/(payload)/admin/collections/users'

// Instead of directly importing the component, we'll just reference its path
// import CustomListView from '@/_components/views/CustomListView'

const applyCustomListView = (collections: CollectionConfig[]) => {
  return collections.map((collection) => ({
    ...collection,
    admin: {
      ...collection.admin,
      components: {
        ...collection.admin?.components,
        views: {
          ...collection.admin?.components?.views,
          list: {
            // Use a string path instead of a direct component reference
            Component: '@/_components/views/CustomListView',
          },
        },
      },
    },
  }))
}

const collections = applyCustomListView([Users, Categories, Media, Pages, Posts])

export default collections
