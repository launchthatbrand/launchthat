import "~/app/globals.css";
import "@/styles/print.css";

import type { Metadata, Viewport } from "next";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import StandardLayout from "@acme/ui/layout/StandardLayout";
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
  title: "Resume Builder",
  description: "Build and customize your resume",
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
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
        <Providers>
          <StandardLayout sidebar={props.sidebar} appName="Resume Builder">
            {props.children}
          </StandardLayout>
        </Providers>
      </body>
    </html>
  );
}
