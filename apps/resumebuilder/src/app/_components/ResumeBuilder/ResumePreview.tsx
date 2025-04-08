"use client";

import { useMemo } from "react";
import { downloadAsPdf } from "@/lib/utils";
import { useResumeStore } from "@/store/resumeStore";
import { Download } from "lucide-react";

import { Button } from "@acme/ui/components/button";
import { Card, CardContent } from "@acme/ui/components/card";

import { CreativeTemplate } from "./templates/CreativeTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ProfessionalTemplate } from "./templates/ProfessionalTemplate";

export function ResumePreview() {
  // Use individual selectors to prevent unnecessary re-renders
  const activeTemplate = useResumeStore((state) => state.activeTemplate);
  const data = useResumeStore((state) => state.data);

  const handleDownload = () => {
    downloadAsPdf(
      "resume-preview",
      `${data.personalInfo.firstName}-${data.personalInfo.lastName}-Resume`,
    );
  };

  // Memoize the template component to prevent infinite renders
  const templateComponent = useMemo(() => {
    switch (activeTemplate.id) {
      case "modern":
        return <ModernTemplate data={data} template={activeTemplate} />;
      case "professional":
        return <ProfessionalTemplate data={data} template={activeTemplate} />;
      case "creative":
        return <CreativeTemplate data={data} template={activeTemplate} />;
      default:
        return <ModernTemplate data={data} template={activeTemplate} />;
    }
  }, [activeTemplate, data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Preview</h3>
        <Button onClick={handleDownload} size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div
            id="resume-preview"
            className="aspect-[210/297] w-full overflow-auto bg-white"
          >
            {templateComponent}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
