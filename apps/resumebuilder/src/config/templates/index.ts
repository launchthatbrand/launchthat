import type { Template, TemplateName, TemplateStyles } from "./types";
import { corporateTemplate } from "./corporate";
import { creativeTemplate } from "./creative";
import { minimalistTemplate } from "./minimalist";
import { modernTemplate } from "./modern";
import { professionalTemplate } from "./professional";

// Export all templates - with professional first as our primary template
export const templates: Record<TemplateName, Template> = {
  professional: professionalTemplate,
  modern: modernTemplate,
  minimal: minimalistTemplate,
  creative: creativeTemplate,
  corporate: corporateTemplate,
};

// Export types
export type { Template, TemplateStyles, TemplateName } from "./types";

// Helper to get a template by name
export const getTemplate = (name: string): Template => {
  const templateName = name as TemplateName;
  if (templateName in templates) {
    return templates[templateName];
  }

  // Fallback to professional if template not found
  return templates.professional;
};

// Get template styles by name
export const getTemplateStyles = (name: string): TemplateStyles => {
  return getTemplate(name).styles;
};
