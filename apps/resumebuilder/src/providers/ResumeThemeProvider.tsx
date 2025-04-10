"use client";

import type { TemplateStyles } from "@/config/templates";
import { useEffect } from "react";

import { useTheme } from "@acme/ui/providers/BaseProvider";

export interface ResumeThemeProviderProps {
  children: React.ReactNode;
  templateStyles?: TemplateStyles;
  templateName?: string;
}

export interface ResumeThemeData {
  styles: TemplateStyles;
  name: string;
}

export function ResumeThemeProvider({
  children,
  templateStyles,
  templateName = "professional",
}: ResumeThemeProviderProps) {
  const { setAppTheme, debugMode } = useTheme();

  useEffect(() => {
    if (templateStyles) {
      const resumeTheme: ResumeThemeData = {
        styles: templateStyles,
        name: templateName,
      };

      setAppTheme<ResumeThemeData>("resumeBuilder", resumeTheme);

      if (debugMode) {
        console.log("[Resume Theme Debug] Template styles registered:", {
          name: templateName,
          layout: templateStyles.layout,
          colors: {
            primary: templateStyles.primaryColor,
            secondary: templateStyles.secondaryColor,
            accent: templateStyles.accentColor,
            text: templateStyles.textColor,
            background: templateStyles.backgroundColor,
          },
        });
      }

      // Add CSS variables to document root for global access
      const root = document.documentElement;
      root.style.setProperty(
        "--resume-primary-color",
        templateStyles.primaryColor,
      );
      root.style.setProperty(
        "--resume-secondary-color",
        templateStyles.secondaryColor,
      );
      root.style.setProperty(
        "--resume-accent-color",
        templateStyles.accentColor,
      );
      root.style.setProperty("--resume-text-color", templateStyles.textColor);
      root.style.setProperty(
        "--resume-background-color",
        templateStyles.backgroundColor,
      );
      root.style.setProperty("--resume-font-family", templateStyles.fontFamily);
      root.dataset.resumeTemplate = templateName;
      root.dataset.resumeLayout = templateStyles.layout;
    }
  }, [templateStyles, templateName, setAppTheme, debugMode]);

  return <>{children}</>;
}

// Export a hook to get the resume theme
export function useResumeTheme(): ResumeThemeData | undefined {
  const { getAppTheme } = useTheme();
  return getAppTheme<ResumeThemeData>("resumeBuilder");
}
