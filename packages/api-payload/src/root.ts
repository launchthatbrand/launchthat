import { payloadAppRouter } from "./router";
import { createTRPCRouter } from "./trpc";

// Create the combined router
export const payloadRouter = createTRPCRouter({
  payload: payloadAppRouter,
});

// Export router type signature
export type PayloadAppRouter = typeof payloadRouter;
