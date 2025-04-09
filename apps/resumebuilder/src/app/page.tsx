"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@acme/ui/components/accordion";
import {
  HeaderData,
  SectionItem,
  useResumeStore,
} from "@/store/useResumeStore";

import { AddSectionButton } from "@/components/resume/AddSectionButton";
import { ResumeHeader } from "@/components/resume/ResumeHeader";
import { SortableSection } from "@/components/resume/SortableSection";
import { TemplateGrid } from "@/components/resume/TemplateGrid";
import { downloadAsPdf } from "@/lib/utils";
import dynamic from "next/dynamic";

// Use dynamic import for the ResumeImportButton to avoid hydration issues
const ResumeImportButton = dynamic(
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
    console.log("Setting template to:", templateName);
    setTemplate(templateName);
  };

  return (
    <main className="flex min-h-screen w-full">
      <div className="w-1/4 border-r p-4">
        <Accordion
          type="single"
          collapsible
          className="mb-6"
          defaultValue="templates"
        >
          <AccordionItem value="templates">
            <AccordionTrigger>Templates</AccordionTrigger>
            <AccordionContent>
              <TemplateGrid
                selectedTemplate={selectedTemplate}
                onTemplateSelect={handleTemplateChange}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="import">
            <AccordionTrigger>Import Resume</AccordionTrigger>
            <AccordionContent>
              <ResumeImportButton />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mb-6">
          <h3 className="mb-3 font-medium">Add New Section</h3>
          <AddSectionButton onSectionAdd={handleAddSection} />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Resume Builder Tips</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>Click on any text to edit it directly</li>
            <li>Drag items to reorder them within a section</li>
            <li>Try different templates to find the best fit</li>
            <li>Add a professional photo for a personal touch</li>
            <li>Use the PDF export to save your final resume</li>
            <li>Import data from existing PDF or Word documents</li>
          </ul>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleExportPdf}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Export to PDF
          </button>
        </div>
        <div id="resume-content" className="mx-auto max-w-3xl space-y-8">
          <ResumeHeader
            data={headerData}
            onChange={handleHeaderChange}
            templateStyles={currentTemplate}
          />

          {sections.map((section) => (
            <SortableSection
              key={section.id}
              title={section.title}
              items={section.items}
              onItemsChange={(items) => handleSectionChange(section.id, items)}
              multiline={
                section.id === "experience" || section.id === "education"
              }
              templateName={selectedTemplate}
              onDelete={
                // Only allow deleting custom sections
                !["experience", "education", "skills"].includes(section.id)
                  ? () => handleDeleteSection(section.id)
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </main>
  );
}
