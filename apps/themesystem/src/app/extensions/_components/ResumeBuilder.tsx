import React, { useEffect, useState } from "react";
import { useTheme, useThemeExtension } from "@acme/theme-system";

interface ThemeExtensionTemplate {
  id: string;
  name: string;
  description?: string;
  variables?: Record<string, string>;
}

interface ThemeExtension {
  id: string;
  name: string;
  description?: string;
  templates: ThemeExtensionTemplate[];
  defaultTemplate?: string;
}

interface ResumeBuilderProps {
  className?: string;
  defaultTemplate?: string;
}

// Fallback values for different themes in case the extension data isn't available
const THEME_FALLBACKS: Record<string, Record<string, string>> = {
  modern: {
    "--resume-heading-color": "var(--primary, #0284c7)",
    "--resume-section-spacing": "1.5rem",
    "--resume-border-color": "var(--border, #e2e8f0)",
    "--resume-heading-font": "var(--font-sans, system-ui, sans-serif)",
    "--resume-accent-color": "#0284c7",
  },
  classic: {
    "--resume-heading-color": "#333333",
    "--resume-section-spacing": "1.25rem",
    "--resume-border-color": "#dddddd",
    "--resume-heading-font": "serif",
    "--resume-accent-color": "#555555",
  },
  creative: {
    "--resume-heading-color": "#ff3e00",
    "--resume-section-spacing": "2rem",
    "--resume-border-color": "#ff3e00",
    "--resume-heading-font": "var(--font-sans, system-ui, sans-serif)",
    "--resume-accent-color": "#ff3e00",
  },
};

/**
 * ResumeBuilder component that uses theme extensions for styling
 * The component applies the theme at the component level, similarly to how next-themes
 * applies themes to the html tag with a data attribute
 */
function ResumeBuilder({
  className,
  defaultTemplate = "modern",
}: ResumeBuilderProps) {
  // Use the theme extension hook to get current theme and setter
  const { currentTheme, setTheme } =
    useThemeExtension<string>("resume-builder");
  const { getExtension } = useTheme();
  const [styleVars, setStyleVars] = useState<Record<string, string>>(
    THEME_FALLBACKS.modern,
  );

  // Get the resume extension data
  const resumeExtension = getExtension<ThemeExtension>("resume-builder");

  // Get theme name (from currentTheme or default)
  const activeTheme = currentTheme ?? defaultTemplate;

  // Since we're targeting this specific component, we add a data attribute
  // This allows us to target styles just for this component instance
  const dataTheme = `resume-theme-${activeTheme}`;

  // Get theme variables when theme changes
  useEffect(() => {
    console.log("Theme changed to:", activeTheme);

    // First try to get variables from the extension
    if (resumeExtension?.templates) {
      const template = resumeExtension.templates.find(
        (t: ThemeExtensionTemplate) => t.id === activeTheme,
      );

      if (template?.variables && Object.keys(template.variables).length > 0) {
        console.log("Found template in extension:", template.name);
        console.log("Theme variables:", template.variables);
        // Ensure we're not passing undefined
        const templateVars: Record<string, string> = template.variables;
        setStyleVars({ ...templateVars });
        return;
      }
    }

    // If extension data isn't available, use our fallback values
    const fallbackThemeKey = Object.keys(THEME_FALLBACKS).includes(activeTheme)
      ? activeTheme
      : "modern";

    console.log("Using fallback theme values for:", fallbackThemeKey);
    setStyleVars({ ...THEME_FALLBACKS[fallbackThemeKey] });
  }, [activeTheme, resumeExtension]);

  // Apply styles directly to the component
  const allStyles = {
    ...styleVars,
  } as React.CSSProperties;

  return (
    <div
      className={`resume-builder ${className ?? ""}`}
      data-theme-extension={dataTheme}
      style={allStyles}
    >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="resume-heading mb-1 text-2xl font-bold">Jane Doe</h1>
        <div className="text-sm">
          <button
            className={`mr-2 rounded border px-2 py-1 ${activeTheme === "modern" ? "bg-slate-100" : "hover:bg-slate-100"}`}
            onClick={() => setTheme("modern")}
          >
            Modern
          </button>
          <button
            className={`mr-2 rounded border px-2 py-1 ${activeTheme === "classic" ? "bg-slate-100" : "hover:bg-slate-100"}`}
            onClick={() => setTheme("classic")}
          >
            Classic
          </button>
          <button
            className={`rounded border px-2 py-1 ${activeTheme === "creative" ? "bg-slate-100" : "hover:bg-slate-100"}`}
            onClick={() => setTheme("creative")}
          >
            Creative
          </button>
        </div>
      </div>

      <p className="resume-contact mb-4 text-sm">
        Frontend Developer • San Francisco, CA • jane.doe@example.com
      </p>

      <h2 className="resume-section-heading text-lg font-semibold">
        Experience
      </h2>
      <div className="resume-section">
        <div className="flex justify-between">
          <strong>Senior Frontend Developer</strong>
          <span>2020 - Present</span>
        </div>
        <div className="resume-company text-sm font-medium">
          Acme Inc., San Francisco
        </div>
        <ul className="mt-2 list-disc pl-5 text-sm">
          <li>Led development of company's design system</li>
          <li>Improved performance by 40% through code optimization</li>
        </ul>
      </div>

      <h2 className="resume-section-heading text-lg font-semibold">
        Education
      </h2>
      <div className="resume-section">
        <div className="flex justify-between">
          <strong>B.S. Computer Science</strong>
          <span>2016 - 2020</span>
        </div>
        <div className="resume-company text-sm font-medium">
          University of California, Berkeley
        </div>
      </div>

      {/* Display current theme info */}
      <div className="mt-4 border-t pt-4 text-sm text-muted-foreground">
        <p>
          Current theme: <strong>{activeTheme}</strong>
        </p>
        <div className="mt-2">
          <details className="mt-2">
            <summary className="cursor-pointer">Applied CSS Variables</summary>
            <pre className="mt-2 overflow-auto rounded bg-slate-50 p-2 text-xs">
              {Object.entries(allStyles).map(([key, value]) => (
                <div key={key}>
                  {key}: {value};
                </div>
              ))}
            </pre>
          </details>
        </div>
      </div>

      {/* Component-specific styles */}
      <style jsx>{`
        .resume-heading {
          color: var(--resume-heading-color);
          font-family: var(--resume-heading-font);
        }

        .resume-section-heading {
          color: var(--resume-heading-color);
          font-family: var(--resume-heading-font);
          margin-bottom: 0.5rem;
        }

        .resume-section {
          margin-bottom: var(--resume-section-spacing);
        }

        .resume-contact {
          border-bottom: 1px solid var(--resume-border-color);
          padding-bottom: 0.5rem;
        }

        .resume-company {
          color: var(--resume-accent-color);
        }
      `}</style>
    </div>
  );
}

export default ResumeBuilder;
