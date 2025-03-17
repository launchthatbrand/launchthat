import type { Payload } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";

import type { TRPCContext } from "@acme/api-payload";
import { createCallerWithContext, createTRPCContext } from "@acme/api-payload";

// packages/payload-cms/src/db/trpc-adapter.ts

// Use a more general type for PayloadRequest to avoid import errors
type PayloadRequest = {
  headers?: Record<string, string>;
  [key: string]: any;
};

// Helper to convert Payload queries to tRPC format
const convertPayloadQueryToTRPCParams = (query: any) => {
  const where = query.where || {};
  const sort = query.sort || {};

  return {
    filters: where,
    sort: sort,
  };
};

type PayloadCollectionAdapter = {
  connect: () => Promise<boolean>;
  find: (args: { collection: string; query: any }) => Promise<{
    docs: any[];
    totalDocs: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>;
  findOne: (args: { collection: string; id: string | number }) => Promise<any>;
  create: (args: { collection: string; data: any }) => Promise<any>;
  update: (args: {
    collection: string;
    id: string | number;
    data: any;
  }) => Promise<any>;
  delete: (args: { collection: string; id: string | number }) => Promise<any>;
};

// The tRPC adapter implementation for users collection
export const createTRPCAdapter = (options: {
  appId: string;
  req?: PayloadRequest;
  payload?: Payload;
}): PayloadCollectionAdapter => {
  // Create a headers object from the request headers
  const getHeadersObject = () => {
    if (!options.req?.headers) return new Headers();

    // Convert headers record to Headers object
    const headers = new Headers();
    Object.entries(options.req.headers).forEach(([key, value]) => {
      if (value) headers.append(key, value);
    });

    return headers;
  };

  // Helper to create a valid context with Payload
  const createContext = async (): Promise<TRPCContext> => {
    try {
      return await createTRPCContext({
        headers: getHeadersObject(),
        session: null,
        payload: options.payload,
      });
    } catch (error) {
      options.payload?.logger.error("Error creating tRPC context:", error);
      throw new Error(
        `Failed to create tRPC context: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  return {
    // Initialize connection (required by Payload)
    connect: async () => {
      return true; // tRPC doesn't need a persistent connection
    },

    // Find multiple documents
    find: async ({ collection, query }: { collection: string; query: any }) => {
      const context = await createContext();
      const caller = createCallerWithContext(context);

      try {
        // Only handle the users collection
        if (
          collection === "users" &&
          "payload" in caller &&
          "users" in caller.payload
        ) {
          const params = {
            pagination: {
              page: query.pagination?.page || 1,
              limit: query.pagination?.limit || 10,
            },
            where: convertPayloadQueryToTRPCParams(query),
          };

          // Type assertion since we've checked "users" exists
          const result = await caller.payload.users.list(params);

          return {
            docs: result.users || [],
            totalDocs: result.totalCount || 0,
            page: params.pagination.page,
            totalPages: Math.ceil(
              (result.totalCount || 0) / params.pagination.limit,
            ),
            hasNextPage: result.hasNextPage || false,
            hasPrevPage: params.pagination.page > 1,
          };
        }

        // Default response for any non-users collection - should never happen in hybrid adapter
        options.payload?.logger.warn(
          `Collection ${collection} not supported in tRPC adapter (only 'users' is supported)`,
        );
        return {
          docs: [],
          totalDocs: 0,
          page: 1,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        };
      } catch (error) {
        options.payload?.logger.error(
          `Error in tRPC adapter find for ${collection}:`,
          error,
        );
        throw error;
      }
    },

    // Find a single document by ID
    findOne: async ({
      collection,
      id,
    }: {
      collection: string;
      id: string | number;
    }) => {
      const context = await createContext();
      const caller = createCallerWithContext(context);

      try {
        if (
          collection === "users" &&
          "payload" in caller &&
          "users" in caller.payload
        ) {
          return await caller.payload.users.byId({ id: String(id) });
        }

        options.payload?.logger.warn(
          `Collection ${collection} not supported in tRPC adapter (only 'users' is supported)`,
        );
        return null;
      } catch (error) {
        options.payload?.logger.error(
          `Error in tRPC adapter findOne for ${collection}:`,
          error,
        );
        throw error;
      }
    },

    // Create a document
    create: async ({ collection, data }: { collection: string; data: any }) => {
      const context = await createContext();
      const caller = createCallerWithContext(context);

      try {
        if (
          collection === "users" &&
          "payload" in caller &&
          "users" in caller.payload
        ) {
          return await caller.payload.users.create(data);
        }

        options.payload?.logger.warn(
          `Collection ${collection} not supported in tRPC adapter (only 'users' is supported)`,
        );
        return null;
      } catch (error) {
        options.payload?.logger.error(
          `Error in tRPC adapter create for ${collection}:`,
          error,
        );
        throw error;
      }
    },

    // Update a document
    update: async ({
      collection,
      id,
      data,
    }: {
      collection: string;
      id: string | number;
      data: any;
    }) => {
      const context = await createContext();
      const caller = createCallerWithContext(context);

      try {
        if (
          collection === "users" &&
          "payload" in caller &&
          "users" in caller.payload
        ) {
          return await caller.payload.users.update({
            id: String(id),
            ...data,
          });
        }

        options.payload?.logger.warn(
          `Collection ${collection} not supported in tRPC adapter (only 'users' is supported)`,
        );
        return null;
      } catch (error) {
        options.payload?.logger.error(
          `Error in tRPC adapter update for ${collection}:`,
          error,
        );
        throw error;
      }
    },

    // Delete a document
    delete: async ({
      collection,
      id,
    }: {
      collection: string;
      id: string | number;
    }) => {
      const context = await createContext();
      const caller = createCallerWithContext(context);

      try {
        if (
          collection === "users" &&
          "payload" in caller &&
          "users" in caller.payload
        ) {
          return await caller.payload.users.delete({ id: String(id) });
        }

        options.payload?.logger.warn(
          `Collection ${collection} not supported in tRPC adapter (only 'users' is supported)`,
        );
        return null;
      } catch (error) {
        options.payload?.logger.error(
          `Error in tRPC adapter delete for ${collection}:`,
          error,
        );
        throw error;
      }
    },
  };
};

// The main adapter that uses postgres but proxies users collection to tRPC
export const createHybridAdapter = (options: {
  appId: string;
  postgresURL: string;
  migrationDir?: string;
}) => {
  // Just return the PostgreSQL adapter - we'll handle tRPC in our collections
  return postgresAdapter({
    pool: {
      connectionString: options.postgresURL,
    },
    migrationDir: options.migrationDir,
  });
};
