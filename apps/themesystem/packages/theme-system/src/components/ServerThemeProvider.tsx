"use server";

import {
  APP_EXTENSION_THEMES_KEY,
  BASE_THEME_KEY,
  BaseTheme,
  THEME_STYLE_KEY,
} from "./theme-constants";
import { ThemeConfig, UnifiedThemeProvider } from "./UnifiedThemeProvider";

import type { ReactNode } from "react";
import Script from "next/script";
import { cookies } from "next/headers";

// Helper to parse JSON safely
const parseJson = (value: string | null) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return null;
  }
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

// ServerThemeProvider props
export interface ServerThemeProviderProps {
  children: ReactNode;
  config: ThemeConfig;
  userRole?: string;
  initialDebugMode?: boolean;
}

// Component for injecting theme-related scripts and styles
function ThemeInjector() {
  return (
    <>
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
    </>
  );
}

/**
 * ServerThemeProvider - A server component that reads cookies server-side
 *
 * This component should be used in app/ directory layouts or pages
 * to enable server-side cookie reading for theme preferences.
 */
export async function ServerThemeProvider({
  children,
  config,
  userRole = "user",
  initialDebugMode = false,
}: ServerThemeProviderProps) {
  // Read cookies on the server side
  const cookieStore = cookies();

  // Get initial values from cookies
  const initialBaseTheme = cookieStore.get(BASE_THEME_KEY)?.value as
    | BaseTheme
    | undefined;
  const initialThemeStyle =
    cookieStore.get(THEME_STYLE_KEY)?.value || undefined;

  // Parse extensions from cookie if it exists
  const extensionsRaw =
    cookieStore.get(APP_EXTENSION_THEMES_KEY)?.value || null;
  const initialExtensions = parseJson(extensionsRaw);

  // Pass these initial values to the unified theme provider
  return (
    <>
      <ThemeInjector />
      <UnifiedThemeProvider
        children={children}
        config={config}
        userRole={userRole}
        initialDebugMode={initialDebugMode}
        serverBaseTheme={initialBaseTheme}
        serverThemeStyle={initialThemeStyle}
        serverExtensions={initialExtensions}
      />
    </>
  );
}
