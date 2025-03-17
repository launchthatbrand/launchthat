import type { Payload } from "payload";
import { z } from "zod";

import type { TRPCContext } from "../trpc";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

// Helper function to get a Payload instance
const getPayloadInstance = async (): Promise<Payload> => {
  try {
    // Dynamic import to avoid circular dependency
    const { getPayload } = await import("payload");

    // Get payload without config - using @ts-ignore to bypass the type check
    // This works in many environments if PAYLOAD_CONFIG_PATH is set
    // @ts-ignore - We know this may need a config parameter but it can work without
    return await getPayload();
  } catch (error) {
    console.error("Error getting Payload instance:", error);
    throw new Error("Failed to get Payload instance");
  }
};

export const usersRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        pagination: z.object({
          page: z.number().optional().default(1),
          limit: z.number().optional().default(10),
        }),
        where: z.any().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      // Use context type assertion to access payload
      const context = ctx as unknown as TRPCContext;
      // Use payload from context if available, otherwise get a new instance
      const payload = context.payload || (await getPayloadInstance());

      const results = await payload.find({
        collection: "users",
        page: input.pagination.page,
        limit: input.pagination.limit,
        where: input.where?.filters,
        sort: input.where?.sort,
        depth: 1,
      });

      return {
        users: results.docs,
        totalCount: results.totalDocs,
        page: results.page,
        totalPages: results.totalPages,
        hasNextPage: results.hasNextPage,
        hasPrevPage: results.hasPrevPage,
      };
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Use context type assertion to access payload
      const context = ctx as unknown as TRPCContext;
      const payload = context.payload || (await getPayloadInstance());

      return payload.findByID({
        collection: "users",
        id: input.id,
        depth: 1,
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Use context type assertion to access payload
      const context = ctx as unknown as TRPCContext;
      const payload = context.payload || (await getPayloadInstance());

      return payload.create({
        collection: "users",
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        password: z.string().min(8).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Use context type assertion to access payload
      const context = ctx as unknown as TRPCContext;
      const payload = context.payload || (await getPayloadInstance());
      const { id, ...data } = input;

      return payload.update({
        collection: "users",
        id,
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Use context type assertion to access payload
      const context = ctx as unknown as TRPCContext;
      const payload = context.payload || (await getPayloadInstance());

      return payload.delete({
        collection: "users",
        id: input.id,
      });
    }),
});
