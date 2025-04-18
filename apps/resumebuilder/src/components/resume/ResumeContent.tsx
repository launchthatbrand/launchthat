"use client";

import type { TemplateStyles } from "@/config/templates";
import type { HeaderData, SectionData } from "@/store/useResumeStore";
import React, { useRef } from "react";
import { LayoutRenderer } from "@/components/resume/LayoutRenderer";
import { ResumeThemeProvider } from "@/providers/ResumeThemeProvider";
import { NextStepViewport } from "nextstepjs";
import { useReactToPrint } from "react-to-print";

export interface ResumeContentProps {
  headerData: HeaderData;
  sections: SectionData[];
  currentTemplate: TemplateStyles;
  selectedTemplate: string;
  onHeaderChange: (data: HeaderData) => void;
  onSectionChange: (sectionId: string, items: SectionData["items"]) => void;
  onDeleteSection: (sectionId: string) => void;
}

export function ResumeContent({
  headerData,
  sections,
  currentTemplate,
  selectedTemplate,
  onHeaderChange,
  onSectionChange,
  onDeleteSection,
}: ResumeContentProps) {
  const contentToPrintRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: contentToPrintRef,
    documentTitle: `${headerData.fullName || "resume"} - ${selectedTemplate}`,
  });

  const primaryColor = currentTemplate.primaryColor || "#3b82f6";
  const templateStyles = {
    "--template-primary-color": currentTemplate.primaryColor || "#3b82f6",
    "--template-secondary-color": currentTemplate.secondaryColor || "#64748b",
    "--template-accent-color": currentTemplate.accentColor || "#f59e0b",
    "--template-text-color": currentTemplate.textColor || "#1f2937",
    "--template-background-color": currentTemplate.backgroundColor || "#ffffff",
    "--template-font-family": currentTemplate.fontFamily || "sans-serif",
  } as React.CSSProperties;

  return (
    <ResumeThemeProvider
      templateStyles={currentTemplate}
      templateName={selectedTemplate}
    >
      <div className="relative flex-1">
        <NextStepViewport id="page-viewport">
          <div className="flex flex-col gap-5 p-8">
            <div className="right-4 top-4 z-10 flex w-full justify-end">
              <button
                onClick={() => handlePrint()}
                className="workforce-button rounded-lg px-4 py-2 hover:bg-primary/90"
                data-testid="print-pdf-button"
                id="print-button-container"
              >
                Save to PDF / Print
              </button>
            </div>

            <div className="mx-auto max-w-3xl">
              <div className="relative">
                <div
                  className="absolute inset-x-0 top-0 h-1 rounded-t-md print:hidden"
                  style={{ backgroundColor: primaryColor }}
                />
                <div
                  ref={contentToPrintRef}
                  id="resume-content"
                  className={`overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg print:border-none print:shadow-none template-${selectedTemplate} resume-content`}
                  style={{
                    ...templateStyles,
                    backgroundColor:
                      currentTemplate.backgroundColor || "#ffffff",
                    color: currentTemplate.textColor || "inherit",
                  }}
                  data-template={selectedTemplate}
                  data-layout={currentTemplate.layout}
                >
                  <NextStepViewport id="resume-viewport">
                    <LayoutRenderer
                      headerData={headerData}
                      sections={sections}
                      templateStyles={currentTemplate}
                      templateName={selectedTemplate}
                      onHeaderChange={onHeaderChange}
                      onSectionChange={onSectionChange}
                      onDeleteSection={onDeleteSection}
                    />
                  </NextStepViewport>
                </div>
                <div className="absolute -bottom-1 left-1 right-1 h-1 rounded-b-md bg-gray-100 shadow-sm print:hidden" />
                <div className="absolute -bottom-2 left-2 right-2 h-1 rounded-b-md bg-gray-50 shadow-sm print:hidden" />
              </div>
            </div>
          </div>
        </NextStepViewport>
      </div>
    </ResumeThemeProvider>
  );
}
