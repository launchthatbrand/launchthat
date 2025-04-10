import "~/app/globals.css";

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import type { ThemeDefinition } from "@acme/theme-system";
import { ThemeProvider, ThemeSwitcher } from "@acme/theme-system";
import { cn } from "@acme/ui/lib/utils";

const themes: ThemeDefinition[] = [
  {
    id: "glass",
    name: "Glass",
    description: "Clean, minimal glass-like interface",
    preview: "/previews/static/glass.png",
    variables: {
      "--glass-background": "rgba(255, 255, 255, 0.8)",
      "--glass-blur": "8px",
      "--glass-border": "1px solid rgba(255, 255, 255, 0.2)",
      "--glass-shadow": "0 8px 32px rgba(0, 0, 0, 0.1)",
      "--glass-radius": "0.75rem",
      "--card": "0 0% 100%",
      "--card-foreground": "222.2 84% 4.9%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "222.2 84% 4.9%",
      "--primary": "221.2 83% 53.3%",
      "--primary-foreground": "210 40% 98%",
      "--secondary": "210 40% 96.1%",
      "--secondary-foreground": "222.2 47.4% 11.2%",
      "--radius": "var(--glass-radius)",
    },
  },
  {
    id: "brutalist",
    name: "Brutalist",
    description: "Bold, raw concrete-inspired design",
    preview: "/previews/static/brutalist.png",
    variables: {
      "--brutalist-background": "#f5f5f5",
      "--brutalist-foreground": "#202020",
      "--brutalist-border": "4px solid #202020",
      "--brutalist-shadow": "8px 8px 0px #202020",
      "--brutalist-radius": "0",
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 12%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "0 0% 12%",
      "--primary": "0 0% 12%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "0 0% 96%",
      "--secondary-foreground": "0 0% 12%",
      "--radius": "0",
    },
  },
  {
    id: "aggressive",
    name: "Aggressive",
    description: "High-energy, bold design with sharp angles",
    preview: "/previews/static/aggressive.png",
    variables: {
      "--aggressive-background": "#000000",
      "--aggressive-foreground": "#ff3e00",
      "--aggressive-accent": "#ff3e00",
      "--aggressive-border": "2px solid #ff3e00",
      "--aggressive-shadow": "0 0 10px rgba(255, 62, 0, 0.7)",
      "--aggressive-radius": "0",
      "--card": "0 0% 10%",
      "--card-foreground": "6 100% 50%",
      "--popover": "0 0% 0%",
      "--popover-foreground": "6 100% 50%",
      "--primary": "6 100% 50%",
      "--primary-foreground": "0 0% 0%",
      "--secondary": "0 0% 15%",
      "--secondary-foreground": "6 100% 50%",
      "--radius": "0",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, simple, and unobtrusive design",
    preview: "/previews/static/minimal.png",
    variables: {
      "--minimal-background": "#ffffff",
      "--minimal-foreground": "#333333",
      "--minimal-border": "1px solid #eeeeee",
      "--minimal-shadow": "0 1px 3px rgba(0, 0, 0, 0.05)",
      "--minimal-radius": "4px",
      "--card": "0 0% 100%",
      "--card-foreground": "0 0% 20%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "0 0% 20%",
      "--primary": "0 0% 20%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "0 0% 98%",
      "--secondary-foreground": "0 0% 20%",
      "--radius": "4px",
    },
  },
];

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
        <ThemeProvider
          config={{
            themes,
            defaultTheme: "system",
            defaultStyle: "glass",
            permissions: {
              baseTheme: "user",
              themeLibrary: "user",
              extensions: "user",
            },
          }}
          initialDebugMode={true}
        >
          <div className="relative flex min-h-screen flex-col">
            {children}
            <ThemeSwitcher position="bottom-right" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
