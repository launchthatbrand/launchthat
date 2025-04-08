"use client";

import { ResumeData, ResumeTemplate } from "@/store/resumeStore";

interface TemplateProps {
  data: ResumeData;
  template?: ResumeTemplate;
}

export function CreativeTemplate({ data, template }: TemplateProps) {
  const { firstName, lastName, title } = data.personalInfo;

  // Use default template colors if template is not provided
  const defaultTemplate = {
    primaryColor: "#8b5cf6",
    secondaryColor: "#f5f3ff",
  };

  const activeTemplate = template ?? defaultTemplate;

  // Create a style object based on the template colors
  const styles = {
    sidebar: {
      backgroundColor: activeTemplate.primaryColor,
      color: "white",
    },
    sectionTitle: {
      color: activeTemplate.primaryColor,
    },
  };

  return (
    <div className="flex h-full w-full font-sans">
      {/* Sidebar */}
      <div className="w-1/3 p-6" style={styles.sidebar}>
        <h1 className="mb-1 text-2xl font-bold">
          {firstName}
          <br />
          {lastName}
        </h1>
        <p className="mb-6 text-lg opacity-90">{title}</p>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6">
        {/* This is a placeholder - would implement the full template similar to ModernTemplate */}
        <div className="flex h-full items-center justify-center">
          <div className="space-y-4 text-center">
            <h2
              className="text-xl font-semibold"
              style={{ color: activeTemplate.primaryColor }}
            >
              Creative Template
            </h2>
            <p className="text-gray-600">
              This is a placeholder for the Creative template design.
              <br />
              The complete implementation would include all resume sections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
