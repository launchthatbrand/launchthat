import type { initTRPC } from "@trpc/server";
import type { Payload } from "payload";

import type { Session } from "@acme/auth";
import {
  protectedProcedure as baseProtectedProcedure,
  publicProcedure as basePublicProcedure,
  createCallerFactory as createBaseCallerFactory,
  createTRPCRouter as createBaseTRPCRouter,
} from "@acme/api/trpc";

/**
 * Create a TRPC context with Payload specific settings
 */
export const createTRPCContext = async (opts: {
  headers: Headers;
  session: Session | null;
  payload?: Payload;
}) => {
  // We create a context with payload and other required properties
  const baseContext = {
    headers: opts.headers,
    session: opts.session,
    payload: opts.payload,
    // Add these properties to satisfy the base context
    db: null as any, // Placeholder, we'll use Payload instead
    token: opts.headers.get("Authorization") ?? null,
  };

  return baseContext;
};

// Export the context type
export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

// Create tRPC router with Payload context
export const createTRPCRouter = createBaseTRPCRouter;

// Override procedures to use our context type
export const publicProcedure = basePublicProcedure.use(async (opts) => {
  const ctx = opts.ctx as unknown as TRPCContext;
  return opts.next({
    ctx: {
      ...ctx,
    },
  });
});

export const protectedProcedure = baseProtectedProcedure.use(async (opts) => {
  const ctx = opts.ctx as unknown as TRPCContext;
  return opts.next({
    ctx: {
      ...ctx,
    },
  });
});

/**
 * Create a caller factory specifically typed for Payload context
 */
export const createCallerFactory = <
  Router extends ReturnType<typeof initTRPC.create>["router"],
>(
  router: Router,
) => {
  // Use ts-expect-error to handle type incompatibility
  // @ts-expect-error - We're handling context differently but the structure is compatible
  return createBaseCallerFactory(router);
};
