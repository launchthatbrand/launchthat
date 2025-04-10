"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTheme as useNextTheme } from "next-themes";

import type { ThemeDefinition } from "../types";

// Storage keys
const THEME_STYLE_KEY = "theme-style";
const BASE_THEME_KEY = "base-theme";
const APP_EXTENSION_THEMES_KEY = "app-extension-themes";

// Types
export type BaseTheme = "light" | "dark" | "system";
export type PermissionLevel = "user" | "admin" | "none";

export interface ThemeSystemPermissions {
  baseTheme: PermissionLevel;
  themeLibrary: PermissionLevel;
  extensions: PermissionLevel;
}

export interface ThemeSystemConfig {
  baseThemes: BaseTheme[];
  themes: ThemeDefinition[];
  extensions: Record<string, ThemeExtension>;
  permissions: ThemeSystemPermissions;
  defaultTheme: BaseTheme;
  defaultStyle: string;
}

export interface ThemeExtensionTemplate {
  id: string;
  name: string;
  preview: string;
  description?: string;
}

export interface ThemeExtension {
  id: string;
  name: string;
  templates: ThemeExtensionTemplate[];
  defaultTemplate?: string;
}

// Context type
interface ThemeContextType {
  // Base theme (light/dark)
  baseTheme: BaseTheme;
  setBaseTheme: (theme: BaseTheme) => void;
  isDarkMode: boolean;

  // Theme style
  themeStyle: string;
  setThemeStyle: (style: string) => void;
  availableThemes: ThemeDefinition[];

  // Extensions system
  extensions: Record<string, unknown>;
  getExtension: <T>(extensionId: string) => T | undefined;
  setExtensionTheme: <T>(extensionId: string, theme: T) => void;

  // Permissions
  canChangeBaseTheme: boolean;
  canChangeThemeStyle: boolean;
  canUseExtensions: boolean;

  // Debug/utility
  config: ThemeSystemConfig;
  debugMode: boolean;
  setDebugMode: (enabled: boolean) => void;
  logThemeState: () => void;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default config
const defaultConfig: ThemeSystemConfig = {
  baseThemes: ["light", "dark", "system"],
  themes: [],
  extensions: {},
  permissions: {
    baseTheme: "user",
    themeLibrary: "user",
    extensions: "user",
  },
  defaultTheme: "system",
  defaultStyle: "default",
};

// Theme state management component
function ThemeStateManager({
  themeStyle,
  baseTheme,
  children,
  debugMode,
}: {
  themeStyle: string;
  baseTheme: BaseTheme;
  children: ReactNode;
  debugMode: boolean;
}) {
  // Effect to handle theme style (aesthetic theme)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    if (debugMode) {
      console.log(`[ThemeSystem] Applying theme style: ${themeStyle}`);
      console.log(
        `[ThemeSystem] Current classes on HTML:`,
        Array.from(root.classList),
      );
    }

    // Skip if themeStyle is empty or undefined
    if (!themeStyle) {
      console.warn("[ThemeSystem] Attempted to apply empty theme style");
      return;
    }

    // Get a fixed list of all known theme IDs - expand this as needed
    const allThemeIds = [
      "glass",
      "brutalist",
      "aggressive",
      "minimal",
      "modern",
      "template",
      "system",
    ];

    // Create a static copy of the classList to avoid modification issues during iteration
    const currentClasses = Array.from(root.classList);

    // First, check for any theme-* classes
    for (const cls of currentClasses) {
      if (cls.startsWith("theme-")) {
        if (debugMode) {
          console.log(`[ThemeSystem] Removing theme class: ${cls}`);
        }
        root.classList.remove(cls);
      }
    }

    // Then remove any direct theme classes (glass, brutalist, etc.)
    for (const themeId of allThemeIds) {
      if (root.classList.contains(themeId)) {
        if (debugMode) {
          console.log(`[ThemeSystem] Removing direct theme class: ${themeId}`);
        }
        root.classList.remove(themeId);
      }
    }

    // Add the current theme class
    root.classList.add(`theme-${themeStyle}`);
    root.classList.add(themeStyle);

    // Store in localStorage
    localStorage.setItem(THEME_STYLE_KEY, themeStyle);
    if (debugMode) {
      console.log(
        `[ThemeSystem] Saved theme style to localStorage: ${themeStyle}`,
      );
    }

    if (debugMode) {
      console.log(`[ThemeSystem] Applied theme: ${themeStyle}`);
      console.log(
        `[ThemeSystem] Updated classes on HTML:`,
        Array.from(root.classList),
      );
    }
  }, [themeStyle, debugMode]);

  // Effect to handle base theme (light/dark mode)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    // Remove existing theme classes
    ["light", "dark"].forEach((cls) => {
      root.classList.remove(cls);
    });

    if (debugMode) {
      console.log(`[ThemeSystem] Setting base theme: ${baseTheme}`);
    }

    // Add the appropriate class based on the theme
    if (baseTheme === "light") {
      root.classList.add("light");
      if (debugMode) console.log("[ThemeSystem] Added light class to HTML");
    } else if (baseTheme === "dark") {
      root.classList.add("dark");
      if (debugMode) console.log("[ThemeSystem] Added dark class to HTML");
    } else if (baseTheme === "system") {
      // For system theme, check the system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.add(prefersDark ? "dark" : "light");
      if (debugMode)
        console.log(
          `[ThemeSystem] System preference detected: ${prefersDark ? "dark" : "light"}`,
        );

      // Add listener for system preference changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.remove("light", "dark");
        root.classList.add(e.matches ? "dark" : "light");
        if (debugMode)
          console.log(
            `[ThemeSystem] System preference changed to: ${e.matches ? "dark" : "light"}`,
          );
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    // Store the base theme
    localStorage.setItem(BASE_THEME_KEY, baseTheme);
  }, [baseTheme, debugMode]);

  return <>{children}</>;
}

// Helper to determine if user has permission
function hasPermission(level: PermissionLevel, userRole = "user") {
  if (level === "none") return false;
  if (level === "user") return true;
  if (level === "admin") return userRole === "admin";
  return false;
}

// ThemeProvider props
export interface ThemeProviderProps {
  children: ReactNode;
  config?: Partial<ThemeSystemConfig>;
  userRole?: string;
  initialDebugMode?: boolean;
}

// Main ThemeProvider component
export function ThemeProvider({
  children,
  config = {},
  userRole = "user",
  initialDebugMode = false,
}: ThemeProviderProps) {
  // Merge provided config with default config
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config],
  );

  // Use next-themes to manage light/dark mode
  const { theme, setTheme } = useNextTheme();

  // Get the stored theme style
  const initialThemeStyle = useMemo(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_STYLE_KEY);

      if (stored) {
        // Check if the stored theme is valid
        const isValid = mergedConfig.themes.some((t) => t.id === stored);

        if (isValid) {
          if (initialDebugMode) {
            console.log(`[ThemeSystem] Loaded stored theme: ${stored}`);
          }
          return stored;
        } else {
          if (initialDebugMode) {
            console.warn(
              `[ThemeSystem] Stored theme "${stored}" is not valid, falling back to default`,
            );
          }
        }
      } else {
        if (initialDebugMode) {
          console.log(
            `[ThemeSystem] No stored theme found, using default: ${mergedConfig.defaultStyle}`,
          );
        }
      }
    }
    return mergedConfig.defaultStyle;
  }, [mergedConfig.defaultStyle, mergedConfig.themes, initialDebugMode]);

  // Initialize the base theme
  const initialBaseTheme = useMemo(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(BASE_THEME_KEY) as BaseTheme | null;
      if (stored && ["light", "dark", "system"].includes(stored)) {
        return stored as BaseTheme;
      }
    }
    return (theme as BaseTheme) || mergedConfig.defaultTheme;
  }, [mergedConfig.defaultTheme, theme]);

  // Theme style state (glass, brutalist, etc.)
  const [themeStyle, setThemeStyleState] = useState<string>(initialThemeStyle);

  // Base theme state (light, dark, system)
  const [baseTheme, setBaseThemeState] = useState<BaseTheme>(initialBaseTheme);

  // Extension themes state
  const [extensions, setExtensions] = useState<Record<string, unknown>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(APP_EXTENSION_THEMES_KEY);
        return stored ? JSON.parse(stored) : {};
      } catch (error) {
        console.error("Failed to parse stored extension themes:", error);
        return {};
      }
    }
    return {};
  });

  // Debug mode state
  const [debugMode, setDebugMode] = useState(initialDebugMode);

  // Derived state - check if dark mode
  const isDarkMode =
    baseTheme === "dark" ||
    (baseTheme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Permission checks
  const canChangeBaseTheme = hasPermission(
    mergedConfig.permissions.baseTheme,
    userRole,
  );
  const canChangeThemeStyle = hasPermission(
    mergedConfig.permissions.themeLibrary,
    userRole,
  );
  const canUseExtensions = hasPermission(
    mergedConfig.permissions.extensions,
    userRole,
  );

  // Base theme setter - uses next-themes setTheme
  const handleSetBaseTheme = useCallback(
    (newTheme: BaseTheme) => {
      if (!canChangeBaseTheme) return;

      // Use next-themes to set the theme which will update the HTML class
      setTheme(newTheme);
      setBaseThemeState(newTheme);
      localStorage.setItem(BASE_THEME_KEY, newTheme);

      if (debugMode) {
        console.log(`[ThemeSystem] Base theme set to: ${newTheme}`);
      }
    },
    [canChangeBaseTheme, debugMode, setTheme],
  );

  // Theme style setter
  const handleSetThemeStyle = useCallback(
    (style: string) => {
      if (!canChangeThemeStyle) {
        if (debugMode) {
          console.warn(
            "[ThemeSystem] Permission denied: Cannot change theme style",
          );
        }
        return;
      }

      // Validate that the theme exists in available themes
      const isValidTheme = mergedConfig.themes.some((t) => t.id === style);
      if (!isValidTheme) {
        console.warn(`[ThemeSystem] Invalid theme style: ${style}`);
        return;
      }

      setThemeStyleState(style);

      // Persist to localStorage
      try {
        localStorage.setItem(THEME_STYLE_KEY, style);
        if (debugMode) {
          console.log(`[ThemeSystem] Theme style set and persisted: ${style}`);
        }
      } catch (error) {
        console.error(
          "[ThemeSystem] Failed to save theme to localStorage:",
          error,
        );
      }
    },
    [canChangeThemeStyle, debugMode, mergedConfig.themes],
  );

  // Extension theme getters and setters
  const getExtension = useCallback(
    <T,>(extensionId: string): T | undefined => {
      if (!canUseExtensions) return undefined;

      const extension = extensions[extensionId];
      return extension ? (extension as T) : undefined;
    },
    [extensions, canUseExtensions],
  );

  const setExtensionTheme = useCallback(
    <T,>(extensionId: string, theme: T) => {
      if (!canUseExtensions) return;

      setExtensions((prev) => {
        const newExtensions = {
          ...prev,
          [extensionId]: theme,
        };

        // Store in localStorage
        try {
          localStorage.setItem(
            APP_EXTENSION_THEMES_KEY,
            JSON.stringify(newExtensions),
          );
        } catch (error) {
          console.error("Failed to store extension themes:", error);
        }

        return newExtensions;
      });

      if (debugMode) {
        console.log(
          `[ThemeSystem] Extension "${extensionId}" theme updated:`,
          theme,
        );
      }
    },
    [canUseExtensions, debugMode],
  );

  // Debug logging
  const logThemeState = useCallback(() => {
    console.group("[ThemeSystem] Current State");
    console.log("Base theme:", baseTheme);
    console.log("Theme style:", themeStyle);
    console.log("Extensions:", { ...extensions });
    console.log("Permissions:", {
      canChangeBaseTheme,
      canChangeThemeStyle,
      canUseExtensions,
    });
    console.log("Config:", mergedConfig);
    console.groupEnd();
  }, [
    baseTheme,
    themeStyle,
    extensions,
    canChangeBaseTheme,
    canChangeThemeStyle,
    canUseExtensions,
    mergedConfig,
  ]);

  // Context value
  const contextValue: ThemeContextType = {
    baseTheme,
    setBaseTheme: handleSetBaseTheme,
    isDarkMode,
    themeStyle,
    setThemeStyle: handleSetThemeStyle,
    availableThemes: mergedConfig.themes,
    extensions,
    getExtension,
    setExtensionTheme,
    canChangeBaseTheme,
    canChangeThemeStyle,
    canUseExtensions,
    config: mergedConfig,
    debugMode,
    setDebugMode,
    logThemeState,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeStateManager
        themeStyle={themeStyle}
        baseTheme={baseTheme}
        debugMode={debugMode}
      >
        {children}
      </ThemeStateManager>
    </ThemeContext.Provider>
  );
}

// Custom hook for accessing theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Custom hook for accessing extension themes
export function useThemeExtension<T>(extensionId: string) {
  const { getExtension, setExtensionTheme, config, canUseExtensions } =
    useTheme();

  const extensionConfig = config.extensions[extensionId];
  const currentTheme = getExtension<T>(extensionId);

  const setTheme = useCallback(
    (theme: T) => {
      if (canUseExtensions) {
        setExtensionTheme(extensionId, theme);
      }
    },
    [canUseExtensions, extensionId, setExtensionTheme],
  );

  return {
    templates: extensionConfig?.templates ?? [],
    currentTheme,
    setTheme,
    canUseExtensions,
  };
}

// Hook to use with theme style components
export function useThemeSystem() {
  const theme = useTheme();
  return theme;
}
