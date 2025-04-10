"use client";

import { DesktopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";

import { ToggleGroup, ToggleGroupItem } from "@acme/ui/components/toggle-group";

import { useTheme } from "../providers/ThemeProvider";

interface LightDarkToggleProps {
  className?: string;
}

export function LightDarkToggle({ className }: LightDarkToggleProps) {
  const { baseTheme, setBaseTheme, canChangeBaseTheme } = useTheme();

  const handleBaseThemeChange = (value: string) => {
    if (!value) return;
    setBaseTheme(value as "light" | "dark" | "system");
  };

  return (
    <div className={`${className}`}>
      {canChangeBaseTheme ? (
        <ToggleGroup
          type="single"
          value={baseTheme}
          onValueChange={handleBaseThemeChange}
          className="w-full justify-center"
        >
          <ToggleGroupItem value="light" aria-label="Light mode">
            <SunIcon className="mr-2 h-4 w-4" />
            Light
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" aria-label="Dark mode">
            <MoonIcon className="mr-2 h-4 w-4" />
            Dark
          </ToggleGroupItem>
          <ToggleGroupItem value="system" aria-label="System mode">
            <DesktopIcon className="mr-2 h-4 w-4" />
            System
          </ToggleGroupItem>
        </ToggleGroup>
      ) : (
        <p className="text-sm italic text-muted-foreground">
          You don't have permission to change the base theme.
        </p>
      )}
    </div>
  );
}
