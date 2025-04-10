"use client";

import type { TemplateStyles } from "@/config/templates";
import type { HeaderData, SectionData } from "@/store/useResumeStore";
import { LayoutRenderer } from "@/components/resume/LayoutRenderer";
import { ResumeThemeProvider } from "@/providers/ResumeThemeProvider";

import { useTheme } from "@acme/ui/providers/BaseProvider";

export interface ResumeContentProps {
  headerData: HeaderData;
  sections: SectionData[];
  currentTemplate: TemplateStyles;
  selectedTemplate: string;
  onHeaderChange: (data: HeaderData) => void;
  onSectionChange: (sectionId: string, items: SectionData["items"]) => void;
  onDeleteSection: (sectionId: string) => void;
  onExportPdf: () => void;
}

export function ResumeContent({
  headerData,
  sections,
  currentTemplate,
  selectedTemplate,
  onHeaderChange,
  onSectionChange,
  onDeleteSection,
  onExportPdf,
}: ResumeContentProps) {
  const { debugMode } = useTheme();

  // Get the primary color for the resume frame accent
  const primaryColor = currentTemplate.primaryColor || "#3b82f6";

  // Convert template CSS variables to inline styles to ensure they print correctly
  const templateStyles = {
    "--template-primary-color": currentTemplate.primaryColor || "#3b82f6",
    "--template-secondary-color": currentTemplate.secondaryColor || "#64748b",
    "--template-accent-color": currentTemplate.accentColor || "#f59e0b",
    "--template-text-color": currentTemplate.textColor || "#1f2937",
    "--template-background-color": currentTemplate.backgroundColor || "#ffffff",
  } as React.CSSProperties;

  // Handle export with debug logging
  const handleExportPdf = () => {
    if (debugMode) {
      console.group("[Resume Export Debug]");
      console.log("Exporting template:", selectedTemplate);
      console.log("Template styles:", currentTemplate);

      // Log the computed styles of the resume element
      const resumeEl = document.getElementById("resume-content");
      if (resumeEl) {
        const computedStyles = window.getComputedStyle(resumeEl);
        console.log("Resume element computed styles:", {
          width: computedStyles.width,
          height: computedStyles.height,
          backgroundColor: computedStyles.backgroundColor,
          color: computedStyles.color,
          fontFamily: computedStyles.fontFamily,
          cssVariables: {
            primaryColor: computedStyles.getPropertyValue(
              "--template-primary-color",
            ),
            secondaryColor: computedStyles.getPropertyValue(
              "--template-secondary-color",
            ),
            accentColor: computedStyles.getPropertyValue(
              "--template-accent-color",
            ),
            textColor: computedStyles.getPropertyValue("--template-text-color"),
            backgroundColor: computedStyles.getPropertyValue(
              "--template-background-color",
            ),
          },
        });
      } else {
        console.warn("Resume element not found in DOM");
      }
      console.groupEnd();
    }

    onExportPdf();
  };

  return (
    <ResumeThemeProvider
      templateStyles={currentTemplate}
      templateName={selectedTemplate}
    >
      <div className="flex-1 p-8">
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleExportPdf}
            className="workforce-button rounded-lg px-4 py-2 hover:bg-primary/90 print:hidden"
            data-testid="export-pdf-button"
          >
            Export to PDF
          </button>
        </div>
        <div className="mx-auto max-w-3xl">
          {/* Resume Container with Frame */}
          <div className="relative">
            {/* Top accent border using the template's primary color */}
            <div
              className="absolute inset-x-0 top-0 h-1 rounded-t-md print:hidden"
              style={{ backgroundColor: primaryColor }}
            />

            <div
              id="resume-content"
              className={`overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg print:border-none print:shadow-none template-${selectedTemplate} resume-content`}
              style={{
                ...templateStyles,
                backgroundColor: currentTemplate.backgroundColor || "#ffffff",
                color: currentTemplate.textColor || "inherit",
              }}
              data-template={selectedTemplate}
              data-layout={currentTemplate.layout}
            >
              <LayoutRenderer
                headerData={headerData}
                sections={sections}
                templateStyles={currentTemplate}
                templateName={selectedTemplate}
                onHeaderChange={onHeaderChange}
                onSectionChange={onSectionChange}
                onDeleteSection={onDeleteSection}
              />
            </div>

            {/* Paper-like effect - subtle additional shadows (hidden during print) */}
            <div className="absolute -bottom-1 left-1 right-1 h-1 rounded-b-md bg-gray-100 shadow-sm print:hidden" />
            <div className="absolute -bottom-2 left-2 right-2 h-1 rounded-b-md bg-gray-50 shadow-sm print:hidden" />
          </div>
        </div>
      </div>
    </ResumeThemeProvider>
  );
}
