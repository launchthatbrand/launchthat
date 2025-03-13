"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useHeaderTheme } from "./HeaderTheme";

// Simple client-side header with no server dependencies
export const Header: React.FC<{
  className?: string;
}> = ({ className }) => {
  const [theme, setTheme] = useState<string | null>(null);
  const { headerTheme, setHeaderTheme } = useHeaderTheme();

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme);
  }, [headerTheme, theme]);

  // Determine logo classes based on theme
  const logoClasses = theme === "dark" ? "invert-0" : "invert";

  return (
    <header
      className={`container relative z-20 ${className || ""}`}
      {...(theme ? { "data-theme": theme } : {})}
    >
      <div className="flex justify-between py-8">
        <Link href="/">
          <div className={`h-[34px] w-full max-w-[9.375rem] ${logoClasses}`}>
            Logo
          </div>
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
