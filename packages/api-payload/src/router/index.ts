import { createTRPCRouter } from "../trpc";
import { usersRouter } from "./users";

// Create the router with sub-routers
export const payloadAppRouter = createTRPCRouter({
  users: usersRouter,
  // Add additional routers as needed
});

// Export the router type
export type PayloadAppRouter = typeof payloadAppRouter;
