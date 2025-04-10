"use client";

import type { ReactNode } from "react";

import { ThemeToggle } from "@acme/ui/components/theme";
import BaseProvider from "@acme/ui/providers/BaseProvider";

import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";

// Enable debug mode in development
const initialDebugMode = env.NODE_ENV === "development";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <BaseProvider defaultTheme="glass" initialDebugMode={initialDebugMode}>
      <TRPCReactProvider>
        {children}
        <div className="absolute bottom-4 right-4">
          <ThemeToggle />
        </div>
      </TRPCReactProvider>
    </BaseProvider>
  );
}
