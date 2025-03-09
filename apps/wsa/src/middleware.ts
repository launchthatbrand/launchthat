import { clerkMiddleware } from "@clerk/nextjs/server";

// Use Clerk's middleware directly without modification
export default clerkMiddleware();

export const config = {
  matcher: ["/((?!_next|api|trpc|.*\\..*).*)"],
};
