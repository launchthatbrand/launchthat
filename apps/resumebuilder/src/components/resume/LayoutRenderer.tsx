"use client";

import type { TemplateStyles } from "@/config/templates";
import type { HeaderData, SectionData } from "@/store/useResumeStore";
import { ResumeHeader } from "@/components/resume/ResumeHeader";
import { SortableSection } from "@/components/resume/SortableSection";

interface LayoutRendererProps {
  headerData: HeaderData;
  sections: SectionData[];
  templateStyles: TemplateStyles;
  templateName: string;
  onHeaderChange: (data: HeaderData) => void;
  onSectionChange: (sectionId: string, items: SectionData["items"]) => void;
  onDeleteSection: (sectionId: string) => void;
}

export const LayoutRenderer = ({
  headerData,
  sections,
  templateStyles,
  templateName,
  onHeaderChange,
  onSectionChange,
  onDeleteSection,
}: LayoutRendererProps) => {
  // Separate sections into sidebar and main content based on configuration
  const renderLayout = () => {
    switch (templateStyles.layout) {
      case "sidebar-left":
        return renderSidebarLayout("left");
      case "sidebar-right":
        return renderSidebarLayout("right");
      case "split":
        return renderSplitLayout();
      case "minimalist":
        return renderMinimalistLayout();
      default:
        return renderStandardLayout();
    }
  };

  // Standard layout with all sections in a single column
  const renderStandardLayout = () => {
    return (
      <div
        className="mx-auto max-w-3xl space-y-8 p-8"
        data-layout-type="standard"
      >
        <ResumeHeader
          data={headerData}
          onChange={onHeaderChange}
          templateStyles={templateStyles}
        />

        {sections.map((section) => (
          <div key={section.id} className="resume-section">
            <SortableSection
              title={section.title}
              items={section.items}
              onItemsChange={(items) => onSectionChange(section.id, items)}
              multiline={
                section.id === "experience" || section.id === "education"
              }
              templateName={templateName}
              onDelete={
                !["experience", "education", "skills"].includes(section.id)
                  ? () => onDeleteSection(section.id)
                  : undefined
              }
            />
          </div>
        ))}
      </div>
    );
  };

  // Sidebar layout with personal info, photo, skills in sidebar
  const renderSidebarLayout = (position: "left" | "right") => {
    // Sections that go in the sidebar (adjust as needed)
    const sidebarSectionIds = ["photo", "skills", "languages", "interests"];

    const sidebarSections = sections.filter((section) =>
      sidebarSectionIds.includes(section.id),
    );

    const mainSections = sections.filter(
      (section) => !sidebarSectionIds.includes(section.id),
    );

    const sidebarClasses = `${templateStyles.sidebar ?? "w-1/3 p-6"} sidebar-content`;
    const mainClasses = `flex-1 p-6 space-y-6 main-content`;

    // Determine sidebar text color variable
    let sidebarTextColorVar = templateStyles.textColor || "#1f2937";
    // Define sidebar bullet color, default black, override for modern
    let sidebarBulletColorVar = "#000000"; // Default black
    if (templateName === "modern") {
      sidebarTextColorVar = "#ffffff"; // Force white text for modern theme sidebar
      sidebarBulletColorVar = "#ffffff"; // Force white bullets for modern theme sidebar
    }
    const sidebarInlineStyles = {
      "--sidebar-text-color": sidebarTextColorVar,
      "--sidebar-bullet-color": sidebarBulletColorVar, // Added bullet color variable
    } as React.CSSProperties;

    const sidebarContent = (
      <div
        className={sidebarClasses}
        style={sidebarInlineStyles}
        data-content-type="sidebar"
      >
        <div className="mb-6">
          <ResumeHeader
            data={headerData}
            onChange={onHeaderChange}
            templateStyles={templateStyles}
            compactMode={true}
          />
        </div>

        {sidebarSections.map((section) => (
          <div key={section.id} className="resume-section">
            <SortableSection
              title={section.title}
              items={section.items}
              onItemsChange={(items) => onSectionChange(section.id, items)}
              multiline={false}
              templateName={templateName}
              onDelete={
                !["skills"].includes(section.id)
                  ? () => onDeleteSection(section.id)
                  : undefined
              }
              isSidebar={true}
            />
          </div>
        ))}
      </div>
    );

    const mainContent = (
      <div className={mainClasses} data-content-type="main">
        {mainSections.map((section) => (
          <div key={section.id} className="resume-section">
            <SortableSection
              title={section.title}
              items={section.items}
              onItemsChange={(items) => onSectionChange(section.id, items)}
              multiline={
                section.id === "experience" || section.id === "education"
              }
              templateName={templateName}
              onDelete={
                !["experience", "education"].includes(section.id)
                  ? () => onDeleteSection(section.id)
                  : undefined
              }
            />
          </div>
        ))}
      </div>
    );

    return (
      <div
        className={`mx-auto flex max-w-3xl flex-1`}
        data-layout-type={`sidebar-${position}`}
      >
        {position === "left" ? (
          <>
            {sidebarContent}
            {mainContent}
          </>
        ) : (
          <>
            {mainContent}
            {sidebarContent}
          </>
        )}
      </div>
    );
  };

  // Split layout - Updated to use CSS Columns for Masonry effect
  const renderSplitLayout = () => {
    // ... (keep existing renderSplitLayout implementation)
    const allSections = sections;
    return (
      <div className="mx-auto max-w-3xl space-y-8 p-8" data-layout-type="split">
        <ResumeHeader
          data={headerData}
          onChange={onHeaderChange}
          templateStyles={templateStyles}
        />
        <div className="columns-2 gap-x-8" data-section-row="masonry">
          {allSections.map((section) => (
            <div
              key={section.id}
              className="resume-section mb-8 break-inside-avoid"
            >
              <SortableSection
                title={section.title}
                items={section.items}
                onItemsChange={(items) => onSectionChange(section.id, items)}
                multiline={
                  section.id === "experience" || section.id === "education"
                }
                templateName={templateName}
                onDelete={
                  !["experience", "education", "skills"].includes(section.id)
                    ? () => onDeleteSection(section.id)
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Minimalist layout with clean, centered design
  const renderMinimalistLayout = () => {
    // ... (keep existing renderMinimalistLayout implementation)
    return (
      <div className="mx-auto max-w-2xl space-y-8 p-8">
        <ResumeHeader
          data={headerData}
          onChange={onHeaderChange}
          templateStyles={templateStyles}
        />
        {sections.map((section) => (
          <div key={section.id} className="resume-section">
            <SortableSection
              title={section.title}
              items={section.items}
              onItemsChange={(items) => onSectionChange(section.id, items)}
              multiline={
                section.id === "experience" || section.id === "education"
              }
              templateName={templateName}
              onDelete={
                !["experience", "education", "skills"].includes(section.id)
                  ? () => onDeleteSection(section.id)
                  : undefined
              }
            />
          </div>
        ))}
      </div>
    );
  };

  return renderLayout();
};
