"use client";

import type { ReactNode } from "react";

import { ThemeProvider, ThemeToggle } from "@acme/ui/components/theme";
import BaseProvider from "@acme/ui/providers/BaseProvider";

import { TRPCReactProvider } from "~/trpc/react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <BaseProvider appName="Acme">
      {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
      <TRPCReactProvider>
        {children}
        <div className="absolute bottom-4 right-4">
          <ThemeToggle />
        </div>
        {/* <Toaster /> */}
      </TRPCReactProvider>
      {/* </ThemeProvider> */}
    </BaseProvider>
  );
}
