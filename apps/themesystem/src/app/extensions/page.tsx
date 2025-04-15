"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/components/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui/components/tabs";
import { useCallback, useEffect, useState } from "react";
import { useTheme, useThemeExtension } from "@acme/theme-system";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Button } from "@acme/ui/components/button";
import Link from "next/link";
import ResumeBuilder from "./_components/ResumeBuilder";

// Define types for the extension objects
interface ThemeExtensionTemplate {
  id: string;
  name: string;
  description?: string;
  variables?: Record<string, string>;
}

interface ThemeExtension {
  id: string;
  name: string;
  description?: string;
  templates: ThemeExtensionTemplate[];
  defaultTemplate?: string;
}

// Type guard to check if an object is a valid ThemeExtension
function isValidThemeExtension(obj: unknown): obj is ThemeExtension {
  const ext = obj as Partial<ThemeExtension>;
  return (
    typeof ext === "object" &&
    ext !== null &&
    typeof ext.name === "string" &&
    Array.isArray(ext.templates)
  );
}

// Type guard to check if an object is a valid ThemeExtensionTemplate
function isValidTemplate(obj: unknown): obj is ThemeExtensionTemplate {
  const template = obj as Partial<ThemeExtensionTemplate>;
  return (
    typeof template === "object" &&
    template !== null &&
    typeof template.id === "string" &&
    typeof template.name === "string"
  );
}

// Sample resume component to showcase the resume extension
function ResumePreview() {
  const { currentTheme, setTheme } =
    useThemeExtension<string>("resume-builder");
  const { getExtension } = useTheme();
  const [themeClass, setThemeClass] = useState<string>("");

  // Get the complete extension data to access the template variables
  const resumeExtension = getExtension<ThemeExtension>("resume-builder");

  // Debug logging
  console.log("Current theme:", currentTheme);
  console.log("Resume extension:", resumeExtension);

  // Find the currently selected template
  const selectedTemplate = resumeExtension?.templates?.find(
    (template) => template.id === currentTheme,
  );

  console.log("Selected template:", selectedTemplate);

  // Generate CSS classes from template variables
  const generateCssClasses = useCallback(() => {
    if (!currentTheme) return "resume-theme-default";

    const themeId = `resume-theme-${currentTheme}`;

    // If no template or variables, return just the theme ID
    if (!selectedTemplate?.variables) {
      console.log("No template variables found, using defaults");
      return themeId;
    }

    const styleSheet = document.createElement("style");
    styleSheet.id = themeId;

    // Replace any existing style sheet
    const existingStyle = document.getElementById(themeId);
    if (existingStyle) {
      existingStyle.remove();
    }

    let cssRules = `
      .${themeId} {
    `;

    // Add all variables to the CSS class
    Object.entries(selectedTemplate.variables).forEach(([key, value]) => {
      cssRules += `  ${key}: ${value};\n`;
    });

    // Add fallbacks for essential variables
    cssRules += `
        --resume-heading-color: var(--resume-heading-color, currentColor);
        --resume-section-spacing: var(--resume-section-spacing, 1.5rem);
        --resume-border-color: var(--resume-border-color, var(--border, #e5e7eb));
        --resume-heading-font: var(--resume-heading-font, inherit);
        --resume-accent-color: var(--resume-accent-color, var(--primary, #3b82f6));
      }
    `;

    styleSheet.textContent = cssRules;
    document.head.appendChild(styleSheet);

    return themeId;
  }, [currentTheme, selectedTemplate]);

  // Apply theme changes with useEffect
  useEffect(() => {
    const newThemeClass = generateCssClasses();
    console.log("Applying new theme class:", newThemeClass);
    setThemeClass(newThemeClass);

    // Cleanup function to remove style element when component unmounts
    return () => {
      const styleElement = document.getElementById(
        `resume-theme-${currentTheme}`,
      );
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [currentTheme, generateCssClasses]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Resume Extension Preview</h3>
        <Select
          value={currentTheme}
          onValueChange={(value) => {
            console.log("Setting new theme:", value);
            setTheme(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="classic">Classic</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Apply the theme class to the ResumeBuilder component */}
      <div className="rounded border p-6">
        <ResumeBuilder />
      </div>

      {selectedTemplate && (
        <div className="mt-4 text-sm">
          <h4 className="mb-2 font-medium">
            Current Template: {selectedTemplate.name}
          </h4>
          {selectedTemplate.description && (
            <p className="mb-2 text-muted-foreground">
              {selectedTemplate.description}
            </p>
          )}
          {selectedTemplate.variables &&
            Object.entries(selectedTemplate.variables).length > 0 && (
              <div className="rounded-md bg-muted p-3">
                <p className="mb-1 font-medium">CSS Variables:</p>
                <pre className="text-xs">
                  {Object.entries(selectedTemplate.variables).map(
                    ([key, value]) => (
                      <div key={key}>
                        {key}: {value};
                      </div>
                    ),
                  )}
                </pre>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

// Sample dashboard component to showcase the dashboard extension
function DashboardPreview() {
  const { currentTheme, setTheme } = useThemeExtension<string>("dashboard");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dashboard Extension Preview</h3>
        <Select value={currentTheme} onValueChange={(value) => setTheme(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="analytical">Analytical</SelectItem>
            <SelectItem value="compact">Compact</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        className="rounded border p-4"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "var(--dashboard-grid-gap, 1rem)",
        }}
      >
        {[
          { title: "Total Users", value: "24,521", change: "+12%" },
          { title: "New Signups", value: "1,423", change: "+5%" },
          { title: "Revenue", value: "$34,252", change: "+8%" },
          { title: "Active Users", value: "18,105", change: "+3%" },
        ].map((metric, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "var(--dashboard-card-bg, white)",
              borderRadius: "var(--dashboard-border-radius, 0.5rem)",
              boxShadow: "var(--dashboard-shadow, 0 1px 3px rgba(0,0,0,0.1))",
              padding: "1rem",
            }}
          >
            <div className="text-sm text-muted-foreground">{metric.title}</div>
            <div className="mt-1 text-2xl font-bold">{metric.value}</div>
            <div
              className="mt-2 text-xs"
              style={{ color: metric.change.startsWith("+") ? "green" : "red" }}
            >
              {metric.change} from last month
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ExtensionsPage() {
  // Get theme context - useTheme() returns ThemeContextType
  const { extensions } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("overview");

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
            Theme Extensions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Extend the core theme system with app-specific styling options
            tailored to specific use cases like resume builders, dashboards, and
            more.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex-1">
              Resume Builder
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex-1">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="registry" className="flex-1">
              Registry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>What are Theme Extensions?</CardTitle>
                <CardDescription>
                  Specialized theming for app-specific components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  While the base theme system handles general UI styling like
                  colors, typography, and shapes, theme extensions provide
                  specialized styling for specific app features or components.
                </p>

                <div className="mb-4 space-y-2">
                  <h3 className="font-semibold">Key Benefits:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>
                        Modular styling for specific features without affecting
                        the base theme
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>
                        Each extension can have multiple templates (e.g.,
                        different resume styles)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>
                        User preferences for each extension are saved separately
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>
                        Easy to create new extensions for any app-specific
                        components
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">How Extensions Work:</h3>
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>
                      Extensions are registered in the theme provider
                      configuration
                    </li>
                    <li>Each extension defines templates with CSS variables</li>
                    <li>
                      Components use{" "}
                      <code className="rounded bg-muted px-1 py-0.5 text-sm">
                        useThemeExtension
                      </code>{" "}
                      hook to access the current template
                    </li>
                    <li>
                      Extension preferences are stored in cookies/localStorage
                    </li>
                  </ol>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("registry")}
                >
                  View Registered Extensions
                </Button>
                <Button onClick={() => setActiveTab("resume")}>
                  Try an Example
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-medium">Creating Extensions</h2>
              <p className="text-muted-foreground">
                Extensions allow you to define app-specific theming options that
                work alongside the core theme system. Create custom extensions
                for specific features like:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Resume templates with different visual styles</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Dashboard layouts with custom widget styling</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Content editor themes with syntax highlighting</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>
                    Form builder templates with different input styles
                  </span>
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="resume">
            <Card>
              <CardHeader>
                <CardTitle>Resume Builder Extension</CardTitle>
                <CardDescription>
                  Theme templates for different resume styles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded border p-6">
                  <ResumeBuilder />
                </div>

                <div className="mt-8 text-sm text-muted-foreground">
                  <h3 className="mb-2 text-sm font-medium">How it works:</h3>
                  <p>
                    Each ResumeBuilder component can have its own theme,
                    independent of the main app theme.
                  </p>
                  <p className="mt-1">
                    Theme variables are scoped to the component using data
                    attributes like{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                      data-theme-extension="resume-theme-modern"
                    </code>
                    .
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-2">
                  <h3 className="text-sm font-medium">
                    How to use this extension:
                  </h3>
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                    {`// In your component
import { ResumeBuilder } from "@acme/components/resume";

function ResumePage() {
  return (
    <div>
      <h1>My Resume Builder</h1>
      
      {/* The ResumeBuilder component handles all theme extension logic internally */}
      <ResumeBuilder defaultTemplate="modern" />
      
      {/* You can use multiple instances with different themes */}
      <ResumeBuilder defaultTemplate="creative" />
    </div>
  );
}`}
                  </pre>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Extension</CardTitle>
                <CardDescription>
                  Theme templates for dashboard layouts and widgets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardPreview />
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-2">
                  <h3 className="text-sm font-medium">
                    How to use this extension:
                  </h3>
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                    {`// In your component
import { useThemeExtension } from "@acme/theme-system";

function DashboardComponent() {
  const { currentTheme, setTheme } = useThemeExtension<string>("dashboard");
  
  return (
    <div style={{ 
      display: "grid",
      gap: "var(--dashboard-grid-gap)",
    }}>
      <div style={{ 
        backgroundColor: "var(--dashboard-card-bg)",
        borderRadius: "var(--dashboard-border-radius)"
      }}>
        {/* Dashboard widget content */}
      </div>
    </div>
  );
}`}
                  </pre>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="registry">
            <Card>
              <CardHeader>
                <CardTitle>Extension Registry</CardTitle>
                <CardDescription>
                  Currently registered theme extensions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.entries(extensions).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(extensions).map(([id, extensionData]) => {
                      // Use type guard to check for valid extension
                      if (!isValidThemeExtension(extensionData)) {
                        return (
                          <div
                            key={id}
                            className="rounded-md border bg-red-50 p-4"
                          >
                            <h3 className="mb-2 font-medium text-red-500">
                              Invalid Extension: {id}
                            </h3>
                            <p className="text-sm text-red-400">
                              This extension has an invalid format.
                            </p>
                          </div>
                        );
                      }

                      // Now TypeScript knows extensionData is a valid ThemeExtension
                      const extension = extensionData;

                      return (
                        <div key={id} className="rounded-md border p-4">
                          <h3 className="mb-2 font-medium">{extension.name}</h3>
                          {extension.description && (
                            <p className="mb-2 text-sm text-muted-foreground">
                              {extension.description}
                            </p>
                          )}
                          <p className="mb-2 text-sm">
                            <span className="font-semibold">Default:</span>{" "}
                            {extension.defaultTemplate ?? "none"}
                          </p>
                          <p className="mb-2 text-sm text-muted-foreground">
                            {extension.templates.length} templates available
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {extension.templates.map((template, i) => {
                              if (!isValidTemplate(template)) {
                                return (
                                  <div
                                    key={i}
                                    className="rounded bg-red-100 px-2 py-1 text-xs text-red-600"
                                  >
                                    Invalid Template
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={template.id}
                                  className="rounded bg-muted px-2 py-1 text-xs"
                                >
                                  {template.name}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm italic text-muted-foreground">
                    No theme extensions registered.
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-2">
                  <h3 className="text-sm font-medium">
                    How to register extensions:
                  </h3>
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                    {`// In your root layout or ThemeProvider config
const themeExtensions = {
  "my-extension": {
    id: "my-extension",
    name: "My Extension",
    description: "Custom styling for specific components",
    defaultTemplate: "default",
    templates: [
      {
        id: "default",
        name: "Default",
        variables: {
          "--my-color": "#ff0000",
          "--my-spacing": "1rem"
        }
      },
      // More templates...
    ]
  }
};

// Then in the ServerThemeProvider
<ServerThemeProvider
  config={{
    // ...other config
    extensions: themeExtensions,
  }}
>
  {/* Rest of your app */}
</ServerThemeProvider>`}
                  </pre>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
