// This file is now a re-export of the templates from the templates directory
// This maintains backward compatibility with existing code

import type { Template, TemplateName, TemplateStyles } from "./templates/index";
import { getTemplate, getTemplateStyles, templates } from "./templates/index";

export { templates, getTemplateStyles, getTemplate };

export type { Template, TemplateStyles, TemplateName };
