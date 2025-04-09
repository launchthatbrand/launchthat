"use client";

import { useEffect, useState } from "react";

import { TemplatePreview } from "./TemplatePreview";
import { templates } from "@/config/templates";

interface TemplateGridProps {
  selectedTemplate: string;
  onTemplateSelect: (templateName: string) => void;
}

export const TemplateGrid = ({
  selectedTemplate,
  onTemplateSelect,
}: TemplateGridProps) => {
  const [isSelecting, setIsSelecting] = useState(false);

  // Debug selected template
  useEffect(() => {
    console.log("TemplateGrid - Current template:", selectedTemplate);
  }, [selectedTemplate]);

  // Get all template names
  const templateNames = Object.keys(templates);

  const handleTemplateClick = (templateName: string) => {
    if (isSelecting) return;
    if (selectedTemplate === templateName) return;

    console.log(`Handling template selection: ${templateName}`);

    // Set selection state to prevent multiple rapid selections
    setIsSelecting(true);

    // Call the parent component's handler
    onTemplateSelect(templateName);

    // Release the selection lock after a delay
    setTimeout(() => setIsSelecting(false), 300);
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-2 md:grid-cols-3">
      {templateNames.map((templateName) => (
        <TemplatePreview
          key={templateName}
          templateName={templateName}
          isSelected={selectedTemplate === templateName}
          onClick={() => handleTemplateClick(templateName)}
        />
      ))}
    </div>
  );
};
