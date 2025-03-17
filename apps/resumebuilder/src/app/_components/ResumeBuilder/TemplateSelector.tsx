"use client";

import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/resumeStore";

import { Card, CardContent } from "@acme/ui/components/card";
import { Label } from "@acme/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@acme/ui/components/radio-group";

export function TemplateSelector() {
  // Use individual selectors to prevent unnecessary re-renders
  const availableTemplates = useResumeStore(
    (state) => state.availableTemplates,
  );
  const activeTemplate = useResumeStore((state) => state.activeTemplate);
  const setActiveTemplate = useResumeStore((state) => state.setActiveTemplate);

  // Memoize the handler to prevent recreation on each render
  const handleTemplateChange = useCallback(
    (templateId: string) => {
      setActiveTemplate(templateId);
    },
    [setActiveTemplate],
  );

  // Memoize the template options to prevent infinite renders
  const templateOptions = useMemo(() => {
    return availableTemplates.map((template) => (
      <div key={template.id} className="space-y-2">
        <div
          className={cn(
            "relative cursor-pointer overflow-hidden rounded-md border-2 transition-all",
            activeTemplate.id === template.id
              ? "border-primary ring-2 ring-primary ring-opacity-50"
              : "border-transparent hover:border-muted",
          )}
          onClick={() => handleTemplateChange(template.id)}
        >
          <div className="relative aspect-[210/297] w-full bg-muted">
            {/* Placeholder for template thumbnail */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: template.secondaryColor }}
            >
              <div
                className="mb-16 h-2 w-3/4"
                style={{ backgroundColor: template.primaryColor }}
              />
            </div>
          </div>
          <div className="absolute right-2 top-2">
            <RadioGroupItem
              value={template.id}
              id={`template-${template.id}`}
              className="sr-only"
            />
          </div>
        </div>
        <Label
          htmlFor={`template-${template.id}`}
          className="block text-center text-sm font-medium"
        >
          {template.name}
        </Label>
      </div>
    ));
  }, [availableTemplates, activeTemplate.id, handleTemplateChange]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Resume Template</h3>
          <p className="text-sm text-muted-foreground">
            Select a template for your resume. The content remains the same
            across all templates.
          </p>

          <RadioGroup
            value={activeTemplate.id}
            onValueChange={handleTemplateChange}
            className="space-y-3"
          >
            {templateOptions}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
