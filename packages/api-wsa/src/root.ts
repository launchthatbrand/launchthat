import { payloadAppRouter } from "@acme/api-payload";
import { createTRPCRouter } from "@acme/api/trpc";

import { authRouter } from "./router/auth";
import { courseRouter } from "./router/courses";
import { postRouter } from "./router/post";

// Create WSA router with all components
export const wsaAppRouter = createTRPCRouter({
  // WSA-specific functionality
  auth: authRouter,
  post: postRouter,
  course: courseRouter,

  // Add Payload functionality with proper typing
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  payload: payloadAppRouter.payload,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  payloadExt: payloadAppRouter.payloadExt,
});

// Export type definition of API
export type WsaAppRouter = typeof wsaAppRouter;
