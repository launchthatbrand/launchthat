"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

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

export default function TypeScriptPage() {
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
            TypeScript Support
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enjoy complete TypeScript support with typed theme configurations,
            extension APIs, and component props for a smooth development
            experience.
          </p>
        </div>

        <div className="space-y-8">
          <Tabs defaultValue="types">
            <TabsList className="w-full">
              <TabsTrigger value="types">Type Definitions</TabsTrigger>
              <TabsTrigger value="hooks">Typed Hooks</TabsTrigger>
              <TabsTrigger value="extensions">Extension Types</TabsTrigger>
            </TabsList>

            <TabsContent value="types" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Core Type Definitions</CardTitle>
                  <CardDescription>
                    TypeScript types for the theme system core
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-auto rounded-md bg-muted p-4 text-sm text-muted-foreground">
                    <code>{`
// Core types
export type ThemeStyle = "glass" | "brutalist" | "aggressive" | "minimal";
export type BaseTheme = "light" | "dark" | "system";
export type PermissionLevel = "user" | "admin" | "none";

// Interface for theme previews in the library
export interface ThemePreview {
  id: string;
  name: string;
  preview: string;
  description: string;
}

// Extension template definition
export interface ExtensionTemplate {
  id: string;
  name: string;
  preview: string;
  description?: string;
}

// Theme extension configuration
export interface ThemeExtension {
  id: string;
  name: string;
  templates: ExtensionTemplate[];
  defaultTemplate?: string;
}

// Permission settings
export interface ThemePermissions {
  baseTheme: PermissionLevel;
  themeLibrary: PermissionLevel;
  extensions: PermissionLevel;
}`}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hooks" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Typed Hooks</CardTitle>
                  <CardDescription>
                    TypeScript-friendly hooks for using the theme system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-auto rounded-md bg-muted p-4 text-sm text-muted-foreground">
                    <code>{`
// useTheme hook type definition
function useTheme(): {
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

  // Config access
  config: ThemeConfig;
}

// useThemeExtension hook type definition
function useThemeExtension<T>(extensionId: string): {
  templates: ExtensionTemplate[];
  currentTheme: T | undefined;
  setTheme: (theme: T) => void;
  canUseExtensions: boolean;
}`}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Example</CardTitle>
                  <CardDescription>
                    Using the typed hooks in a component
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-auto rounded-md bg-muted p-4 text-sm text-muted-foreground">
                    <code>{`
// Using the typed hooks in a React component
import { useTheme, useThemeExtension } from "@acme/theme-system";

function ResumeEditor() {
  // Fully typed theme access
  const { isDarkMode, themeStyle, setThemeStyle } = useTheme();
  
  // Typed extension access with generics
  type ResumeTheme = {
    layout: "single-column" | "two-column";
    fontSize: number;
    primaryColor: string;
  };
  
  const { 
    templates, 
    currentTheme, 
    setTheme 
  } = useThemeExtension<ResumeTheme>("resumeBuilder");
  
  // Type safety in your component logic
  return (
    <div className={\`resume-\${currentTheme?.layout || "single-column"}\`}>
      {/* Component content */}
    </div>
  );
}`}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="extensions" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Extension Type System</CardTitle>
                  <CardDescription>
                    How to type custom extensions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-auto rounded-md bg-muted p-4 text-sm text-muted-foreground">
                    <code>{`
// Define your extension-specific types
interface ResumeTheme {
  fontFamily: string;
  spacing: number;
  showBorder: boolean;
  accentColor: string;
}

// Create a typed extension configuration
const resumeExtension: ThemeExtension = {
  id: "resumeBuilder",
  name: "Resume Builder",
  templates: [
    {
      id: "modern",
      name: "Modern",
      preview: "/previews/modern.png",
      description: "Clean, modern resume layout"
    },
    // Other templates...
  ],
  defaultTemplate: "modern"
};

// Use with type safety in your application
function ResumeCard() {
  const { currentTheme } = useThemeExtension<ResumeTheme>("resumeBuilder");
  
  // Type-safe access to extension properties
  const font = currentTheme?.fontFamily || "Inter";
  const spacing = currentTheme?.spacing || 1;
  
  return (
    <div style={{ 
      fontFamily: font,
      padding: \`\${spacing}rem\`,
      border: currentTheme?.showBorder ? "1px solid" : "none",
      borderColor: currentTheme?.accentColor
    }}>
      {/* Card content */}
    </div>
  );
}`}</code>
                  </pre>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h2 className="text-xl font-medium">Benefits of TypeScript</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>
                      <strong>Type Safety:</strong> Catch errors during
                      development rather than at runtime
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>
                      <strong>IntelliSense:</strong> Get code completion in your
                      IDE for theme properties
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>
                      <strong>Documentation:</strong> Types serve as
                      self-documenting code
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>
                      <strong>Refactoring:</strong> Safely rename or change
                      properties across your codebase
                    </span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
