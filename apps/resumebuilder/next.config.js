import { dirname, join } from "path";
import { fileURLToPath } from "url";
import createJiti from "jiti";

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
    serverComponentsExternalPackages: ["pdf-parse", "pdf-lib", "pdfjs-dist"],
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
    }

    return config;
  },
};

export default config;
