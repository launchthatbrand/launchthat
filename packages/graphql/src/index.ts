/**
 * Shared GraphQL utilities for use across all applications
 */

/**
 * Generic fetch function for GraphQL queries
 *
 * @param url GraphQL endpoint URL
 * @param query GraphQL query or mutation
 * @param variables Variables for the query
 * @param headers Additional headers to send
 * @returns Response data or null
 */
export async function fetchGraphQL<T>(
  url: string,
  query: string,
  variables?: Record<string, unknown>,
  headers?: HeadersInit,
): Promise<T | null> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(
        `GraphQL errors: ${result.errors.map((e: any) => e.message).join(", ")}`,
      );
    }

    return result.data as T;
  } catch (error) {
    console.error("GraphQL request error:", error);
    return null;
  }
}

/**
 * Base configuration for GraphQL Codegen
 * Can be extended by app-specific configurations
 */
export const baseCodegenConfig = {
  schema: {
    // This is a placeholder - app specific configs will override this
    ["${GRAPHQL_ENDPOINT}"]: {
      headers: {
        // Common headers can go here
      },
    },
  },
  documents: ["src/**/*.graphql"],
  ignoreNoDocuments: true,
  generates: {
    // App specific configs will define their own output
  },
};

/**
 * Helper to create a typed client specific to an app's GraphQL schema
 */
export function createGraphQLClient<
  TQueries extends Record<string, Function>,
  TMutations extends Record<string, Function>,
>(config: {
  endpoint: string;
  headers?: () => HeadersInit;
  queries: TQueries;
  mutations: TMutations;
}) {
  const { endpoint, headers, queries, mutations } = config;

  return {
    queries,
    mutations,
    execute: async <T>(
      query: string,
      variables?: Record<string, unknown>,
    ): Promise<T | null> => {
      return fetchGraphQL<T>(endpoint, query, variables, headers?.());
    },
  };
}

// Export types that will be commonly used
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: T[P];
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: Maybe<T[P]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
