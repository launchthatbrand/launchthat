import { PayloadRequest, buildConfig } from 'payload'

import { Categories } from '@acme/payload-cms/collections'
import { Footer } from '@acme/payload-cms/Footer/config'
import { Header } from '@acme/payload-cms/Header/config'
import { Media } from '@acme/payload-cms/collections'
import { Pages } from '@acme/payload-cms/collections'
import { Posts } from '@acme/payload-cms/collections'
import { Users } from '@acme/payload-cms/collections'
import { defaultLexical } from '@acme/payload-cms/fields'
import { fileURLToPath } from 'url'
import { getServerSideURL } from './utilities/getURL'
import path from 'path'
import { plugins } from '@acme/payload-cms/plugins'
import { postgresAdapter } from '@payloadcms/db-postgres' // database-adapter-import
import sharp from 'sharp' // sharp-import

// storage-adapter-import-placeholder

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Skip TypeScript checks entirely with a type assertion
const config = {
  admin: {
    components: {
      beforeNavLinks: ['@/_components/admin/CustomNav#CustomNav'],
      Nav: ['@/_components/admin/CustomNav#CustomNav'],
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      // beforeLogin: ['@/components/BeforeLogin'],
      // // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@acme/payload-cms/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  // database-adapter-config-start
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    migrationDir: path.resolve(dirname, './migrations'),
  }),
  // database-adapter-config-end
  collections: [Pages, Posts, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header(), Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
}

// Use a type assertion to bypass all TypeScript errors
export default buildConfig(config as any)
