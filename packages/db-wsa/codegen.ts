import type { CodegenConfig } from "@graphql-codegen/cli";
import { baseCodegenConfig } from "@acme/graphql";

/**
 * GraphQL CodeGen configuration for WSA
 * This generates TypeScript types and React Query hooks from the GraphQL schema and operations
 */
const config: CodegenConfig = {
  // Override the schema from the base config
  schema: {
    [process.env.NEXT_PUBLIC_WSA_WORDPRESS_API_URL || ""]: {
      headers: {
        // Add any authentication headers here if needed
        // e.g., "Authorization": `Bearer ${process.env.WSA_API_TOKEN}`
      },
    },
  },

  // Define where to look for GraphQL operations (queries, mutations, etc.)
  documents: [
    // Look for operations in the db-wsa package
    "src/graphql/operations/**/*.{ts,tsx,graphql}",
    "src/graphql/fragments/**/*.{ts,tsx,graphql}",
    // Also look in the wsa app
    "../../apps/wsa/src/app/**/*.{graphql}",
  ],

  ignoreNoDocuments: true, // Useful for CI

  generates: {
    "src/graphql/schema.graphql": {
      plugins: ["schema-ast"],
    },

    // Generate the base schema types
    "src/graphql/generated/schema.ts": {
      plugins: ["typescript"],
      config: {
        avoidOptionals: false,
        constEnums: true,
        enumsAsTypes: false,
        skipTypename: false,
        useTypeImports: true,
      },
    },

    // Generate types for all operations and hooks for React Query
    "src/graphql/generated/": {
      preset: "client",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
      },
      config: {
        avoidOptionals: false,
        defaultScalarType: "unknown",
        enumsAsTypes: false,
        exposeFetcher: true,
        exposeQueryKeys: true,
        skipTypename: false,
        useTypeImports: true,

        // React Query specific options
        fetcher: {
          endpoint: "process.env.NEXT_PUBLIC_WSA_WORDPRESS_API_URL",
          fetchParams: {
            headers: {
              "Content-Type": "application/json",
            },
          },
        },
        reactQueryVersion: 4,
        addInfiniteQuery: true,
      },
    },
  },
};

export default config;
