import "~/app/globals.css";

import type { Metadata, Viewport } from "next";
import { ThemeProvider, ThemeToggle } from "@acme/ui/components/theme";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Providers } from "./providers";
import { Roboto } from "next/font/google";
import StandardLayout from "@acme/ui/layout/StandardLayout";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "@acme/ui/components/sonner";
import { cn } from "@acme/ui/lib/utils";
import { env } from "~/env";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

//import "@acme/ui/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "WSA Learning Platform",
  description: "Learn at your own pace with WSA's online learning platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WSA App",
  },
  applicationName: "WSA Learning Platform",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "WSA Learning Platform",
    description: "Learn at your own pace with WSA's online learning platform",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "WSA",
  },
  twitter: {
    card: "summary_large_image",
    site: "@WSA",
    creator: "@WSA",
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
          roboto.variable,
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <Providers>
          <StandardLayout sidebar={props.sidebar} appName="WSA">
            {props.children}
          </StandardLayout>
        </Providers>
      </body>
    </html>
  );
}
