import { fileURLToPath } from 'url'
import path from 'path'
import redirects from './redirects.js'
import { withPayload } from '@payloadcms/next/withPayload'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Get directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    '@acme/api',
    '@acme/auth',
    '@acme/db',
    '@acme/ui',
    '@acme/validators',
    '@acme/payload-cms',
  ],

  // Use serverExternalPackages only for packages that aren't involved in transpilation
  serverExternalPackages: [
    // Remove the following packages as they conflict with transpilePackages
    // 'payload',
    // '@payloadcms/next',
    // '@payloadcms/payload-cloud',
    'pino',
    'pino-pretty',
    'nodemailer',
  ],

  webpack: (config, { isServer }) => {
    // Handle Node.js modules in client-side code
    if (!isServer) {
      // Handle all Node.js modules that might be used in server components but not in client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
        child_process: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        crypto: false,
        dns: false,
        dgram: false,
        timers: false,
        worker_threads: false,
        diagnostics_channel: false,
        module: false,
        perf_hooks: false,
      }

      // Prevent server-only modules from being bundled
      // config.module.rules.push({
      //   test: /node_modules\/(pino|pino-pretty|nodemailer)\/.*\.js$/,
      //   use: 'null-loader',
      // })
    }

    // Add path alias resolution for @acme/payload-cms package
    const payloadCmsPath = path.resolve(__dirname, '../../packages/payload-cms')

    // Extend the aliases to handle @/ prefixed imports in the payload-cms package
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components': path.resolve(payloadCmsPath, 'src/components'),
      '@/collections': path.resolve(payloadCmsPath, 'src/collections'),
      '@/payload.config': path.resolve(payloadCmsPath, 'src/payload.config.ts'),
      '@/Header/config': path.resolve(payloadCmsPath, 'src/Header/config.ts'),
      '@/Footer/config': path.resolve(payloadCmsPath, 'src/Footer/config.ts'),
      '@/providers': path.resolve(payloadCmsPath, 'src/providers'),
      '@/payload-types': path.resolve(payloadCmsPath, 'src/payload-types'),
      '@/utilities': path.resolve(payloadCmsPath, 'src/utilities'),
      '@/fields': path.resolve(payloadCmsPath, 'src/fields'),
      '@/hooks': path.resolve(payloadCmsPath, 'src/hooks'),
      '@': path.resolve(payloadCmsPath, 'src'),
    }

    return config
  },

  experimental: {
    // Only keep supported experimental features
    optimizePackageImports: ['payload', '@payloadcms/next'],
  },
}

export default withPayload(nextConfig)
