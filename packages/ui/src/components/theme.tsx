"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme as useNextTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@acme/ui/components/dropdown-menu";
import { themes } from "@acme/ui/themes/types";

import { Button } from "./button";

// ErrorBoundary component to catch rendering errors
class ThemeErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("ThemeToggle error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Button variant="outline" size="icon" disabled>
          <SunIcon className="size-5" />
        </Button>
      );
    }

    return this.props.children;
  }
}

// Simplified ThemeToggle component
function ThemeToggle() {
  // Get current theme and setter from next-themes
  const { setTheme } = useNextTheme();

  // Simple handler function
  const handleSelectTheme = React.useCallback(
    (value: string) => {
      try {
        setTheme(value);
      } catch (error) {
        console.error("Failed to set theme:", error);
      }
    },
    [setTheme],
  );

  // Return wrapped in error boundary
  return (
    <ThemeErrorBoundary>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SunIcon className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-[1000] w-[200px]">
          <DropdownMenuLabel>Theme Style</DropdownMenuLabel>
          {themes.map((theme) => (
            <DropdownMenuItem
              key={theme.value}
              onClick={() => handleSelectTheme(theme.value)}
            >
              {theme.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ThemeErrorBoundary>
  );
}

export { ThemeToggle };
