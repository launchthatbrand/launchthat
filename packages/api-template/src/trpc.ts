import type { createTRPCContext as createBaseTRPCContext } from "@acme/api-base";

/**
 * Create an extended tRPC context that includes both the base context and any app-specific context.
 * This is where you would add app-specific context like custom authentication, database connections, etc.
 */
export const createTRPCContext = async (
  opts: Parameters<typeof createBaseTRPCContext>[0],
) => {
  // First get the base context
  const baseContext = await import("@acme/api-base").then((mod) =>
    mod.createTRPCContext(opts),
  );

  // Then extend it with app-specific context
  return {
    ...baseContext,
    // Add your app-specific context here
    // For example:
    // appSpecificDb: yourAppDatabase,
    // appSpecificServices: yourAppServices,
  };
};
