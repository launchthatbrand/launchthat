/**
 * GraphQL client and type definitions for the WSA app
 */

import { createGraphQLClient } from "@acme/graphql";

// Re-export generated types
export * from "./generated/schema";

// These will be populated by the codegen once it's run
// They will be proper imports from the generated files
const queries = {};
const mutations = {};

/**
 * WSA GraphQL client instance
 */
export const wsaGraphQLClient = createGraphQLClient({
  endpoint: process.env.NEXT_PUBLIC_WSA_WORDPRESS_API_URL || "",
  headers: () => {
    // Add any authentication headers needed for your requests
    return {
      "Content-Type": "application/json",
      // Example: "Authorization": `Bearer ${getToken()}`
    };
  },
  queries,
  mutations,
});

/**
 * Usage example with the client:
 *
 * import { wsaGraphQLClient } from "@acme/db-wsa/graphql";
 * import { useOrdersQuery } from "@acme/db-wsa/graphql/generated/hooks";
 *
 * // In your component:
 * const { data, isLoading } = useOrdersQuery();
 */
