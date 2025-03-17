import {
  type AnyRouter,
  type inferRouterInputs,
  type inferRouterOutputs,
} from "@trpc/server";

import type { PayloadAppRouter } from "./root";

// Root router export
export { payloadRouter } from "./root";

// Core tRPC exports
export { createTRPCContext } from "./trpc";
export type { TRPCContext } from "./trpc";
export { createCallerFactory as createCaller } from "./trpc";

// Helper utilities
export { createCallerWithContext } from "./utils/createCallerWithContext";

// Type exports for consuming applications
export type { PayloadAppRouter };

// Create a type that satisfies AnyRouter for inference purposes
type PayloadRouterForInference = PayloadAppRouter & AnyRouter;

// Inference helpers for input/output types
export type RouterInputs = inferRouterInputs<PayloadRouterForInference>;
export type RouterOutputs = inferRouterOutputs<PayloadRouterForInference>;
