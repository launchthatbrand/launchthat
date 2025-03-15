import { appRouter as baseRouter } from "@acme/api";
import { createTRPCRouter } from "./trpc";
import { payloadExtensionsRouter } from "./router/payload-extensions";
import { appRouter as payloadRouter } from "@acme/payload-cms/trpc";

/**
 * This is the primary router for your PayloadCMS app.
 * It extends the base router and adds PayloadCMS routes.
 */
export const appRouter = createTRPCRouter({
  // Re-export all routes from the base router
  ...baseRouter,

  // Add PayloadCMS routes under the 'payload' namespace
  payload: payloadRouter.payload,

  // Add additional PayloadCMS-specific extensions
  payloadExt: payloadExtensionsRouter,
} as any);

/**
 * Export type definition of the API
 */
export type AppRouter = typeof appRouter;
