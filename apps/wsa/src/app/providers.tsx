"use client";

import BaseProvider from "@acme/ui/providers/BaseProvider";
import PWAInstallButton from "./_components/PWAInstallButton";
import type { ReactNode } from "react";
import { TRPCReactProvider } from "~/trpc/react";
import { ThemeToggle } from "@acme/ui/components/theme";
import { registerServiceWorker } from "./sw-register";
import { useEffect } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // Register service worker on component mount
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <BaseProvider>
      <TRPCReactProvider>
        {children}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <PWAInstallButton />
          <ThemeToggle />
        </div>
      </TRPCReactProvider>
    </BaseProvider>
  );
}
