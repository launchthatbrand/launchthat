import "~/app/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { ServerThemeProvider } from "@acme/theme-system";
import type { ThemeDefinition } from "@acme/theme-system";
import { cn } from "@acme/ui/lib/utils";

// Theme definitions (in a specific order)
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

// Sample theme extensions for demonstration
const themeExtensions = {
  // Resume builder extension with different templates
  "resume-builder": {
    id: "resume-builder",
    name: "Resume Builder",
    description: "Theme templates for different resume styles",
    defaultTemplate: "modern",
    templates: [
      {
        id: "modern",
        name: "Modern",
        description: "Clean, professional layout with modern typography",
        variables: {
          "--resume-heading-color": "var(--primary)",
          "--resume-section-spacing": "1.5rem",
          "--resume-border-color": "var(--border)",
          "--resume-heading-font": "var(--font-sans)",
          "--resume-accent-color": "#0284c7",
        },
      },
      {
        id: "classic",
        name: "Classic",
        description:
          "Traditional resume layout widely recognized in most industries",
        variables: {
          "--resume-heading-color": "#333",
          "--resume-section-spacing": "1.25rem",
          "--resume-border-color": "#ddd",
          "--resume-heading-font": "serif",
          "--resume-accent-color": "#555",
        },
      },
      {
        id: "creative",
        name: "Creative",
        description: "Stand-out design for creative professionals",
        variables: {
          "--resume-heading-color": "#ff3e00",
          "--resume-section-spacing": "2rem",
          "--resume-border-color": "#ff3e00",
          "--resume-heading-font": "var(--font-sans)",
          "--resume-accent-color": "#ff3e00",
        },
      },
    ],
  },

  // Dashboard extension with different layouts
  dashboard: {
    id: "dashboard",
    name: "Dashboard",
    description: "Styles for data dashboards and admin panels",
    defaultTemplate: "analytical",
    templates: [
      {
        id: "analytical",
        name: "Analytical",
        description: "Data-focused dashboard with clean information display",
        variables: {
          "--dashboard-card-bg": "white",
          "--dashboard-grid-gap": "1rem",
          "--dashboard-border-radius": "0.5rem",
          "--dashboard-shadow": "0 4px 6px rgba(0,0,0,0.05)",
          "--dashboard-chart-colors": "#3b82f6,#10b981,#f59e0b,#ef4444",
        },
      },
      {
        id: "compact",
        name: "Compact",
        description: "Space-efficient dashboard for dense information",
        variables: {
          "--dashboard-card-bg": "#fafafa",
          "--dashboard-grid-gap": "0.5rem",
          "--dashboard-border-radius": "0.25rem",
          "--dashboard-shadow": "none",
          "--dashboard-chart-colors": "#1e40af,#065f46,#b45309,#b91c1c",
        },
      },
    ],
  },
};

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
    <ServerThemeProvider
      config={{
        themes,
        defaultTheme: "system",
        defaultStyle: "glass",
        permissions: {
          baseTheme: "user",
          themeLibrary: "user",
          extensions: "user",
        },
        extensions: themeExtensions,
      }}
      initialDebugMode={true}
      showThemeSwitcher={true}
      themeSwitcherPosition="bottom-right"
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Theme scripts are automatically injected by ServerThemeProvider */}
        </head>
        <body
          className={cn(
            "min-h-screen bg-background antialiased",
            GeistSans.variable,
          )}
        >
          <div className="relative flex min-h-screen flex-col">{children}</div>
        </body>
      </html>
    </ServerThemeProvider>
  );
}
