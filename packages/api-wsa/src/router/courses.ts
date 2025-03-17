import type { TRPCRouterRecord } from "@trpc/server";

// import { z } from "zod";

import { desc } from "@acme/db-wsa";
// import { CreatePostSchema, Post } from "@acme/db-wsa/schema";
import { Post } from "@acme/db-wsa/schema";

import { publicProcedure } from "../trpc";
import { fetchWordPress } from "../utils/api";

// Define interface for WordPress course data
interface WordPressCoursesResponse {
  courses: {
    nodes: {
      id: string;
      title: string;
      slug: string;
      date: string;
      excerpt?: { rendered: string };
      featuredImage?: {
        node: {
          sourceUrl: string;
          altText: string;
        };
      };
    }[];
  };
}

export const courseRouter = {
  all: publicProcedure.query(async ({ ctx }) => {
    try {
      // GraphQL query to get courses from WordPress
      const query = `
        query GetCourses {
          courses(first: 10) {
            nodes {
              id
              title
              slug
              date
              excerpt {
                rendered
              }
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
            }
          }
        }
      `;

      // Fetch data from WordPress
      const wpData = await fetchWordPress<WordPressCoursesResponse>(query);

      // If no WordPress data, fall back to database
      if (!wpData?.courses.nodes) {
        console.log("Falling back to database for courses");
        return ctx.db.query.Post.findMany({
          orderBy: desc(Post.id),
          limit: 10,
        });
      }

      return wpData.courses.nodes.map((course) => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        createdAt: new Date(course.date),
        excerpt: course.excerpt?.rendered ?? "",
        featuredImage: course.featuredImage?.node.sourceUrl ?? null,
      }));
    } catch (error) {
      console.error("Error fetching WordPress courses:", error);
      // Fallback to database on error
      return ctx.db.query.Post.findMany({
        orderBy: desc(Post.id),
        limit: 10,
      });
    }
  }),

  // byId: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(({ ctx, input }) => {
  //     // return ctx.db
  //     //   .select()
  //     //   .from(schema.post)
  //     //   .where(eq(schema.post.id, input.id));

  //     return ctx.db.query.Post.findFirst({
  //       where: eq(Post.id, input.id),
  //     });
  //   }),

  // create: protectedProcedure
  //   .input(CreatePostSchema)
  //   .mutation(({ ctx, input }) => {
  //     return ctx.db.insert(Post).values(input);
  //   }),

  // delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
  //   return ctx.db.delete(Post).where(eq(Post.id, input));
  // }),
} satisfies TRPCRouterRecord;
