import { getPayload } from "payload";
import { z } from "zod";

import configPromise from "../payload.config";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  users: createTRPCRouter({
    find: publicProcedure
      .input(
        z.object({
          page: z.number().optional().default(1),
          limit: z.number().optional().default(10),
          sort: z.string().optional(),
          where: z.any().optional(),
        }),
      )
      .query(async ({ input }) => {
        const payload = await getPayload({ config: configPromise });

        return payload.find({
          collection: "users",
          page: input.page,
          limit: input.limit,
          sort: input.sort,
          where: input.where,
          depth: 1,
        });
      }),

    findById: protectedProcedure.input(z.string()).query(async ({ input }) => {
      const payload = await getPayload({ config: configPromise });

      return payload.findByID({
        collection: "users",
        id: input,
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
      .mutation(async ({ input }) => {
        const payload = await getPayload({ config: configPromise });

        return payload.create({
          collection: "users",
          data: input,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          data: z.object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            password: z.string().min(8).optional(),
          }),
        }),
      )
      .mutation(async ({ input }) => {
        const payload = await getPayload({ config: configPromise });

        return payload.update({
          collection: "users",
          id: input.id,
          data: input.data,
        });
      }),

    delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
      const payload = await getPayload({ config: configPromise });

      return payload.delete({
        collection: "users",
        id: input,
      });
    }),
  }),
});

// Create the root router
export const payloadRouter = createTRPCRouter({
  payload: appRouter,
});

// Export type router type signature, not the router itself
export type AppRouter = typeof payloadRouter;
