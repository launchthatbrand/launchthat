"use client";

import Link from "next/link";
import { ArrowLeftIcon, CheckIcon } from "@radix-ui/react-icons";

import { Button } from "@acme/ui/components/button";
import { Card, CardContent } from "@acme/ui/components/card";
import { cn } from "@acme/ui/lib/utils";

import type { ThemeStyle } from "~/config/theme.config";
import { ThemeStyleToggle } from "~/components/ThemeStyleToggle";
import { useTheme } from "~/providers/ThemeProvider";

export default function ThemesPage() {
  const { themeStyle, setThemeStyle, canChangeThemeStyle, config } = useTheme();

  // Function to handle theme change when a theme card is clicked
  const handleThemeChange = (themeId: string) => {
    console.log("Attempting to change theme to:", themeId);
    console.log("Can change theme style:", canChangeThemeStyle);

    if (canChangeThemeStyle) {
      setThemeStyle(themeId as ThemeStyle);
      console.log("Theme style changed to:", themeId);
    } else {
      // Alert the user that they don't have permission
      alert(
        "You don't have permission to change the theme. Please contact an administrator.",
      );
      console.log("Permission denied: Cannot change theme style.");
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Theme Library</h1>
          <p className="mt-2 text-muted-foreground">
            Our theme system includes various visual styles that completely
            transform the look and feel of your application with a single
            setting.
          </p>

          {/* Permission warning for admin-only features */}
          {!canChangeThemeStyle && (
            <div className="mt-4 rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Permission Notice
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <p>
                      You are currently in view-only mode. Changing theme styles
                      requires admin permissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-medium">Select a Theme</h2>
              <p className="mb-6 text-muted-foreground">
                Choose from our collection of carefully designed themes. Each
                theme applies a unique set of CSS variables to transform colors,
                typography, borders, and more.
              </p>
              <ThemeStyleToggle />
            </CardContent>
          </Card>

          {/* Theme Cards Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Available Themes</h2>
            <p className="mb-4 text-muted-foreground">
              Click on any theme to apply it to the entire application.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {config.themeLibrary.map((theme) => (
                <div
                  key={theme.id}
                  className={cn(
                    "relative cursor-pointer overflow-hidden rounded-lg border p-4 transition-all hover:border-primary hover:shadow-md",
                    themeStyle === theme.id && "border-primary bg-primary/5",
                  )}
                  onClick={() => {
                    console.log(`Clicked on theme: ${theme.id}`);
                    handleThemeChange(theme.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      console.log(`Key pressed on theme: ${theme.id}`);
                      handleThemeChange(theme.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={themeStyle === theme.id}
                >
                  {themeStyle === theme.id && (
                    <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <CheckIcon className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className="mb-2">
                    <h3 className="font-medium">{theme.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {theme.description}
                    </p>
                  </div>
                  <div
                    className="mt-4 h-20 w-full overflow-hidden rounded-md bg-muted"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-full w-full bg-gradient-to-br ${getThemeGradient(theme.id)}`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium">Theme Features</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>
                  <strong>Glass Theme:</strong> Clean, minimal interface with
                  subtle transparency effects and soft shadows.
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>
                  <strong>Brutalist Theme:</strong> Bold, raw design with high
                  contrast, sharp edges, and minimal decoration.
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>
                  <strong>Aggressive Theme:</strong> High-energy design with
                  vibrant colors, sharp angles, and dynamic effects.
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>
                  <strong>Minimal Theme:</strong> Clean, simple, and unobtrusive
                  design focused on content and readability.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-medium">Creating Custom Themes</h2>
            <p>
              Developers can create custom themes by extending the base theme
              variables and adding new visual styles. Each theme is a collection
              of CSS variables that can be easily customized.
            </p>
            <Button asChild>
              <Link href="/docs/creating-themes">View Documentation</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

// Helper function to get gradient colors for theme preview
function getThemeGradient(themeId: string): string {
  switch (themeId) {
    case "glass":
      return "from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-700";
    case "brutalist":
      return "from-stone-200 to-stone-400 dark:from-stone-800 dark:to-stone-600";
    case "aggressive":
      return "from-red-200 via-purple-300 to-blue-300 dark:from-red-900 dark:via-purple-800 dark:to-blue-800";
    case "minimal":
      return "from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800";
    default:
      return "from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700";
  }
}
