"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { AddSectionButton } from "@/components/resume/AddSectionButton";
import { TemplateGrid } from "@/components/resume/TemplateGrid";

// Import commented out as we're hiding this feature
// import dynamic from "next/dynamic";

// Use dynamic import for the ResumeImportButton to avoid hydration issues
// Feature hidden for now
// const ResumeImportButton = dynamic(
//   () => import("@/components/resume/ResumeImportButton"),
//   { ssr: false },
// );

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

        {/* Import Resume feature hidden for now
        <AccordionItem value="import">
          <AccordionTrigger>Import Resume</AccordionTrigger>
          <AccordionContent>
            <ResumeImportButton />
          </AccordionContent>
        </AccordionItem>
        */}
      </Accordion>

      <div className="mb-6">
        <h3 className="mb-3 font-medium">Add New Section</h3>
        <AddSectionButton onSectionAdd={onSectionAdd} />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Resume Builder Tips</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
          <li>
            List specific construction projects you've managed or contributed to
          </li>
          <li>Include certifications like OSHA, CCM, and PMP</li>
          <li>
            Highlight equipment or software you're proficient with (AutoCAD,
            etc.)
          </li>
          <li>
            Quantify achievements (e.g., "$5M budget", "15% under budget")
          </li>
          <li>Add safety records and quality management experience</li>
          <li>Use the PDF export to save and print your final resume</li>
        </ul>
      </div>
    </div>
  );
}
