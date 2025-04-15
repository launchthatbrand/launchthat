import "~/app/globals.css";
import "@/styles/print.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { ThemeDebugPanel } from "@acme/ui/components/theme-debug-panel";
import StandardLayout from "@acme/ui/layout/StandardLayout";
import { cn } from "@acme/ui/lib/utils";

import { env } from "~/env";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Only show theme debug panel in development
const showDebugPanel = env.NODE_ENV === "development";

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

export default function RootLayout(props: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
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
        {" "}
        <Providers>
          <StandardLayout
            sidebar={props.sidebar}
            appName="RepoReader"
            className="items-center justify-center"
          >
            {props.children}
          </StandardLayout>
          {showDebugPanel && <ThemeDebugPanel />}
        </Providers>
      </body>
    </html>
  );
}
