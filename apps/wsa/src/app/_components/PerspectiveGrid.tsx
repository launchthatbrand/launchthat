import React from "react";
import { cn } from "@/lib/utils";

interface PerspectiveGridProps {
  className?: string;
  gridColor?: string;
  opacity?: number;
}

export function PerspectiveGrid({
  className,
  gridColor = "43, 14, 77", // Pure blue
}: PerspectiveGridProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="grid-container absolute bottom-0 left-0  w-full">
        <div
          className="absolute bottom-0 left-0 right-0 h-[100vh] w-full"
          style={{
            transform:
              "perspective(200px) rotateX(40deg) scale(2,1) translateZ(0)",
            transformOrigin: "bottom center",
            backgroundImage: `
              linear-gradient(to right, rgb(${gridColor}) 2px, transparent 2px),
              linear-gradient(to bottom, rgb(${gridColor}) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            backgroundPosition: "center bottom",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            WebkitBackgroundClip: "content-box",
            padding: "1px",
            outline: "1px solid transparent",
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "-webkit-gradient(linear, left 90%, left top, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))",
            willChange: "transform",
          }}
        />
      </div>
    </div>
  );
}
