"use client";

import type { Template } from "@/config/templates/types";
import { templates } from "@/config/templates";

interface TemplateGridProps {
  selectedTemplate: string;
  onTemplateSelect: (templateName: string) => void;
}

export const TemplateGrid = ({
  selectedTemplate,
  onTemplateSelect,
}: TemplateGridProps) => {
  // Get all templates
  const templatesList = Object.values(templates);

  const handleTemplateSelect = (templateName: string) => {
    console.log(`Template selected: ${templateName}`);
    onTemplateSelect(templateName);
  };

  // Helper to render template preview based on template style
  const renderTemplatePreview = (template: Template) => {
    const { styles } = template;
    const { layout, primaryColor, secondaryColor, accentColor } = styles;

    // Create different previews based on layout
    switch (layout) {
      case "sidebar-left":
        return (
          <div className="flex h-full w-full">
            <div
              className="h-full w-1/3"
              style={{ backgroundColor: primaryColor }}
            ></div>
            <div className="w-2/3 p-1">
              <div
                className="mb-2 h-3 w-2/3 rounded"
                style={{ backgroundColor: secondaryColor }}
              ></div>
              <div
                className="mb-3 h-2 w-1/2 rounded"
                style={{ backgroundColor: secondaryColor }}
              ></div>
              <div
                className="mb-1 h-2 w-full rounded"
                style={{ backgroundColor: "#e5e5e5" }}
              ></div>
              <div
                className="mb-1 h-2 w-full rounded"
                style={{ backgroundColor: "#e5e5e5" }}
              ></div>
              <div
                className="mb-3 h-2 w-2/3 rounded"
                style={{ backgroundColor: "#e5e5e5" }}
              ></div>
              <div
                className="mb-1 h-2 w-1/3 rounded"
                style={{ backgroundColor: accentColor }}
              ></div>
              <div
                className="mb-1 h-2 w-full rounded"
                style={{ backgroundColor: "#e5e5e5" }}
              ></div>
            </div>
          </div>
        );

      case "sidebar-right":
        return (
          <div className="flex h-full w-full">
            <div className="w-2/3 p-1">
              <div
                className="mb-2 h-3 w-2/3 rounded"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <div
                className="mb-3 h-2 w-1/2 rounded"
                style={{ backgroundColor: secondaryColor }}
              ></div>
              <div
                className="mb-1 h-2 w-full rounded"
                style={{ backgroundColor: "#e5e5e5" }}
              ></div>
              <div
                className="mb-1 h-2 w-full rounded"
                style={{ backgroundColor: "#e5e5e5" }}
              ></div>
              <div
                className="mb-3 h-2 w-2/3 rounded"
                style={{ backgroundColor: "#e5e5e5" }}
              ></div>
              <div
                className="mb-1 h-2 w-1/3 rounded"
                style={{ backgroundColor: accentColor }}
              ></div>
            </div>
            <div
              className="h-full w-1/3"
              style={{ backgroundColor: primaryColor }}
            ></div>
          </div>
        );

      case "split":
        return (
          <div className="flex h-full w-full">
            <div
              className="h-full w-1/2"
              style={{ backgroundColor: secondaryColor }}
            >
              <div
                className="mx-auto mt-2 h-10 w-10 rounded-full"
                style={{ backgroundColor: primaryColor }}
              ></div>
            </div>
            <div className="w-1/2 p-1">
              <div
                className="mb-2 h-3 w-2/3 rounded"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <div
                className="mb-3 h-2 w-1/2 rounded"
                style={{ backgroundColor: "#e5e5e5" }}
              ></div>
              <div
                className="mb-1 h-2 w-full rounded"
                style={{ backgroundColor: "#e5e5e5" }}
              ></div>
              <div
                className="mb-1 h-2 w-full rounded"
                style={{ backgroundColor: "#e5e5e5" }}
              ></div>
              <div
                className="mb-1 h-2 w-2/3 rounded"
                style={{ backgroundColor: "#e5e5e5" }}
              ></div>
            </div>
          </div>
        );

      case "minimalist":
        return (
          <div className="h-full w-full p-1">
            <div
              className="mb-3 h-4 w-1/2 rounded"
              style={{ backgroundColor: primaryColor }}
            ></div>
            <div
              className="mb-4 h-2 w-1/3 rounded"
              style={{ backgroundColor: secondaryColor }}
            ></div>
            <div
              className="mb-1 h-2 w-full rounded"
              style={{ backgroundColor: "#e5e5e5" }}
            ></div>
            <div
              className="mb-1 h-2 w-full rounded"
              style={{ backgroundColor: "#e5e5e5" }}
            ></div>
            <div
              className="mb-3 h-2 w-3/4 rounded"
              style={{ backgroundColor: "#e5e5e5" }}
            ></div>
            <div
              className="mb-3 h-1 w-1/4 rounded"
              style={{ backgroundColor: accentColor }}
            ></div>
            <div
              className="mb-1 h-2 w-full rounded"
              style={{ backgroundColor: "#e5e5e5" }}
            ></div>
            <div
              className="mb-1 h-2 w-full rounded"
              style={{ backgroundColor: "#e5e5e5" }}
            ></div>
          </div>
        );

      // Standard layout
      default:
        return (
          <div className="h-full w-full p-1">
            <div
              className="mx-auto mb-1 h-3 w-2/3 rounded text-center"
              style={{ backgroundColor: primaryColor }}
            ></div>
            <div
              className="mx-auto mb-3 h-2 w-1/2 rounded text-center"
              style={{ backgroundColor: secondaryColor }}
            ></div>
            <div
              className="mb-1 h-2 w-full rounded"
              style={{ backgroundColor: "#e5e5e5" }}
            ></div>
            <div
              className="mb-1 h-2 w-full rounded"
              style={{ backgroundColor: "#e5e5e5" }}
            ></div>
            <div
              className="mb-3 h-2 w-2/3 rounded"
              style={{ backgroundColor: "#e5e5e5" }}
            ></div>
            <div className="mb-2 flex gap-1">
              <div
                className="h-2 w-1/5 rounded"
                style={{ backgroundColor: accentColor }}
              ></div>
              <div
                className="h-2 w-1/5 rounded"
                style={{ backgroundColor: accentColor }}
              ></div>
              <div
                className="h-2 w-1/5 rounded"
                style={{ backgroundColor: accentColor }}
              ></div>
            </div>
            <div
              className="mb-1 h-2 w-full rounded"
              style={{ backgroundColor: "#e5e5e5" }}
            ></div>
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-2 md:grid-cols-3">
      {templatesList.map((template) => (
        <button
          key={template.name}
          onClick={() => handleTemplateSelect(template.name)}
          className={`flex h-36 w-full flex-col rounded-lg border transition-all duration-150 ${
            selectedTemplate === template.name
              ? "border-2 border-primary bg-primary/10 shadow-sm"
              : "border border-gray-200 bg-white hover:border-primary/50 hover:bg-gray-50 hover:shadow-md"
          } active:scale-95`}
        >
          <div className="flex-1 overflow-hidden rounded-t-lg border-b">
            {renderTemplatePreview(template)}
          </div>

          <div className="p-2 text-center">
            <div className="font-medium">{template.label}</div>

            {selectedTemplate === template.name && (
              <div className="mt-1 text-xs text-primary">Selected</div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
