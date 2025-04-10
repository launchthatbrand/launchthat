"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CameraIcon, DownloadIcon } from "lucide-react";

import { Button } from "@acme/ui/button";

import { ThemePreviewGenerator } from "~/components/ThemePreviewGenerator";

export default function ThemePreviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [theme, setTheme] = useState<string>("glass");
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const themeOptions = ["glass", "brutalist", "aggressive", "minimal"];

  // Get theme from URL if available
  useEffect(() => {
    const themeParam = searchParams.get("theme");
    if (themeParam && themeOptions.includes(themeParam)) {
      setTheme(themeParam);
    }
  }, [searchParams]);

  // Change theme
  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    router.push(`/theme-preview?theme=${newTheme}`);
  };

  // Handle preview generation
  const handleImageGenerated = (dataUrl: string) => {
    setPreviewUrls((prev) => ({
      ...prev,
      [theme]: dataUrl,
    }));
  };

  // Download image
  const downloadImage = (dataUrl: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Theme Preview Generator</h1>

      {/* Theme selector */}
      <div className="mb-6 flex gap-2">
        {themeOptions.map((themeName) => (
          <Button
            key={themeName}
            variant={theme === themeName ? "default" : "outline"}
            onClick={() => changeTheme(themeName)}
          >
            {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
          </Button>
        ))}
      </div>

      {/* Preview generator */}
      <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
        <ThemePreviewGenerator
          themeId={theme}
          onImageGenerated={handleImageGenerated}
        />
      </div>

      {/* Gallery of generated previews */}
      {Object.keys(previewUrls).length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Generated Previews</h2>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(previewUrls).map(([themeName, url]) => (
              <div
                key={themeName}
                className="overflow-hidden rounded-lg border"
              >
                <div className="flex items-center justify-between bg-gray-100 p-2 dark:bg-gray-800">
                  <span className="font-medium">
                    {themeName.charAt(0).toUpperCase() + themeName.slice(1)}{" "}
                    Theme
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      downloadImage(url, `theme-preview-${themeName}.png`)
                    }
                  >
                    <DownloadIcon className="mr-1 h-4 w-4" />
                    Download
                  </Button>
                </div>
                <img
                  src={url}
                  alt={`${themeName} theme preview`}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Generate all button */}
          {themeOptions.length !== Object.keys(previewUrls).length && (
            <Button
              className="mt-4"
              onClick={() => {
                // Find themes without previews
                const themesToGenerate = themeOptions.filter(
                  (t) => !previewUrls[t],
                );
                if (themesToGenerate.length > 0) {
                  changeTheme(themesToGenerate[0]);
                }
              }}
            >
              <CameraIcon className="mr-1 h-4 w-4" />
              Generate Missing Previews
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
