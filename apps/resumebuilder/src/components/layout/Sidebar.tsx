"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@acme/ui/components/accordion";
import { RadioGroup, RadioGroupItem } from "@acme/ui/components/radio-group";

import { Label } from "@acme/ui/components/label";
import { ScrollArea } from "@acme/ui/components/scroll-area";

interface SidebarProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

export function Sidebar({ selectedTemplate, onTemplateChange }: SidebarProps) {
  const templates = [
    { id: "modern", name: "Modern" },
    { id: "professional", name: "Professional" },
    { id: "minimal", name: "Minimal" },
  ];

  return (
    <div className="flex h-full w-[300px] flex-col border-r bg-background">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Resume Settings</h2>
      </div>
      <ScrollArea className="flex-1 px-4">
        <Accordion type="single" collapsible defaultValue="templates">
          <AccordionItem value="templates">
            <AccordionTrigger>Templates</AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={selectedTemplate}
                onValueChange={onTemplateChange}
                className="space-y-3"
              >
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={template.id} id={template.id} />
                    <Label htmlFor={template.id}>{template.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  );
}
