"use client";

// Re-implement minimal versions of types and utility functions to avoid server imports
export type Theme = "dark" | "light";

export interface HeaderThemeContextType {
  headerTheme?: Theme | null;
  setHeaderTheme: (theme: Theme | null) => void;
}

export interface ThemeContextType {
  theme?: Theme | null;
  setTheme: (theme: Theme | null) => void;
}

// Export client-side-safe UI components
// export { Footer } from "./Footer/Component";
// export { HeaderClient as Header } from "./Header/Component.client";
export { AdminBar } from "./components/AdminBar";
export { InitTheme } from "./providers/Theme/InitTheme";

// Export client providers and hooks
export { Providers } from "./providers";
export { ThemeProvider, useTheme } from "./providers/Theme";
export { HeaderThemeProvider, useHeaderTheme } from "./providers/HeaderTheme";

// Export utility functions safe for client use
export { cn } from "./utilities/ui";
