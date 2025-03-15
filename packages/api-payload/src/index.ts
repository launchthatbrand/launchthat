import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./root";
import { appRouter } from "./root";
import { createTRPCContext } from "./trpc";

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['payload']['users']['find']
 */
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type UsersOutput = RouterOutputs['payload']['users']['find']
 */
type RouterOutputs = inferRouterOutputs<AppRouter>;

// Re-export everything from api-base that's not overridden
export * from "@acme/api";

// Export app-specific router and context
export { appRouter, createTRPCContext };
export type { AppRouter, RouterInputs, RouterOutputs };
