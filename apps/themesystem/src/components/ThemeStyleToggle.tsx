"use client";

import type { ThemeStyle } from "../config/theme.config";
import { useTheme } from "../providers/ThemeProvider";
import { ThemeCarousel } from "./ThemeCarousel";

interface ThemeStyleToggleProps {
  className?: string;
}

export function ThemeStyleToggle({ className }: ThemeStyleToggleProps) {
  const { themeStyle, setThemeStyle, canChangeThemeStyle, config } = useTheme();

  return (
    <div className={`${className}`}>
      {canChangeThemeStyle ? (
        <ThemeCarousel
          themes={config.themeLibrary}
          currentTheme={themeStyle}
          onSelectTheme={(themeId: string) => {
            // Only set the theme if it's a valid ThemeStyle
            if (config.themeLibrary.some((theme) => theme.id === themeId)) {
              setThemeStyle(themeId as ThemeStyle);
            }
          }}
        />
      ) : (
        <p className="text-sm italic text-muted-foreground">
          You don't have permission to change the theme.
        </p>
      )}
    </div>
  );
}
