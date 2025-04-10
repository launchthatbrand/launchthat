"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

import { AuthProvider } from "@acme/auth-wsa/AuthProvider";

import type { ThemeStyle } from "../themes/types";
import { SidebarProvider } from "../components/sidebar";
import { Toaster } from "../components/sonner";
import {
  getAllThemeClassNames,
  getThemeClassName,
  themes,
} from "../themes/types";

const THEME_STORAGE_KEY = "theme-style";
const APP_THEMES_STORAGE_KEY = "app-themes";

// Enhanced Theme Context
interface ThemeContextType {
  // Global theme
  themeStyle: ThemeStyle;
  setThemeStyle: (style: ThemeStyle) => void;

  // App-specific themes
  appThemes: Record<string, unknown>;
  setAppTheme: <T>(appId: string, theme: T) => void;
  getAppTheme: <T>(appId: string) => T | undefined;

  // Debug features
  debugMode: boolean;
  setDebugMode: (enabled: boolean) => void;
  logThemeState: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a BaseProvider");
  }
  return context;
}

function ThemeStyleManager({
  themeStyle,
  debugMode,
}: {
  themeStyle: ThemeStyle;
  debugMode: boolean;
}) {
  useEffect(() => {
    const root = document.documentElement;
    const themeClasses = getAllThemeClassNames();

    // Add transition classes before changing themes
    root.classList.add("transition-all", "duration-300");

    // First add the base theme class
    root.classList.add("theme-base");

    // Remove all specific theme classes
    themeClasses.forEach((cls) => root.classList.remove(cls));

    // Add new theme class
    const themeClassName = getThemeClassName(themeStyle);
    root.classList.add(themeClassName);

    // Store theme choice in localStorage
    localStorage.setItem(THEME_STORAGE_KEY, themeStyle);

    if (debugMode) {
      console.log(`[Theme Debug] Applied global theme: ${themeStyle}`);
      console.log(`[Theme Debug] Applied class: ${themeClassName}`);
    }

    // Cleanup function to remove base theme when component unmounts
    return () => {
      root.classList.remove("theme-base");
    };
  }, [themeStyle, debugMode]);

  return null;
}

interface BaseProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeStyle;
  initialDebugMode?: boolean;
}

export default function BaseProvider({
  children,
  defaultTheme = "glass",
  initialDebugMode = false,
}: BaseProviderProps) {
  // Initialize global theme state
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>(() => {
    // Only run on client-side with proper error handling
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(
          THEME_STORAGE_KEY,
        ) as ThemeStyle | null;
        return stored ?? defaultTheme;
      } catch (error) {
        console.error("Failed to access localStorage for theme:", error);
        return defaultTheme;
      }
    }
    return defaultTheme;
  });

  // Initialize app-specific themes state
  const [appThemes, setAppThemes] = useState<Record<string, unknown>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(APP_THEMES_STORAGE_KEY);
        return stored ? JSON.parse(stored) : ({} as Record<string, unknown>);
      } catch (error) {
        console.error("Failed to parse stored app themes:", error);
        return {} as Record<string, unknown>;
      }
    }
    return {} as Record<string, unknown>;
  });

  // Debug mode
  const [debugMode, setDebugMode] = useState(initialDebugMode);

  // Set app-specific theme with error handling
  const setAppTheme = useCallback(
    <T,>(appId: string, theme: T) => {
      setAppThemes((prev) => {
        const newThemes = {
          ...prev,
          [appId]: theme,
        };

        // Store in localStorage
        try {
          localStorage.setItem(
            APP_THEMES_STORAGE_KEY,
            JSON.stringify(newThemes),
          );
        } catch (error) {
          console.error("Failed to store app themes:", error);
        }

        return newThemes;
      });

      if (debugMode) {
        console.log(`[Theme Debug] ${appId} theme updated:`, theme);
      }
    },
    [debugMode],
  );

  // Get app-specific theme
  const getAppTheme = <T,>(appId: string): T | undefined => {
    const theme = appThemes[appId as keyof typeof appThemes];
    return theme ? (theme as T) : undefined;
  };

  // Debug logging
  const logThemeState = () => {
    console.group("[Theme Debug] Current theme state");
    console.log("Global theme:", themeStyle);
    console.log("App themes:", { ...appThemes });

    // Log CSS Variables on root
    if (typeof window !== "undefined") {
      const computedStyle = window.getComputedStyle(document.documentElement);
      const cssVars = Array.from(computedStyle).filter((prop) =>
        prop.startsWith("--"),
      );
      const cssVarValues = {};
      cssVars.forEach((prop) => {
        cssVarValues[prop] = computedStyle.getPropertyValue(prop);
      });
      console.log("CSS Variables:", cssVarValues);
    }

    console.groupEnd();
  };

  // Context value
  const value: ThemeContextType = {
    themeStyle,
    setThemeStyle,
    appThemes,
    setAppTheme,
    getAppTheme,
    debugMode,
    setDebugMode,
    logThemeState,
  };

  return (
    <AuthProvider>
      <SidebarProvider>
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          themes={themes.map((theme) => theme.value)}
          enableSystem
        >
          <ThemeContext.Provider value={value}>
            <ThemeStyleManager themeStyle={themeStyle} debugMode={debugMode} />
            {children}
            <Toaster />
          </ThemeContext.Provider>
        </NextThemeProvider>
      </SidebarProvider>
    </AuthProvider>
  );
}
