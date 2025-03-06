"use client";

import { useState } from "react";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ThemeProvider } from "next-themes";

import { AuthProvider } from "@acme/auth";
import { SidebarProvider } from "@acme/ui/components/sidebar";
import { Toaster } from "@acme/ui/components/sonner";

// Move the window ethereum type declaration to a separate types file
declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params: unknown[];
      }) => Promise<unknown>;
    };
  }
}

interface BaseProviderProps {
  children: React.ReactNode;
  onSignIn?: (session: SIWESession | undefined) => void;
  appName: string;
  appDescription?: string;
  appUrl?: string;
  appIcon?: string;
}

// function ConnectHandler({ onConnect }: { onConnect: () => void }) {
//   const { signIn } = useSIWE();
//   const { setOpen } = useModal();

//   useEffect(() => {
//     void signIn();
//     onConnect();
//     setOpen(false);
//   }, [signIn, onConnect, setOpen]);

//   return null;
// }

export default function BaseProvider({
  children,
  onSignIn,
  appName,
  appDescription,
  appUrl,
  appIcon,
}: BaseProviderProps) {
  const [shouldSignIn, setShouldSignIn] = useState(false);

  return (
    <AuthProvider>
      <SidebarProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </SidebarProvider>
      <Toaster />
    </AuthProvider>
  );
}
