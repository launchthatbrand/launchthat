"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { Button } from "@acme/ui/components/button";
import { Card, CardContent } from "@acme/ui/components/card";

import { ThemeStyleToggle } from "~/components/ThemeStyleToggle";

export default function ThemesPage() {
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
