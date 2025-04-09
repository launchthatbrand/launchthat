"use client";

import { HeaderData, SectionData } from "@/store/useResumeStore";

import { ResumeHeader } from "@/components/resume/ResumeHeader";
import { SortableSection } from "@/components/resume/SortableSection";
import type { TemplateStyles } from "@/config/templates";

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
      <div className="mx-auto max-w-3xl space-y-8 p-8">
        <ResumeHeader
          data={headerData}
          onChange={onHeaderChange}
          templateStyles={templateStyles}
        />

        {sections.map((section) => (
          <SortableSection
            key={section.id}
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

    const sidebarClasses = `${templateStyles.sidebar ?? "w-1/3 p-6"}`;
    const mainClasses = "flex-1 p-6 space-y-6";

    const sidebarContent = (
      <div className={sidebarClasses}>
        <div className="mb-6">
          <ResumeHeader
            data={headerData}
            onChange={onHeaderChange}
            templateStyles={templateStyles}
            compactMode={true}
          />
        </div>

        {sidebarSections.map((section) => (
          <SortableSection
            key={section.id}
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
        ))}
      </div>
    );

    const mainContent = (
      <div className={mainClasses}>
        {mainSections.map((section) => (
          <SortableSection
            key={section.id}
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
        ))}
      </div>
    );

    return (
      <div className="mx-auto flex max-w-3xl">
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

  // Split layout with personal info on top, and content below in two columns
  const renderSplitLayout = () => {
    const leftSectionIds = ["experience"];
    const rightSectionIds = ["education", "skills", "interests"];

    const leftSections = sections.filter((section) =>
      leftSectionIds.includes(section.id),
    );

    const rightSections = sections.filter((section) =>
      rightSectionIds.includes(section.id),
    );

    const otherSections = sections.filter(
      (section) =>
        !leftSectionIds.includes(section.id) &&
        !rightSectionIds.includes(section.id),
    );

    return (
      <div className="mx-auto max-w-3xl space-y-8 p-8">
        <ResumeHeader
          data={headerData}
          onChange={onHeaderChange}
          templateStyles={templateStyles}
        />

        {otherSections.length > 0 && (
          <div className="mb-6">
            {otherSections.map((section) => (
              <SortableSection
                key={section.id}
                title={section.title}
                items={section.items}
                onItemsChange={(items) => onSectionChange(section.id, items)}
                multiline={true}
                templateName={templateName}
                onDelete={() => onDeleteSection(section.id)}
              />
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <div className="flex-1 space-y-6">
            {leftSections.map((section) => (
              <SortableSection
                key={section.id}
                title={section.title}
                items={section.items}
                onItemsChange={(items) => onSectionChange(section.id, items)}
                multiline={true}
                templateName={templateName}
                onDelete={
                  !["experience"].includes(section.id)
                    ? () => onDeleteSection(section.id)
                    : undefined
                }
              />
            ))}
          </div>

          <div className="flex-1 space-y-6">
            {rightSections.map((section) => (
              <SortableSection
                key={section.id}
                title={section.title}
                items={section.items}
                onItemsChange={(items) => onSectionChange(section.id, items)}
                multiline={section.id === "education"}
                templateName={templateName}
                onDelete={
                  !["education", "skills"].includes(section.id)
                    ? () => onDeleteSection(section.id)
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Minimalist layout with clean, centered design
  const renderMinimalistLayout = () => {
    return (
      <div className="mx-auto max-w-2xl space-y-8 p-8">
        <ResumeHeader
          data={headerData}
          onChange={onHeaderChange}
          templateStyles={templateStyles}
        />

        {sections.map((section) => (
          <SortableSection
            key={section.id}
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
        ))}
      </div>
    );
  };

  return renderLayout();
};
