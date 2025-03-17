import type { TRPCContext } from "../trpc";
import { payloadRouter } from "../root";
import { createCallerFactory } from "../trpc";

/**
 * Helper function to create a Payload caller with a provided context
 * This simplifies creating callers when you already have a context object
 */
export const createCallerWithContext = (context: TRPCContext) => {
  // @ts-expect-error - Database types from different packages are incompatible but functionally equivalent
  const caller = createCallerFactory(payloadRouter);
  return caller(context);
};
