import "~/app/globals.css";
import "@/styles/print.css";
import "@/styles/print-templates.css";

import type { Metadata, Viewport } from "next";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import { cn } from "@acme/ui/lib/utils";
import { env } from "~/env";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "Resume Builder - Workforce Development",
  description: "Create professional resumes in minutes",
  openGraph: {
    title: "Create T3 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Create T3 Turbo",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
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
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
          inter.variable,
        )}
      >
        <div className="theme-provider light">
          <TRPCReactProvider>
            <div className="flex min-h-screen flex-col">
              <main className="flex-1 bg-[var(--workforce-light-gray)]">
                {children}
              </main>
            </div>
          </TRPCReactProvider>
        </div>
      </body>
    </html>
  );
}
