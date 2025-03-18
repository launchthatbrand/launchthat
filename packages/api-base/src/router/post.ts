import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@acme/db";
import { CreatePostSchema, Post } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

// Define a helper type for database operations that will be needed
// This helps ensure our router works with any database implementation
interface DbWithPostOperations {
  query: {
    Post: {
      findMany: (args: { orderBy: unknown; limit: number }) => unknown;
      findFirst: (args: { where: unknown }) => unknown;
    };
  };
  insert: (table: unknown) => { values: (data: unknown) => unknown };
  delete: (table: unknown) => { where: (condition: unknown) => unknown };
}

// Helper to check if db is available
const ensureDb = (db: unknown): DbWithPostOperations => {
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database not available for this operation",
    });
  }
  return db as DbWithPostOperations;
};

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
    const db = ensureDb(ctx.db);
    return db.query.Post.findMany({
      orderBy: desc(Post.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      // return ctx.db
      //   .select()
      //   .from(schema.post)
      //   .where(eq(schema.post.id, input.id));
      const db = ensureDb(ctx.db);
      return db.query.Post.findFirst({
        where: eq(Post.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(CreatePostSchema)
    .mutation(({ ctx, input }) => {
      const db = ensureDb(ctx.db);
      return db.insert(Post).values(input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    const db = ensureDb(ctx.db);
    return db.delete(Post).where(eq(Post.id, input));
  }),

  test: publicProcedure.query(({ ctx }) => {
    const db = ensureDb(ctx.db);
    return db.query.Post.findMany({
      orderBy: desc(Post.id),
      limit: 10,
    });
  }),
} satisfies TRPCRouterRecord;
