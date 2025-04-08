"use client";

import { ResumeData, ResumeTemplate } from "@/store/resumeStore";

interface TemplateProps {
  data: ResumeData;
  template?: ResumeTemplate;
}

export function ProfessionalTemplate({ data, template }: TemplateProps) {
  const { firstName, lastName, title } = data.personalInfo;

  // Use default template colors if template is not provided
  const defaultTemplate = {
    primaryColor: "#4b5563",
    secondaryColor: "#f9fafb",
  };

  const activeTemplate = template ?? defaultTemplate;

  // Create a style object based on the template colors
  const styles = {
    header: {
      borderBottom: `2px solid ${activeTemplate.primaryColor}`,
    },
    sectionTitle: {
      color: activeTemplate.primaryColor,
      borderBottom: `1px solid ${activeTemplate.secondaryColor}`,
    },
  };

  return (
    <div className="flex h-full w-full flex-col p-8 font-sans">
      {/* Header */}
      <header className="mb-6 w-full pb-4 text-center" style={styles.header}>
        <h1 className="mb-1 text-3xl font-bold">
          {firstName} {lastName}
        </h1>
        <p className="text-xl text-gray-600">{title}</p>
      </header>

      {/* This is a placeholder - would implement the full template similar to ModernTemplate */}
      <div className="flex flex-1 items-center justify-center">
        <div className="space-y-4 text-center">
          <h2
            className="text-xl font-semibold"
            style={{ color: activeTemplate.primaryColor }}
          >
            Professional Template
          </h2>
          <p className="text-gray-600">
            This is a placeholder for the Professional template design.
            <br />
            The complete implementation would include all resume sections.
          </p>
        </div>
      </div>
    </div>
  );
}
