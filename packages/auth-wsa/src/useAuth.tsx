"use client";

import { useSignIn as clerkUseSignIn } from "@clerk/nextjs";

export function useSignIn() {
  return clerkUseSignIn();
}
