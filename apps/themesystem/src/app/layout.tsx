import "~/app/globals.css";

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { cn } from "@acme/ui/lib/utils";

import { ThemeToggle } from "~/components/ThemeToggle";
import { ThemeProvider } from "~/providers/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Theme System",
    template: `%s | Theme System`,
  },
  description: "Theme System Demo",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          GeistSans.variable,
        )}
      >
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            {children}
            <ThemeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
