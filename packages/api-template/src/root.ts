import { appRouter as baseRouter, createTRPCRouter } from "@acme/api-base";

import { exampleRouter } from "./router/example";

/**
 * This is the primary router for your app.
 * It extends the base router and adds app-specific routes.
 */
export const appRouter = createTRPCRouter({
  // Re-export all routes from the base router
  ...baseRouter,

  // Add your app-specific routes here
  example: exampleRouter,
});

/**
 * Export type definition of the API
 */
export type AppRouter = typeof appRouter;
