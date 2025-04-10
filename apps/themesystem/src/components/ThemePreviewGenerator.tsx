"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import { Switch } from "@acme/ui/switch";

interface ThemePreviewGeneratorProps {
  themeId: string;
  onImageGenerated?: (dataUrl: string) => void;
  autoGenerate?: boolean;
  width?: number;
  height?: number;
}

export function ThemePreviewGenerator({
  themeId,
  onImageGenerated,
  autoGenerate = false,
  width = 600,
  height = 400,
}: ThemePreviewGeneratorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [themeClass, setThemeClass] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [imageDataUrl, setImageDataUrl] = useState<string>("");

  // Set theme class when themeId changes
  useEffect(() => {
    setThemeClass(`theme-${themeId}`);
  }, [themeId]);

  // Capture the component as an image
  const captureAsImage = async () => {
    if (!containerRef.current) return;

    try {
      // Import html-to-image dynamically
      const htmlToImage = await import("html-to-image");

      const dataUrl = await htmlToImage.toPng(containerRef.current, {
        quality: 0.95,
        width,
        height,
      });

      setImageDataUrl(dataUrl);
      onImageGenerated?.(dataUrl);

      return dataUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  };

  // Auto-generate image when component mounts if autoGenerate is true
  useEffect(() => {
    if (autoGenerate) {
      // Small delay to ensure theme classes are applied
      const timer = setTimeout(() => {
        captureAsImage();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [autoGenerate, themeClass]);

  // Toggle dark mode
  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Get all necessary classes
  const containerClasses = `${themeClass} ${isDarkMode ? "dark" : ""} w-full h-full`;

  return (
    <div className="theme-preview-generator">
      <div
        ref={containerRef}
        className={containerClasses}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          overflow: "hidden",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          background: isDarkMode ? "hsl(var(--background))" : "white",
        }}
      >
        {/* Theme name header */}
        <h2 className="text-center text-2xl font-bold">
          {themeId.charAt(0).toUpperCase() + themeId.slice(1)} Theme
        </h2>

        {/* Sample Card */}
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle>Card Component</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              This is how cards look with the {themeId} theme.
            </p>

            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Toggle Feature</Label>
              </div>

              <div className="mt-2 flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Submit</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme color samples */}
        <div className="grid grid-cols-4 gap-2">
          <div className="flex h-8 items-center justify-center rounded-md bg-primary">
            <span className="text-xs text-primary-foreground">Primary</span>
          </div>
          <div className="flex h-8 items-center justify-center rounded-md bg-secondary">
            <span className="text-xs text-secondary-foreground">Secondary</span>
          </div>
          <div className="flex h-8 items-center justify-center rounded-md bg-accent">
            <span className="text-xs text-accent-foreground">Accent</span>
          </div>
          <div className="flex h-8 items-center justify-center rounded-md bg-destructive">
            <span className="text-xs text-destructive-foreground">
              Destructive
            </span>
          </div>
        </div>
      </div>

      {!autoGenerate && (
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={handleDarkModeToggle}
            />
            <Label htmlFor="dark-mode">Dark Mode</Label>
          </div>

          <Button onClick={captureAsImage}>Generate Preview Image</Button>

          {imageDataUrl && (
            <Button
              variant="outline"
              onClick={() => window.open(imageDataUrl, "_blank")}
            >
              View Image
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
