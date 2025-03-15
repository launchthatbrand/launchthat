import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "@acme/api-base";

/**
 * Example router with a mix of public and protected procedures.
 * Replace or extend this with your app-specific routes.
 */
export const exampleRouter = {
  /**
   * Public procedure that returns a greeting
   */
  hello: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? "world"}!`,
        timestamp: new Date(),
      };
    }),

  /**
   * Protected procedure that requires authentication
   */
  secret: protectedProcedure.query(({ ctx }) => {
    return {
      message: `This is a secret message for ${ctx.session.user.name}!`,
      timestamp: new Date(),
    };
  }),

  /**
   * Protected procedure with input validation
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      // Here you would typically update something in your database
      return {
        success: true,
        message: `Updated resource ${input.id}`,
        user: ctx.session.user.name,
        timestamp: new Date(),
      };
    }),
} satisfies TRPCRouterRecord;
