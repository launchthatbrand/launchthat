"use client";

import dynamic from "next/dynamic";
// Need to create these components
import { Sidebar } from "@/components/layout/Sidebar";
import { downloadAsPdf } from "@/lib/utils";
import {
  HeaderData,
  SectionItem,
  useResumeStore,
} from "@/store/useResumeStore";

import { ResumeContent } from "../components/resume/ResumeContent";

// Use dynamic import for the ResumeImportButton to avoid hydration issues
// This will be used later when implementing import functionality
const _ResumeImportButton = dynamic(
  () => import("@/components/resume/ResumeImportButton"),
  { ssr: false },
);

export default function Home() {
  // Get state and actions from the store
  const {
    selectedTemplate,
    currentTemplate,
    headerData,
    sections,
    setTemplate,
    updateHeaderData,
    updateSectionItems,
    addSection,
    deleteSection,
  } = useResumeStore();

  const handleSectionChange = (sectionId: string, newItems: SectionItem[]) => {
    updateSectionItems(sectionId, newItems);
  };

  const handleAddSection = (sectionName: string, sectionTitle: string) => {
    addSection(sectionName, sectionTitle);
  };

  const handleDeleteSection = (sectionId: string) => {
    deleteSection(sectionId);
  };

  const handleHeaderChange = (data: HeaderData) => {
    updateHeaderData(data);
  };

  const handleExportPdf = () => {
    downloadAsPdf("resume-content", "my-resume");
  };

  const handleTemplateChange = (templateName: string) => {
    // Format template name with first letter capitalized for logging
    const templateName1stCap =
      templateName.charAt(0).toUpperCase() + templateName.slice(1);
    console.log(`Applying ${templateName1stCap} template...`);

    // Apply the template change
    setTemplate(templateName);
  };

  // Define a subtle background pattern style
  const mainBackgroundStyle = {
    backgroundColor: "#f9fafb",
    backgroundImage: `radial-gradient(#e5e7eb 1px, transparent 1px)`,
    backgroundSize: "20px 20px",
  };

  return (
    <main className="flex min-h-screen w-full" style={mainBackgroundStyle}>
      <Sidebar
        selectedTemplate={selectedTemplate}
        onTemplateSelect={handleTemplateChange}
        onSectionAdd={handleAddSection}
      />

      <ResumeContent
        headerData={headerData}
        sections={sections}
        currentTemplate={currentTemplate}
        selectedTemplate={selectedTemplate}
        onHeaderChange={handleHeaderChange}
        onSectionChange={handleSectionChange}
        onDeleteSection={handleDeleteSection}
        onExportPdf={handleExportPdf}
      />
    </main>
  );
}
