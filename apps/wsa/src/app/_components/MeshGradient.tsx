"use client";

import { useEffect, useRef } from "react";

import { Gradient } from "./gradient";
import { cn } from "@/lib/utils";

declare module "./gradient" {
  interface Gradient {
    initGradient(selector?: string): Gradient;
  }
}

interface MeshGradientProps {
  className?: string;
}

export function MeshGradient({ className }: MeshGradientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const gradient = new Gradient(containerRef.current);
    gradient.initGradient();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 -z-10 h-full w-full", className)}
    />
  );
}
