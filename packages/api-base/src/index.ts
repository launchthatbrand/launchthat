import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { BaseRouter } from "./root";
import { baseRouter } from "./root";
import { createCallerFactory, createTRPCContext } from "./trpc";

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(context);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
// Not creating a default caller anymore - let implementing packages create their own
// with proper database type
export const createCaller = createCallerFactory(baseRouter);

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<BaseRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<BaseRouter>;

export { createTRPCContext, baseRouter, createCallerFactory };
export type { BaseRouter, RouterInputs, RouterOutputs };
