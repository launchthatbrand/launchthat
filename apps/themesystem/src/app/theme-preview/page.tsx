"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useTheme } from "@acme/theme-system";

export default function ThemePreviewPage() {
  const searchParams = useSearchParams();
  const themeParam = searchParams.get("theme");
  const { setThemeStyle, availableThemes, themeStyle, debugMode } = useTheme();
  const [isReady, setIsReady] = useState(false);

  // Apply the theme style based on query parameter
  useEffect(() => {
    if (themeParam && themeParam !== themeStyle) {
      if (debugMode) {
        console.log(`[ThemePreview] Setting theme to: ${themeParam}`);
      }
      setThemeStyle(themeParam);
    }

    // Mark as ready after a brief delay to ensure theme has been applied
    const timer = setTimeout(() => {
      setIsReady(true);
      if (debugMode) {
        console.log("[ThemePreview] Preview is ready");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [themeParam, themeStyle, setThemeStyle, debugMode]);

  // Find the current theme details
  const currentTheme = availableThemes.find(
    (t) => t.id === (themeParam ?? themeStyle),
  );

  if (!isReady) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="theme-preview-component flex h-full w-full flex-col gap-4 p-4">
      {/* Card Component Preview */}
      <div className="rounded-md border border-border bg-card p-4 shadow-sm">
        <h3 className="mb-2 text-lg font-medium">
          {currentTheme?.name ?? "Theme"} Card
        </h3>
        <p className="text-sm text-muted-foreground">
          This is a card component styled with the current theme.
        </p>
        <div className="mt-4 flex gap-2">
          <button className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">
            Primary Button
          </button>
          <button className="rounded-md bg-secondary px-3 py-1 text-sm text-secondary-foreground">
            Secondary
          </button>
        </div>
      </div>

      {/* Form Elements Preview */}
      <div className="rounded-md border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Input Field</label>
          <input
            type="text"
            className="rounded-md border border-input bg-background px-3 py-1 text-sm"
            placeholder="Type something..."
          />
        </div>
      </div>

      {/* Colors Preview */}
      <div className="grid grid-cols-4 gap-2">
        <div className="h-8 rounded-md bg-primary"></div>
        <div className="h-8 rounded-md bg-secondary"></div>
        <div className="h-8 rounded-md bg-accent"></div>
        <div className="h-8 rounded-md bg-muted"></div>
      </div>
    </div>
  );
}
