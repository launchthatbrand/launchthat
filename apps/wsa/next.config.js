import { fileURLToPath } from "url";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

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
  images: {
    remotePatterns: [
      {
        hostname: "qcausa.monday.com",
      },
      {
        hostname: "nft.wsatraining.com",
      },
      {
        hostname: "api.dicebear.com",
      },
      {
        hostname: "app.wsatraining.com",
      },
      {
        hostname: "wordpress-1198822-4842583.cloudwaysapps.com",
      },
      {
        hostname: "picsum.photos",
      },
      {
        hostname: "i.pravatar.cc",
      },
      {
        hostname: "*",
      },
    ],
  },
};

export default config;
