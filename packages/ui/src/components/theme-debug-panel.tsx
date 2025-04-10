"use client";

import { useCallback, useState } from "react";
import { Bug, ChevronDown, ChevronUp, X } from "lucide-react";

import { useTheme } from "../providers/BaseProvider";
import { Button } from "./button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { Label } from "./label";
import { Switch } from "./switch";

interface ThemeDebugPanelProps {
  initialExpanded?: boolean;
}

export function ThemeDebugPanel({
  initialExpanded = false,
}: ThemeDebugPanelProps) {
  const { themeStyle, appThemes, debugMode, setDebugMode, logThemeState } =
    useTheme();
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Use useCallback to prevent recreating functions on each render
  const handleDebugModeChange = useCallback(
    (checked: boolean) => {
      setDebugMode(checked);
    },
    [setDebugMode],
  );

  const handleLogState = useCallback(() => {
    logThemeState();
  }, [logThemeState]);

  const handlePrintDebug = useCallback(() => {
    // Check if we're in a print preview
    const isPrinting =
      document.body.classList.contains("print-preview") ||
      window.matchMedia("print").matches;

    console.log("[Theme Debug] Print state:", isPrinting);

    // Log all computed styles on the resume-content element
    const resumeElement = document.getElementById("resume-content");
    if (resumeElement) {
      const styles = window.getComputedStyle(resumeElement);
      console.log("[Theme Debug] Resume computed styles:", {
        width: styles.width,
        height: styles.height,
        background: styles.background,
        color: styles.color,
        font: styles.font,
        cssVariables: {
          primaryColor: styles.getPropertyValue("--template-primary-color"),
          secondaryColor: styles.getPropertyValue("--template-secondary-color"),
          accentColor: styles.getPropertyValue("--template-accent-color"),
          textColor: styles.getPropertyValue("--template-text-color"),
          backgroundColor: styles.getPropertyValue(
            "--template-background-color",
          ),
        },
      });
    } else {
      console.log("[Theme Debug] Resume element not found");
    }
  }, []);

  const handleOpenPanel = useCallback(() => {
    setIsPanelOpen(true);
  }, []);

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  if (!isPanelOpen) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={handleOpenPanel}
        className="fixed bottom-4 left-4 z-50 h-10 w-10 rounded-full p-0"
      >
        <Bug className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 rounded-lg border bg-background p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center font-semibold">
          <Bug className="mr-2 h-4 w-4" />
          Theme Debug Panel
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleClosePanel}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="debug-mode"
            key={String(debugMode)}
            checked={debugMode}
            onCheckedChange={handleDebugModeChange}
          />
          <Label htmlFor="debug-mode">Debug Mode</Label>
        </div>

        <div className="space-y-2">
          <div className="font-medium">
            Global Theme: <span className="text-primary">{themeStyle}</span>
          </div>

          <Collapsible
            open={isExpanded}
            onOpenChange={setIsExpanded}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                App-specific Themes
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="space-y-2">
              {Object.keys(appThemes).length > 0 ? (
                Object.entries(appThemes).map(([appId, theme]) => (
                  <div key={appId} className="rounded bg-muted p-2 text-xs">
                    <div className="mb-1 font-medium">{appId}:</div>
                    <pre className="max-h-40 overflow-auto">
                      {JSON.stringify(theme, null, 2)}
                    </pre>
                  </div>
                ))
              ) : (
                <div className="text-xs italic text-muted-foreground">
                  No app themes registered
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="flex justify-between gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleLogState}
            className="flex-1"
          >
            Log State
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={handlePrintDebug}
          >
            Print Debug
          </Button>
        </div>
      </div>
    </div>
  );
}
