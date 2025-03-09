"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme as useNextTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/components/dropdown-menu";
import { cn } from "@acme/ui/lib/utils";
import { useTheme } from "@acme/ui/providers/BaseProvider";
import { themes } from "@acme/ui/themes/types";

import { Button } from "./button";

const themeMapping: Record<string, string> = {
  glass: "Glass",
  aggressive: "Agressive",
};

function ThemeToggle() {
  const { theme, setTheme } = useNextTheme();
  // const { themeStyle, setThemeStyle } = useTheme();

  return (
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
            onClick={() => {
              setTheme(theme.value);
            }}
          >
            {theme.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        {/* <DropdownMenuLabel>Color Mode</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setColorMode("light")}
          className={cn(
            "flex cursor-pointer items-center justify-between",
            colorMode === "light" && "bg-accent",
          )}
        >
          <span>Light</span>
          {colorMode === "light" && (
            <span className="text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setColorMode("dark")}
          className={cn(
            "flex cursor-pointer items-center justify-between",
            colorMode === "dark" && "bg-accent",
          )}
        >
          <span>Dark</span>
          {colorMode === "dark" && (
            <span className="text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setColorMode("system")}
          className={cn(
            "flex cursor-pointer items-center justify-between",
            colorMode === "system" && "bg-accent",
          )}
        >
          <span>System</span>
          {colorMode === "system" && (
            <span className="text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ThemeToggle };
