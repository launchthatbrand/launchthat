"use client";

import { useEffect } from "react";

import { useTheme } from "./ThemeProvider";

/**
 * This component helps ensure theme persistence across refreshes
 * by initializing the theme from localStorage during client-side hydration
 */
export function ThemeInitializer() {
  const { setThemeStyle, config, debugMode } = useTheme();

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    try {
      // Get stored theme
      const storedTheme = localStorage.getItem("theme-style");

      if (storedTheme) {
        // Check if the stored theme is valid based on available themes
        const isValidTheme = config.themes.some((t) => t.id === storedTheme);

        if (isValidTheme) {
          if (debugMode) {
            console.log(
              `[ThemeInitializer] Setting persisted theme: ${storedTheme}`,
            );
          }

          // Apply the theme
          setThemeStyle(storedTheme);
        } else {
          if (debugMode) {
            console.warn(
              `[ThemeInitializer] Invalid stored theme: ${storedTheme}, using default`,
            );
          }

          // If invalid, store the default to prevent future issues
          localStorage.setItem("theme-style", config.defaultStyle);
        }
      } else if (debugMode) {
        console.log("[ThemeInitializer] No stored theme found");
      }
    } catch (error) {
      console.error("[ThemeInitializer] Error initializing theme:", error);
    }
  }, [config.defaultStyle, config.themes, debugMode, setThemeStyle]);

  // This component doesn't render anything
  return null;
}
