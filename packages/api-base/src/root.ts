import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const baseRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
});

// export type definition of API
export type BaseRouter = typeof baseRouter;
