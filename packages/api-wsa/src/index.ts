import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { WsaAppRouter } from "./root";
import type { TRPCContext } from "./trpc";
import { wsaAppRouter } from "./root";
import { createCallerFactory, createTRPCContext } from "./trpc";

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller({...context});
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
// Type-safe caller factory that uses the WsaAppRouter with proper context
// @ts-expect-error - Database types from different packages are incompatible but functionally equivalent
const createCaller = createCallerFactory(wsaAppRouter);

/**
 * Helper function to create a caller with the proper context
 * @param context The TRPC context to use
 */
const createCallerWithContext = (context: TRPCContext) => {
  return createCaller(context);
};

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<WsaAppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<WsaAppRouter>;

export {
  createTRPCContext,
  wsaAppRouter,
  createCaller,
  createCallerWithContext,
};
export type { WsaAppRouter, RouterInputs, RouterOutputs, TRPCContext };
