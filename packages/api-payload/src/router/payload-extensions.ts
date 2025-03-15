import { protectedProcedure, publicProcedure } from "../trpc";

import { z } from "zod";

/**
 * Additional PayloadCMS functionality that extends the core PayloadCMS API.
 * Add any custom PayloadCMS operations here.
 */
export const payloadExtensionsRouter = {
  /**
   * Get the current user from both auth systems
   */
  me: publicProcedure.query(({ ctx }) => {
    // Get user from base auth
    const user = ctx.session?.user;

    if (!user) {
      return { isLoggedIn: false, user: null };
    }

    return {
      isLoggedIn: true,
      user,
      authType: "base",
    };
  }),

  /**
   * Check if a user has access to a specific resource
   */
  checkAccess: protectedProcedure
    .input(
      z.object({
        resource: z.string(),
        action: z.enum(["read", "create", "update", "delete"]),
      }),
    )
    .query(({ ctx, input }) => {
      const user = ctx.session.user;

      if (!user) {
        return { hasAccess: false };
      }

      // Simplified access check - in a real app, you'd check against your permissions system
      const isAdmin = user.email?.includes("admin");

      return {
        hasAccess: isAdmin || input.action === "read",
        resource: input.resource,
        action: input.action,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    }),
};
