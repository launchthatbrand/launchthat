"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { AddSectionButton } from "@/components/resume/AddSectionButton";
import { TemplateGrid } from "@/components/resume/TemplateGrid";
import dynamic from "next/dynamic";

// Use dynamic import for the ResumeImportButton to avoid hydration issues
const ResumeImportButton = dynamic(
  () => import("@/components/resume/ResumeImportButton"),
  { ssr: false },
);

export interface SidebarProps {
  selectedTemplate: string;
  onTemplateSelect: (templateName: string) => void;
  onSectionAdd: (sectionName: string, sectionTitle: string) => void;
}

export function Sidebar({
  selectedTemplate,
  onTemplateSelect,
  onSectionAdd,
}: SidebarProps) {
  return (
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
              onTemplateSelect={onTemplateSelect}
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
        <AddSectionButton onSectionAdd={onSectionAdd} />
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
  );
}
