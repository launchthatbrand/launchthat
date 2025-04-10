"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { useTheme } from "@acme/theme-system";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/components/table";

export default function PermissionsPage() {
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
            Permission Controls
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure who can change what with fine-grained permission controls
            for base themes, theme library, and extensions.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Current Permission Settings</CardTitle>
              <CardDescription>
                Theme system permissions configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Access Level</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Base Theme (Light/Dark)
                    </TableCell>
                    <TableCell>
                      <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                        {config.permissions.baseTheme}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      Who can change light/dark mode preference
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Theme Library</TableCell>
                    <TableCell>
                      <span className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                        {config.permissions.themeLibrary}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      Who can change the global theme style
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Extensions</TableCell>
                    <TableCell>
                      <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                        {config.permissions.extensions}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      Who can use app-specific theme extensions
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-medium">Permission Levels</h2>
            <p className="text-muted-foreground">
              The theme system supports three permission levels that can be
              configured for each feature:
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">user</TableCell>
                  <TableCell>
                    All users can change this setting (most permissive)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">admin</TableCell>
                  <TableCell>
                    Only administrators can change this setting
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">none</TableCell>
                  <TableCell>
                    Nobody can change this setting (most restrictive)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Use Cases</CardTitle>
              <CardDescription>
                Common permission configurations for different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="mb-2 font-medium">Public Website</h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  Allow users to set their own preferences
                </p>
                <ul className="text-sm">
                  <li>
                    Base Theme: <strong>user</strong>
                  </li>
                  <li>
                    Theme Library: <strong>none</strong>
                  </li>
                  <li>
                    Extensions: <strong>user</strong>
                  </li>
                </ul>
              </div>
              <div className="rounded-md border p-4">
                <h3 className="mb-2 font-medium">Corporate Portal</h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  Maintain brand consistency with some user flexibility
                </p>
                <ul className="text-sm">
                  <li>
                    Base Theme: <strong>user</strong>
                  </li>
                  <li>
                    Theme Library: <strong>admin</strong>
                  </li>
                  <li>
                    Extensions: <strong>user</strong>
                  </li>
                </ul>
              </div>
              <div className="rounded-md border p-4">
                <h3 className="mb-2 font-medium">Strict Brand Guidelines</h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  Enforce complete visual consistency
                </p>
                <ul className="text-sm">
                  <li>
                    Base Theme: <strong>none</strong>
                  </li>
                  <li>
                    Theme Library: <strong>admin</strong>
                  </li>
                  <li>
                    Extensions: <strong>admin</strong>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
