"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

import { AuthProvider } from "@acme/auth-wsa/AuthProvider";

import type { ThemeStyle } from "../themes/types";
import { SidebarProvider } from "../components/sidebar";
import { Toaster } from "../components/sonner";
import {
  getAllThemeClassNames,
  getThemeClassName,
  themes,
} from "../themes/types";

const THEME_STORAGE_KEY = "theme-style";

interface ThemeContextType {
  themeStyle: ThemeStyle;
  setThemeStyle: (style: ThemeStyle) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export function useTheme() {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error("useTheme must be used within a ThemeProvider");
//   }
//   return context;
// }

function ThemeStyleManager({ themeStyle }: { themeStyle: ThemeStyle }) {
  useEffect(() => {
    const root = document.documentElement;
    const themeClasses = getAllThemeClassNames();

    // Add transition classes before changing themes
    root.classList.add("transition-all", "duration-300");

    // First add the base theme class
    root.classList.add("theme-base");

    // Remove all specific theme classes
    themeClasses.forEach((cls) => root.classList.remove(cls));

    // Add new theme class
    root.classList.add(getThemeClassName(themeStyle));

    // Store theme choice in localStorage
    localStorage.setItem(THEME_STORAGE_KEY, themeStyle);

    // Cleanup function to remove base theme when component unmounts
    return () => {
      root.classList.remove("theme-base");
    };
  }, [themeStyle]);

  return null;
}

interface BaseProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeStyle;
}

export default function BaseProvider({ children }: BaseProviderProps) {
  // // Initialize theme from localStorage or default
  // const [themeStyle, setThemeStyle] = useState<ThemeStyle>(() => {
  //   // Only run on client-side
  //   if (typeof window !== "undefined") {
  //     const stored = localStorage.getItem(
  //       THEME_STORAGE_KEY,
  //     ) as ThemeStyle | null;
  //     return stored ?? defaultTheme;
  //   }
  //   return defaultTheme;
  // });

  return (
    <AuthProvider>
      <SidebarProvider>
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          themes={themes.map((theme) => theme.value)}
          enableSystem
        >
          {/* <ThemeContext.Provider value={{ themeStyle, setThemeStyle }}> */}
          {/* <ThemeStyleManager themeStyle={themeStyle} /> */}
          {children}
          <Toaster />
          {/* </ThemeContext.Provider> */}
        </NextThemeProvider>
      </SidebarProvider>
    </AuthProvider>
  );
}
