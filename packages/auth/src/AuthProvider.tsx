"use client";

import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
