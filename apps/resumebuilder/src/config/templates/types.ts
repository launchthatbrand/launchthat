export interface TemplateStyles {
  // Layout settings
  layout:
    | "standard"
    | "sidebar-left"
    | "sidebar-right"
    | "minimalist"
    | "split";

  // Color scheme
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;

  // Typography
  fontFamily: string;

  // Section styling
  section: string;
  sectionTitle: string;
  item: string;
  input: string;

  // Header styling
  header: string;
  headerName: string;
  headerTitle: string;

  // Sidebar styling (if applicable)
  sidebar?: string;
  sidebarSection?: string;
  sidebarTitle?: string;
  sidebarItem?: string;

  // Skill display (bars, dots, tags, etc.)
  skillDisplay: "bars" | "dots" | "tags" | "text";

  // Additional custom CSS classes
  customClasses?: Record<string, string>;
}

export type TemplateName =
  | "modern"
  | "professional"
  | "minimal"
  | "creative"
  | "corporate";

export interface Template {
  name: TemplateName;
  label: string;
  description: string;
  styles: TemplateStyles;
}
