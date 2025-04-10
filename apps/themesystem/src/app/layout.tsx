import "~/app/globals.css";

import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";

import type { ThemeDefinition } from "@acme/theme-system";
import {
  BASE_THEME_KEY,
  ServerThemeProvider,
  THEME_STYLE_KEY,
  ThemeSwitcher,
} from "@acme/theme-system";
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

// Create a critical CSS string to prevent flash of unstyled content
const criticalCss = `
  /* Block rendering until custom properties are available */
  html.theme-initializing {
    display: none;
  }
  
  /* Fallback for browsers that disable JS */
  html.theme-initializing:not(:has(script[data-theme-init-executed])) {
    display: block;
  }
`;

// Create the theme initialization script content
function createThemeScript() {
  return `
    (function() {
      document.documentElement.classList.add('theme-initializing');
      
      try {
        console.log("[ThemeSystem] Starting theme initialization");
        
        // Mark the script as executed for browsers with JS disabled
        document.currentScript.setAttribute('data-theme-init-executed', 'true');
        
        // Utility functions
        function getCookie(name) {
          const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
          return match ? match[2] : null;
        }
        
        function getFromStorage(key, defaultValue) {
          try {
            // Try cookie first
            const cookieValue = getCookie(key);
            if (cookieValue) {
              console.log("[ThemeSystem] Found in cookie:", key, cookieValue);
              return cookieValue;
            }
            
            // Then try localStorage
            const localValue = localStorage.getItem(key);
            if (localValue) {
              console.log("[ThemeSystem] Found in localStorage:", key, localValue);
              return localValue;
            }
          } catch (e) {
            console.warn("[ThemeSystem] Error accessing storage:", e);
          }
          
          console.log("[ThemeSystem] Using default for", key, defaultValue);
          return defaultValue;
        }
        
        // Get theme preferences with defaults
        const baseTheme = getFromStorage("${BASE_THEME_KEY}", "system");
        const themeStyle = getFromStorage("${THEME_STYLE_KEY}", "glass");
        
        console.log("[ThemeSystem] Theme values:", { baseTheme, themeStyle });
        
        // Function to apply the theme
        function applyTheme() {
          const root = document.documentElement;
          
          // Apply base theme (light/dark)
          root.classList.remove('light', 'dark');
          
          let effectiveBaseTheme;
          if (baseTheme === "system") {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            effectiveBaseTheme = systemPrefersDark ? 'dark' : 'light';
            root.classList.add(effectiveBaseTheme);
            console.log("[ThemeSystem] Applied system preference:", effectiveBaseTheme);
          } else {
            root.classList.add(baseTheme);
            effectiveBaseTheme = baseTheme;
            console.log("[ThemeSystem] Applied explicit theme:", baseTheme);
          }
          
          // Apply theme style
          // First remove any existing theme classes
          const existingClasses = Array.from(root.classList);
          existingClasses.forEach(cls => {
            if (cls.startsWith("theme-")) {
              root.classList.remove(cls);
            }
          });
          
          // Known theme IDs to remove directly
          const knownThemes = ["glass", "brutalist", "aggressive", "minimal", "modern"];
          knownThemes.forEach(theme => {
            if (root.classList.contains(theme)) {
              root.classList.remove(theme);
            }
          });
          
          // Apply current theme style
          root.classList.add('theme-' + themeStyle);
          root.classList.add(themeStyle);
          console.log("[ThemeSystem] Applied theme style:", themeStyle);
          
          // Remove the initializing class to allow rendering
          root.classList.remove('theme-initializing');
          
          // Add a completed class for potential CSS targeting
          root.classList.add('theme-initialized');
          
          console.log("[ThemeSystem] Theme initialization complete");
        }
        
        // Apply the theme synchronously to avoid flash
        applyTheme();
        
        // Set up listener for system theme changes if needed
        if (baseTheme === "system") {
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(e.matches ? 'dark' : 'light');
            console.log("[ThemeSystem] System preference changed:", e.matches ? 'dark' : 'light');
          });
        }
      } catch (e) {
        console.error("[ThemeSystem] Error during theme initialization:", e);
        // Remove the initializing class to ensure content is shown even if there's an error
        document.documentElement.classList.remove('theme-initializing');
      }
    })();
  `;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical CSS to prevent flash */}
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />

        {/* Inline script for immediate theme application */}
        <script
          dangerouslySetInnerHTML={{
            __html: createThemeScript(),
          }}
        />

        {/* Fallback script with next/script for better reliability */}
        <Script
          id="theme-fallback"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (!document.documentElement.classList.contains('theme-initialized')) {
                console.log("[ThemeSystem] Fallback script running");
                ${createThemeScript()}
              }
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          GeistSans.variable,
        )}
      >
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
          }}
          initialDebugMode={true}
        >
          <div className="relative flex min-h-screen flex-col">
            {children}
            <ThemeSwitcher position="bottom-right" />
          </div>
        </ServerThemeProvider>
      </body>
    </html>
  );
}
