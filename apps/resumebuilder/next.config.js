import { dirname, join } from "path";

import createJiti from "jiti";
import { fileURLToPath } from "url";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

// Get directory path in ESM
const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@acme/api",
    "@acme/auth",
    "@acme/db",
    "@acme/ui",
    "@acme/validators",
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
    // Tell Next.js to use these packages exclusively on the server
    // This is critical for packages that use Node.js built-in modules
    // We've removed pdf-parse and pdfjs-dist from here as we're handling them in webpack config
    serverComponentsExternalPackages: ["pdf-lib"],
  },

  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": join(__dirname, "src"),
    };

    // Only add fallbacks for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        zlib: false,
        http: false,
        https: false,
        util: false,
        url: false,
        querystring: false,
        buffer: false,
        assert: false,
        net: false,
        tls: false,
        child_process: false,
      };

      // Ensure browser versions of these packages are used
      config.resolve.alias = {
        ...config.resolve.alias,
        "pdf-parse": false, // Disable pdf-parse on client-side
      };
    }

    return config;
  },
};

export default config;
