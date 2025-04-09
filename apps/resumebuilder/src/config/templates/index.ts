import type { Template, TemplateName, TemplateStyles } from "./types";

import { corporateTemplate } from "./corporate";
import { creativeTemplate } from "./creative";
import { minimalistTemplate } from "./minimalist";
import { modernTemplate } from "./modern";
import { professionalTemplate } from "./professional";

// Export all templates
export const templates: Record<TemplateName, Template> = {
  modern: modernTemplate,
  professional: professionalTemplate,
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

  // Fallback to modern if template not found
  return templates.modern;
};

// Get template styles by name
export const getTemplateStyles = (name: string): TemplateStyles => {
  return getTemplate(name).styles;
};
