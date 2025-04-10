"use client";

import type { ReactNode } from "react";

import { ThemeToggle } from "@acme/theme-system";
import BaseProvider from "@acme/ui/providers/BaseProvider";

import { TRPCReactProvider } from "~/trpc/react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <BaseProvider>
      <TRPCReactProvider>
        {children}
        <div className="absolute bottom-4 right-4">
          <ThemeToggle />
        </div>
      </TRPCReactProvider>
    </BaseProvider>
  );
}
