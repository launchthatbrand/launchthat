"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { useTheme } from "@acme/theme-system";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui/components/tabs";

export default function ConfigPage() {
  const { config } = useTheme();

  return (
    <main className="container mx-auto flex flex-col items-center justify-center space-y-8 p-4">
      <div className="w-full max-w-4xl">
        <Link
          href="/"
          className="mb-8 flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Config-Driven Theme System
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure your theme system with a simple TypeScript configuration
            file, similar to Payload CMS and other modern frameworks.
          </p>
        </div>

        <div className="space-y-8">
          <Tabs defaultValue="config">
            <TabsList className="w-full">
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="example">Example</TabsTrigger>
            </TabsList>
            <TabsContent value="config" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Configuration Structure</CardTitle>
                  <CardDescription>
                    TypeScript definition for the theme system configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-auto rounded-md bg-muted p-4 text-sm text-muted-foreground">
                    <code>{`
export interface ThemeConfig {
  baseThemes: BaseTheme[];              // Available themes (light/dark/system)
  themeLibrary: ThemePreview[];         // Available visual styles
  extensions: Record<string, ThemeExtension>; // App-specific extensions
  permissions: ThemePermissions;        // Permission settings
  defaultTheme: BaseTheme;              // Default light/dark setting
  defaultStyle: ThemeStyle;             // Default visual style
}

export type ThemeStyle = "glass" | "brutalist" | "aggressive" | "minimal";
export type BaseTheme = "light" | "dark" | "system";
export type PermissionLevel = "user" | "admin" | "none";
`}</code>
                  </pre>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h2 className="text-xl font-medium">Current Configuration</h2>
                <p className="text-muted-foreground">
                  The current theme system configuration is shown below. This is
                  loaded from the <code>theme.config.ts</code> file.
                </p>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 font-medium">Base Themes</h3>
                        <div className="flex gap-2">
                          {config.baseThemes.map((theme) => (
                            <span
                              key={theme}
                              className="rounded bg-muted px-2 py-1 text-xs"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 font-medium">Theme Library</h3>
                        <div className="flex flex-wrap gap-2">
                          {config.themes.map((theme) => (
                            <span
                              key={theme.id}
                              className="rounded bg-muted px-2 py-1 text-xs"
                            >
                              {theme.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 font-medium">Default Settings</h3>
                        <ul className="space-y-1 text-sm">
                          <li>
                            Default Base Theme:{" "}
                            <strong>{config.defaultTheme}</strong>
                          </li>
                          <li>
                            Default Style:{" "}
                            <strong>{config.defaultStyle}</strong>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Using the Theme Configuration</CardTitle>
                  <CardDescription>
                    How to set up and use the theme system configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="font-medium">Setting up the Config File</h3>
                    <pre className="overflow-auto rounded-md bg-muted p-4 text-sm text-muted-foreground">
                      <code>{`
// src/config/theme.config.ts
export default {
  baseThemes: ["light", "dark", "system"],
  themeLibrary: [
    {
      id: "glass",
      name: "Glass",
      preview: "/themes/glass-preview.png",
      description: "Clean, minimal glass-like interface",
    },
    // Other themes...
  ],
  extensions: {
    // Extension definitions
  },
  permissions: {
    baseTheme: "user", // 'user', 'admin', 'none'
    themeLibrary: "admin",
    extensions: "user",
  },
  defaultTheme: "system",
  defaultStyle: "glass",
};
`}</code>
                    </pre>

                    <h3 className="font-medium">Using the Provider</h3>
                    <pre className="overflow-auto rounded-md bg-muted p-4 text-sm text-muted-foreground">
                      <code>{`
// Wrap your app with the ThemeProvider
import { ThemeProvider } from "@acme/theme-system";
import themeConfig from "./theme.config";

export default function App({ children }) {
  return (
    <ThemeProvider config={themeConfig}>
      {children}
    </ThemeProvider>
  );
}
`}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="example" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Configuration Example</CardTitle>
                  <CardDescription>
                    A comprehensive example with all settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-auto whitespace-pre-wrap rounded-md bg-muted p-4 text-sm text-muted-foreground">
                    <code>{`
const themeConfig = {
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
    baseTheme: "user",
    themeLibrary: "admin",
    extensions: "user",
  },
  defaultTheme: "system",
  defaultStyle: "glass",
};

export default themeConfig;
                    `}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
