// IMPORTANT: Prefer importing directly from 'client' or 'server' subpaths
// to ensure proper server/client component separation
//
// import { Footer, Header } from '@acme/payload-cms/client'  // For client components
// import { getServerSideURL } from '@acme/payload-cms/server'  // For server utilities
// import { Media, Categories } from '@acme/payload-cms/collections'  // For collections
// import { defaultLexical, link, linkGroup, slugField } from '@acme/payload-cms/fields'  // For field configurations
// import { populatePublishedAt, revalidateRedirects, formatSlug } from '@acme/payload-cms/hooks'  // For hooks

// Re-export from client and server for backward compatibility
export * from "./client";
export * from "./server";

// Export specific module paths
export { default as Layout } from "./app/frontend/layout";

// Re-export collections for backward compatibility
export * from "./collections";

// Re-export fields for backward compatibility
export * from "./fields";

// Re-export hooks for backward compatibility
export * from "./hooks";
