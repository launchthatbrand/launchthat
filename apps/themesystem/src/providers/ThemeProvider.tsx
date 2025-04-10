"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";

import type {
  BaseTheme,
  ThemeConfig,
  ThemeStyle,
} from "../config/theme.config";
import defaultThemeConfig from "../config/theme.config";

// Theme system storage keys
const THEME_STYLE_KEY = "theme-style";
const BASE_THEME_KEY = "base-theme";
const APP_EXTENSION_THEMES_KEY = "app-extension-themes";

// Define ThemeContext type
interface ThemeContextType {
  // Base theme (light/dark)
  baseTheme: BaseTheme;
  setBaseTheme: (theme: BaseTheme) => void;
  isDarkMode: boolean;

  // Theme library (visual styles)
  themeStyle: ThemeStyle;
  setThemeStyle: (style: ThemeStyle) => void;

  // Extensions system
  extensions: Record<string, unknown>;
  getExtension: <T>(extensionId: string) => T | undefined;
  setExtensionTheme: <T>(extensionId: string, theme: T) => void;

  // Permissions
  canChangeBaseTheme: boolean;
  canChangeThemeStyle: boolean;
  canUseExtensions: boolean;

  // Debug/utility
  config: ThemeConfig;
  debugMode: boolean;
  setDebugMode: (enabled: boolean) => void;
  logThemeState: () => void;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme state management component
function ThemeStateManager({
  themeStyle,
  children,
  debugMode,
}: {
  themeStyle: ThemeStyle;
  children: React.ReactNode;
  debugMode: boolean;
}) {
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

    // Get all known theme identifiers from ThemeStyle type
    const allThemeIds = [
      "glass",
      "brutalist",
      "aggressive",
      "minimal",
      "modern",
    ];

    // First remove any previous theme classes using a more comprehensive approach
    const classesToRemove = [];

    // Check if the class is a "theme-*" prefix
    for (const cls of Array.from(root.classList)) {
      if (cls.startsWith("theme-")) {
        classesToRemove.push(cls);
      }
    }

    // Check if the class is a direct theme identifier (glass, brutalist, etc.)
    for (const themeId of allThemeIds) {
      if (root.classList.contains(themeId)) {
        classesToRemove.push(themeId);
      }
    }

    // Now remove all identified classes
    for (const cls of classesToRemove) {
      if (debugMode) {
        console.log(`[ThemeSystem] Removing class: ${cls}`);
      }
      root.classList.remove(cls);
    }

    // Add the current theme class
    root.classList.add(`theme-${themeStyle}`);
    root.classList.add(themeStyle);

    // Store in localStorage
    localStorage.setItem(THEME_STYLE_KEY, themeStyle);

    if (debugMode) {
      console.log(`[ThemeSystem] Applied theme: ${themeStyle}`);
      console.log(
        `[ThemeSystem] Updated classes on HTML:`,
        Array.from(root.classList),
      );
    }
  }, [themeStyle, debugMode]);

  return <>{children}</>;
}

// Helper to determine if user has permission
function hasPermission(level: string, userRole = "user") {
  if (level === "none") return false;
  if (level === "user") return true;
  if (level === "admin") return userRole === "admin";
  return false;
}

// ThemeProvider props
interface ThemeProviderProps {
  children: React.ReactNode;
  config?: Partial<ThemeConfig>;
  userRole?: string;
  initialDebugMode?: boolean;
}

// Main ThemeProvider component wrapper
export function ThemeProvider({
  children,
  config = {},
  userRole = "user",
  initialDebugMode = true,
}: ThemeProviderProps) {
  // Get the stored theme style
  const initialThemeStyle = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_STYLE_KEY) as ThemeStyle | null;
      return stored ?? config.defaultStyle ?? defaultThemeConfig.defaultStyle;
    }
    return config.defaultStyle ?? defaultThemeConfig.defaultStyle;
  };

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme={config.defaultTheme ?? defaultThemeConfig.defaultTheme}
      enableSystem={true}
    >
      <ThemeProviderInternal
        config={config}
        userRole={userRole}
        initialDebugMode={initialDebugMode}
        initialThemeStyle={initialThemeStyle()}
      >
        {children}
      </ThemeProviderInternal>
    </NextThemeProvider>
  );
}

// Internal provider that uses next-themes hook
function ThemeProviderInternal({
  children,
  config = {},
  userRole = "user",
  initialDebugMode = false,
  initialThemeStyle,
}: ThemeProviderProps & { initialThemeStyle: ThemeStyle }) {
  // Use next-themes hook to get and set the theme
  const { theme, setTheme } = useNextTheme();

  // Merge provided config with default config
  const mergedConfig = useMemo(
    () => ({ ...defaultThemeConfig, ...config }),
    [config],
  );

  // Theme style state (glass, brutalist, etc.)
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>(initialThemeStyle);

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

  // Get the current base theme from next-themes
  const baseTheme =
    (theme as BaseTheme | undefined) ?? mergedConfig.defaultTheme;

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

  // Base theme setter - now uses next-themes setTheme
  const handleSetBaseTheme = useCallback(
    (newTheme: BaseTheme) => {
      if (!canChangeBaseTheme) return;

      // Use next-themes to set the theme which will update the HTML class
      setTheme(newTheme);
      localStorage.setItem(BASE_THEME_KEY, newTheme);

      if (debugMode) {
        console.log(`[ThemeSystem] Base theme set to: ${newTheme}`);
      }
    },
    [canChangeBaseTheme, debugMode, setTheme],
  );

  // Theme style setter
  const handleSetThemeStyle = useCallback(
    (style: ThemeStyle) => {
      if (!canChangeThemeStyle) return;

      setThemeStyle(style);
      localStorage.setItem(THEME_STYLE_KEY, style);

      if (debugMode) {
        console.log(`[ThemeSystem] Theme style set to: ${style}`);
      }
    },
    [canChangeThemeStyle, debugMode],
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
      <ThemeStateManager themeStyle={themeStyle} debugMode={debugMode}>
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
