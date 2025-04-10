"use client";

import React, { useState } from "react";
import {
  ChevronUpIcon,
  DesktopIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";

import { Button } from "@acme/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@acme/ui/components/drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui/components/tabs";
import { ToggleGroup, ToggleGroupItem } from "@acme/ui/components/toggle-group";

import type { ThemeStyle } from "../config/theme.config";
import { useTheme } from "../providers/ThemeProvider";
import { ThemeCarousel } from "./ThemeCarousel";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const {
    baseTheme,
    setBaseTheme,
    themeStyle,
    setThemeStyle,
    canChangeBaseTheme,
    canChangeThemeStyle,
    config,
  } = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleBaseThemeChange = (value: string) => {
    if (!value) return;
    setBaseTheme(value as "light" | "dark" | "system");
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className="flex flex-col items-end gap-2">
        {/* Main toggle button with drawer trigger */}
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="default" className="rounded-full p-3">
              {baseTheme === "light" && <SunIcon className="h-5 w-5" />}
              {baseTheme === "dark" && <MoonIcon className="h-5 w-5" />}
              {baseTheme === "system" && <DesktopIcon className="h-5 w-5" />}
            </Button>
          </DrawerTrigger>

          <DrawerContent className="max-h-[40vh]">
            <DrawerHeader>
              <DrawerTitle>Appearance Settings</DrawerTitle>
              <DrawerDescription>
                Customize the appearance of the application
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 pb-8">
              <Tabs defaultValue="base">
                <TabsList className="mb-6 w-full">
                  <TabsTrigger value="base" className="flex-1">
                    Light/Dark Mode
                  </TabsTrigger>
                  <TabsTrigger
                    value="themes"
                    className="flex-1"
                    disabled={!canChangeThemeStyle}
                  >
                    Theme Library
                  </TabsTrigger>
                  <TabsTrigger value="extensions" className="flex-1">
                    Extensions
                  </TabsTrigger>
                </TabsList>

                {/* Base theme selection */}
                <TabsContent value="base" className="mt-0">
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred appearance mode
                    </p>
                    {canChangeBaseTheme ? (
                      <ToggleGroup
                        type="single"
                        value={baseTheme}
                        onValueChange={handleBaseThemeChange}
                        className="justify-center"
                      >
                        <ToggleGroupItem value="light" aria-label="Light mode">
                          <SunIcon className="mr-2 h-4 w-4" />
                          Light
                        </ToggleGroupItem>
                        <ToggleGroupItem value="dark" aria-label="Dark mode">
                          <MoonIcon className="mr-2 h-4 w-4" />
                          Dark
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="system"
                          aria-label="System mode"
                        >
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
                </TabsContent>

                {/* Theme library */}
                <TabsContent value="themes" className="mt-0">
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                      Choose a visual theme for the application
                    </p>

                    {canChangeThemeStyle ? (
                      <ThemeCarousel
                        themes={config.themeLibrary}
                        currentTheme={themeStyle}
                        onSelectTheme={(themeId: string) => {
                          // Only set the theme if it's a valid ThemeStyle
                          if (
                            config.themeLibrary.some(
                              (theme) => theme.id === themeId,
                            )
                          ) {
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
                </TabsContent>

                {/* Extensions tab */}
                <TabsContent value="extensions" className="mt-0">
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                      App-specific theme settings will appear here
                    </p>

                    {Object.keys(config.extensions).length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(config.extensions).map(
                          ([id, extension]) => (
                            <div key={id} className="rounded-md border p-4">
                              <h3 className="mb-2 font-medium">
                                {extension.name}
                              </h3>
                              <p className="mb-2 text-sm text-muted-foreground">
                                {extension.templates.length} templates available
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDrawerOpen(false)}
                              >
                                Configure
                              </Button>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-sm italic text-muted-foreground">
                        No theme extensions available.
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex justify-center pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDrawerOpen(false)}
              >
                <ChevronUpIcon className="mr-1 h-4 w-4" />
                Close
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
