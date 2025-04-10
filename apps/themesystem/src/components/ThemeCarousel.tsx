"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import { Button } from "@acme/ui/components/button";
import { Card, CardContent } from "@acme/ui/components/card";
import { ScrollArea, ScrollBar } from "@acme/ui/components/scroll-area";
import { cn } from "@acme/ui/lib/utils";

import type { ThemePreview } from "../config/theme.config";

interface ThemeCardProps {
  theme: ThemePreview;
  isActive: boolean;
  onClick: () => void;
}

function ThemeCard({ theme, isActive, onClick }: ThemeCardProps) {
  return (
    <Card
      className={cn(
        "w-[180px] flex-shrink-0 cursor-pointer overflow-hidden transition-all",
        isActive
          ? "ring-2 ring-primary"
          : "hover:ring-1 hover:ring-muted-foreground",
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative h-[120px] w-full">
          <Image
            src={theme.preview}
            alt={theme.name}
            fill
            className="object-cover"
          />
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
              <span className="rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground">
                Active
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium">{theme.name}</h3>
          <p className="truncate text-xs text-muted-foreground">
            {theme.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface ThemeCarouselProps {
  themes: ThemePreview[];
  currentTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export function ThemeCarousel({
  themes,
  currentTheme,
  onSelectTheme,
}: ThemeCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      <ScrollArea className="w-full">
        <div ref={scrollRef} className="flex space-x-4 px-1 pb-4 pt-1">
          {themes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={theme.id === currentTheme}
              onClick={() => onSelectTheme(theme.id)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="absolute left-1 top-1/2 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={scrollLeft}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Scroll left</span>
        </Button>
      </div>

      <div className="absolute right-1 top-1/2 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={scrollRight}
        >
          <ChevronRightIcon className="h-4 w-4" />
          <span className="sr-only">Scroll right</span>
        </Button>
      </div>
    </div>
  );
}
