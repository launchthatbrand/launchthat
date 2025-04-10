// Type definitions for theme configuration
export type ThemeStyle =
  | "glass"
  | "brutalist"
  | "aggressive"
  | "minimal"
  | "modern";
export type BaseTheme = "light" | "dark" | "system";
export type PermissionLevel = "user" | "admin" | "none";

export interface ThemePreview {
  id: string;
  name: string;
  preview: string;
  description: string;
}

export interface ExtensionTemplate {
  id: string;
  name: string;
  preview: string;
  description?: string;
}

export interface ThemeExtension {
  id: string;
  name: string;
  templates: ExtensionTemplate[];
  defaultTemplate?: string;
}

export interface ThemePermissions {
  baseTheme: PermissionLevel;
  themeLibrary: PermissionLevel;
  extensions: PermissionLevel;
}

export interface ThemeConfig {
  baseThemes: BaseTheme[];
  themeLibrary: ThemePreview[];
  extensions: Record<string, ThemeExtension>;
  permissions: ThemePermissions;
  defaultTheme: BaseTheme;
  defaultStyle: ThemeStyle;
}

// Default theme configuration
const themeConfig: ThemeConfig = {
  baseThemes: ["light", "dark", "system"],
  themeLibrary: [
    {
      id: "glass",
      name: "Glass",
      preview: "/themes/glass-preview.png",
      description: "Clean, minimal glass-like interface",
    },
    {
      id: "brutalist",
      name: "Brutalist",
      preview: "/themes/brutalist-preview.png",
      description: "Bold, raw concrete-inspired design",
    },
    {
      id: "aggressive",
      name: "Aggressive",
      preview: "/themes/aggressive-preview.png",
      description: "High-energy, bold design with sharp angles",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview: "/themes/minimal-preview.png",
      description: "Clean, simple, and unobtrusive design",
    },
  ],
  extensions: {
    resumeBuilder: {
      id: "resumeBuilder",
      name: "Resume Templates",
      templates: [
        {
          id: "modern",
          name: "Modern",
          preview: "/resume-templates/modern.png",
          description: "Clean, professional layout with modern typography",
        },
        {
          id: "classic",
          name: "Classic",
          preview: "/resume-templates/classic.png",
          description: "Traditional resume layout that's widely accepted",
        },
        {
          id: "creative",
          name: "Creative",
          preview: "/resume-templates/creative.png",
          description: "Stand-out design for creative professionals",
        },
      ],
      defaultTemplate: "modern",
    },
  },
  permissions: {
    baseTheme: "user", // 'user', 'admin', 'none'
    themeLibrary: "admin", // Who can change the global theme
    extensions: "user", // Who can use extensions
  },
  defaultTheme: "system",
  defaultStyle: "glass",
};

export default themeConfig;
