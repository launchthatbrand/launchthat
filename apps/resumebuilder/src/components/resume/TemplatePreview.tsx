"use client";

import type { TemplateName, TemplateStyles } from "@/config/templates/types";

import { cn } from "@/lib/utils";
import { templates } from "@/config/templates";
import { useState } from "react";

interface TemplatePreviewProps {
  templateName: string;
  isSelected: boolean;
  onClick: () => void;
}

export const TemplatePreview = ({
  templateName,
  isSelected,
  onClick,
}: TemplatePreviewProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Generate display name with first letter capitalized
  const displayName =
    templateName.charAt(0).toUpperCase() + templateName.slice(1);

  // Always fall back to 'modern' template if the requested one doesn't exist
  const actualTemplateName = Object.keys(templates).includes(templateName)
    ? (templateName as TemplateName)
    : ("modern" as TemplateName);

  // Now we can safely access the template - TypeScript now knows it's defined
  const template = templates[actualTemplateName];

  // Extract styles for use in the component
  const templateStyles: TemplateStyles = template.styles;

  // Handle the click with animation
  const handleClick = () => {
    setIsPressed(true);

    // Call the onClick handler after a brief delay for animation
    setTimeout(() => {
      setIsPressed(false);
      onClick();
    }, 100);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setIsPressed(false);
      }}
    >
      <button
        onClick={handleClick}
        className={cn(
          "w-full overflow-hidden rounded-lg border transition-all duration-200",
          isSelected
            ? "border-primary ring-2 ring-primary ring-opacity-50"
            : "border-border hover:border-primary/50",
          isPressed && "scale-95",
        )}
      >
        {/* Template thumbnail */}
        <div className="aspect-[8.5/11] w-full bg-white p-3">
          {/* Header section preview */}
          <div className={cn("w-full scale-90", templateStyles.header)}>
            <div className={templateStyles.headerName}>
              <div className="h-3 w-1/2 rounded-full bg-gray-300" />
            </div>
            <div className={templateStyles.headerTitle}>
              <div className="h-2 w-1/3 rounded-full bg-gray-200" />
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              <div className="h-1.5 w-1/4 rounded-full bg-gray-200" />
              <div className="h-1.5 w-1/4 rounded-full bg-gray-200" />
            </div>
          </div>

          {/* Experience section preview */}
          <div className={cn("mt-2", templateStyles.section)}>
            <div className={templateStyles.sectionTitle}>
              <div className="h-2 w-1/3 rounded-full bg-gray-300" />
            </div>
            <div className="mt-1 space-y-1">
              <div className="h-1.5 w-full rounded-full bg-gray-200" />
              <div className="h-1.5 w-2/3 rounded-full bg-gray-200" />
            </div>
          </div>

          {/* Skills section preview */}
          <div className={cn("mt-2", templateStyles.section)}>
            <div className={templateStyles.sectionTitle}>
              <div className="h-2 w-1/4 rounded-full bg-gray-300" />
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              <div className="h-1.5 w-1/5 rounded-full bg-gray-200" />
              <div className="h-1.5 w-1/4 rounded-full bg-gray-200" />
              <div className="h-1.5 w-1/6 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      </button>

      {/* Template name overlay */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-sm font-medium text-white transition-all",
          isHovering || isSelected ? "opacity-100" : "opacity-70",
        )}
      >
        {displayName}
      </div>

      {/* Zoom overlay on hover */}
      {isHovering && !isSelected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white">
          <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium">
            Select
          </span>
        </div>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      )}
    </div>
  );
};
