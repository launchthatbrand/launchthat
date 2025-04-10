import Link from "next/link";

import { Button } from "@acme/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";

import { LightDarkToggle } from "~/components/LightDarkToggle";

export default function ThemeSystemDemo() {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center space-y-8 p-4">
      <div className="my-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Theme System</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A powerful and modular theme system for Next.js applications
        </p>
      </div>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Feature Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Light/Dark Mode</CardTitle>
            <CardDescription>
              Toggle between light, dark, and system themes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The theme system includes built-in support for light and dark
              modes with smooth transitions and system preference detection.
            </p>
          </CardContent>
          <CardFooter>
            <LightDarkToggle className="w-full" />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Library</CardTitle>
            <CardDescription>
              Choose from a variety of visual styles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Select from multiple theme styles like Glass, Brutalist, and
              Aggressive to completely transform the look and feel of your app.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/themes">Explore Themes</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extensions</CardTitle>
            <CardDescription>App-specific theme extensions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Build app-specific theme extensions that integrate seamlessly with
              the core theme system, like resume templates or dashboard styles.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/extensions">Learn More</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permission Controls</CardTitle>
            <CardDescription>
              Granular access for different user roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Configure who can change what with fine-grained permission
              controls for base themes, theme library, and extensions.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/permissions">View Settings</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Config-Driven</CardTitle>
            <CardDescription>Powerful configuration options</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Configure your theme system with a simple TypeScript configuration
              file, similar to Payload CMS and other modern frameworks.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/config">View Config</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TypeScript Support</CardTitle>
            <CardDescription>Fully typed APIs and components</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Enjoy complete TypeScript support with typed theme configurations,
              extension APIs, and component props for a smooth development
              experience.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/typescript">View Types</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 max-w-2xl text-center">
        <h2 className="mb-4 text-2xl font-bold">Getting Started</h2>
        <p className="mb-6">
          Start using the theme system in your Next.js projects. Check out the
          documentation for installation and usage instructions.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild>
            <Link href="/docs">Documentation</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href="https://github.com/yourusername/theme-system"
              target="_blank"
            >
              GitHub Repository
            </Link>
          </Button>
        </div>
      </div>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>
          Click the theme toggle in the bottom-right corner to try different
          themes!
        </p>
      </footer>
    </main>
  );
}
