// Import custom Courses collection
import { CoursesCollection } from './lib/payload/collections/CoursesCollection'
// Import base collections to override
import { baseCollections } from '@acme/payload-cms/config'
import { buildConfig } from 'payload'
import { createBaseConfig } from '@acme/payload-cms/config'
import { fileURLToPath } from 'url'
import path from 'path'
import { postgresAdapter } from '@acme/payload-cms/db' // database-adapter-import

// storage-adapter-import-placeholder

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Create a modified collections array by replacing the standard Courses collection
const customCollections = baseCollections.map((collection) =>
  collection.slug === 'courses' ? CoursesCollection : collection,
)

// Create your app-specific config by extending the base
const config = createBaseConfig({
  dirname,
  // Override database configuration
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    migrationDir: path.resolve(dirname, './migrations'),
  }),
  // Override collections with our custom set
  collections: customCollections,
  // Specify where to output types
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})

// Ensure admin and components exist with proper type assertions
if (config.admin) {
  config.admin.components = config.admin.components || {}
  config.admin.components.beforeDashboard = [
    '@acme/payload-cms/components/BeforeDashboard',
    '@/_components/admin/CustomNav#CustomNav',
  ]
}

// Ensure PAYLOAD_SECRET is always defined
if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is required')
}

export default buildConfig(config)
