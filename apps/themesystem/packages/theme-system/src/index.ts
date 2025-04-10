// Export types
export * from "./types";

// Export providers
export * from "./providers/StaticPreviewProvider";

// Export components
export * from "./components/ThemeProvider";
export * from "./components/ThemePreview";
export * from "./components/ThemeSelector";
export * from "./components/ThemeCarousel";
export * from "./components/ThemeDrawer";
export * from "./components/ThemeSwitcher";
export * from "./components/ThemeToggle";

// Re-export some types from components
export type {
  BaseTheme,
  PermissionLevel,
  ThemeSystemPermissions,
  ThemeSystemConfig,
  ThemeExtension,
  ThemeExtensionTemplate,
  ThemeProviderProps,
} from "./components/ThemeProvider";

export type { ThemePreviewProps } from "./components/ThemePreview";

export type {
  ThemeSelectorProps,
  ThemeItemProps,
  ContainerProps,
} from "./components/ThemeSelector";

export type { ThemeSwitcherProps } from "./components/ThemeSwitcher";
export type { ThemeToggleProps } from "./components/ThemeToggle";

// Utilities
export { generateGradientFromColor } from "./utils/gradient";
export { getThemeClasses } from "./utils/dom";
