"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@acme/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { Input } from "@acme/ui/components/input";
import { Label } from "@acme/ui/components/label";

/**
 * This page is used by the theme preview generator
 * It renders components with a specific theme applied for screenshot capture
 */
export default function PreviewPage() {
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);

  // Get the theme ID from URL query params
  const themeId = searchParams.get("theme") ?? "glass";

  // Apply the theme class to the document
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Clear existing theme classes
      const htmlEl = document.documentElement;
      const classList = Array.from(htmlEl.classList);

      classList.forEach((cls) => {
        if (cls.startsWith("theme-")) {
          htmlEl.classList.remove(cls);
        }
      });

      // Add the requested theme class
      htmlEl.classList.add(`theme-${themeId}`);

      // Set ready flag after a brief delay to ensure styles are applied
      setTimeout(() => setIsReady(true), 500);
    }
  }, [themeId]);

  return (
    <div className="preview-container bg-background p-6">
      <div
        className={`${isReady ? "preview-ready" : "preview-loading"} hidden`}
      />

      <div className="mx-auto flex max-w-3xl flex-col space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {themeId.charAt(0).toUpperCase() + themeId.slice(1)} Theme
        </h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Card Component */}
          <Card>
            <CardHeader>
              <CardTitle>Card Component</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is a standard card component displaying content with the
                current theme styles applied.
              </p>
            </CardContent>
          </Card>

          {/* Button Variations */}
          <Card>
            <CardHeader>
              <CardTitle>Button Variations</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </CardContent>
          </Card>

          {/* Input and Form Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Form Controls</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <h1 className="text-2xl font-semibold">Heading 1</h1>
              <h2 className="text-xl font-medium">Heading 2</h2>
              <p className="text-base">Regular paragraph text</p>
              <p className="text-sm text-muted-foreground">Small muted text</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
