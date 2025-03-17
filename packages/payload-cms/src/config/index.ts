// packages/payload-cms/src/config.ts
import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { Config, PayloadRequest } from "payload";
import sharp from "sharp";

import {
  Categories,
  Courses,
  Divisions,
  Media,
  Pages,
  Posts,
  Users,
} from "@acme/payload-cms/collections";
import { defaultLexical } from "@acme/payload-cms/fields";
import { Footer } from "@acme/payload-cms/Footer/config";
import { Header } from "@acme/payload-cms/Header/config";
import { plugins } from "@acme/payload-cms/plugins";
import { getServerSideURL } from "@acme/payload-cms/utilities/getURL";

// Export collection definitions
export const baseCollections = [
  Pages,
  Posts,
  Media,
  Categories,
  Users,
  Courses,
  Divisions,
];

// Export globals
export const baseGlobals = [Header(), Footer];

// Create base config function that accepts overrides
export function createBaseConfig(options: {
  dirname: string;
  collections?: any[];
  globals?: any[];
  db?: any;
  typescript?: {
    outputFile: string;
  };
}): Config {
  const {
    dirname,
    collections = baseCollections,
    globals = baseGlobals,
    typescript,
  } = options;

  // Always use postgres adapter, but allow it to be overridden
  const db =
    options.db ||
    postgresAdapter({
      // For type generation, use an in-memory SQLite-like approach
      // This doesn't need a real connection for type generation
      pool: {
        connectionString: process.env.DATABASE_URI,
      },
      migrationDir: path.resolve(dirname, "./migrations"),
    });

  return {
    admin: {
      components: {
        beforeLogin: ["@/components/BeforeLogin"],
        beforeDashboard: ["@/components/BeforeDashboard"],
      },
      importMap: {
        baseDir: path.resolve(dirname),
      },
      user: Users.slug,
      livePreview: {
        breakpoints: [
          {
            label: "Mobile",
            name: "mobile",
            width: 375,
            height: 667,
          },
          {
            label: "Tablet",
            name: "tablet",
            width: 768,
            height: 1024,
          },
          {
            label: "Desktop",
            name: "desktop",
            width: 1440,
            height: 900,
          },
        ],
      },
    },
    editor: defaultLexical,
    db,
    collections,
    cors: [getServerSideURL()].filter(Boolean),
    globals,
    plugins: [...plugins],
    secret: process.env.PAYLOAD_SECRET!,
    sharp,
    typescript,
    jobs: {
      access: {
        run: ({ req }: { req: PayloadRequest }): boolean => {
          if (req.user) return true;
          const authHeader = req.headers.get("authorization");
          return authHeader === `Bearer ${process.env.CRON_SECRET}`;
        },
      },
      tasks: [],
    },
  };
}

// Keep a default export for type generation in the shared package
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default createBaseConfig({
  dirname,
  db: null, // This can be empty for type generation
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
