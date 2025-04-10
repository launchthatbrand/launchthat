"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { useTheme } from "@acme/theme-system";
import { Button } from "@acme/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui/components/tabs";

export default function ExtensionsPage() {
  const { config } = useTheme();

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
          <h1 className="text-3xl font-bold tracking-tight">
            Theme Extensions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Extend the core theme system with app-specific styling options
            tailored to specific use cases like resume builders, dashboards, and
            more.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Resume Builder Extension</CardTitle>
              <CardDescription>
                Theme templates for different resume styles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="modern">
                <TabsList className="mb-4">
                  <TabsTrigger value="modern">Modern</TabsTrigger>
                  <TabsTrigger value="classic">Classic</TabsTrigger>
                  <TabsTrigger value="creative">Creative</TabsTrigger>
                </TabsList>
                <TabsContent value="modern" className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="resume-template-modern mb-2 text-lg font-semibold">
                      Modern Resume Template
                    </h3>
                    <p className="text-muted-foreground">
                      Clean, professional layout with modern typography and a
                      minimalist approach.
                    </p>
                    <div className="mt-4 h-40 rounded-md bg-muted p-4">
                      <div className="h-6 w-36 rounded-sm bg-primary/20"></div>
                      <div className="mt-2 h-4 w-24 rounded-sm bg-primary/10"></div>
                      <div className="mt-4 space-y-2">
                        <div className="h-3 w-full rounded-sm bg-muted-foreground/20"></div>
                        <div className="h-3 w-5/6 rounded-sm bg-muted-foreground/20"></div>
                        <div className="h-3 w-4/6 rounded-sm bg-muted-foreground/20"></div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="classic" className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="resume-template-classic mb-2 text-lg font-semibold">
                      Classic Resume Template
                    </h3>
                    <p className="text-muted-foreground">
                      Traditional resume layout that's widely accepted and
                      recognized in most industries.
                    </p>
                    <div className="mt-4 h-40 rounded-md bg-muted p-4">
                      <div className="h-6 w-36 rounded-sm bg-primary/20"></div>
                      <div className="mt-2 h-4 w-24 rounded-sm bg-primary/10"></div>
                      <div className="mt-4 space-y-2">
                        <div className="h-3 w-full rounded-sm bg-muted-foreground/20"></div>
                        <div className="h-3 w-5/6 rounded-sm bg-muted-foreground/20"></div>
                        <div className="h-3 w-4/6 rounded-sm bg-muted-foreground/20"></div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="creative" className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="resume-template-creative mb-2 text-lg font-semibold">
                      Creative Resume Template
                    </h3>
                    <p className="text-muted-foreground">
                      Stand-out design for creative professionals with unique
                      layout and visual elements.
                    </p>
                    <div className="mt-4 h-40 rounded-md bg-muted p-4">
                      <div className="h-6 w-36 rounded-sm bg-primary/20"></div>
                      <div className="mt-2 h-4 w-24 rounded-sm bg-primary/10"></div>
                      <div className="mt-4 space-y-2">
                        <div className="h-3 w-full rounded-sm bg-muted-foreground/20"></div>
                        <div className="h-3 w-5/6 rounded-sm bg-muted-foreground/20"></div>
                        <div className="h-3 w-4/6 rounded-sm bg-muted-foreground/20"></div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/docs/extensions">View Extension API</Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-medium">Creating Extensions</h2>
            <p className="text-muted-foreground">
              Extensions allow you to define app-specific theming options that
              work alongside the core theme system. Create custom extensions for
              specific features like:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Resume templates with different visual styles</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Dashboard layouts with custom widget styling</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Content editor themes with syntax highlighting</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Form builder templates with different input styles</span>
              </li>
            </ul>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Extension Registry</CardTitle>
              <CardDescription>
                Currently registered theme extensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(config.extensions).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(config.extensions).map(([id, extension]) => (
                    <div key={id} className="rounded-md border p-4">
                      <h3 className="mb-2 font-medium">{extension.name}</h3>
                      <p className="mb-2 text-sm text-muted-foreground">
                        {extension.templates.length} templates available
                      </p>
                      <div className="flex gap-2">
                        {extension.templates.map((template) => (
                          <div
                            key={template.id}
                            className="rounded bg-muted px-2 py-1 text-xs"
                          >
                            {template.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  No theme extensions registered.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
