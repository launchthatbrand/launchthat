import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./root";
import { appRouter } from "./root";
import { createTRPCContext } from "./trpc";

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 */
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 */
type RouterOutputs = inferRouterOutputs<AppRouter>;

// Re-export everything from api-base
export * from "@acme/api";

// Export app-specific router and context
export { appRouter, createTRPCContext };
export type { AppRouter, RouterInputs, RouterOutputs };
