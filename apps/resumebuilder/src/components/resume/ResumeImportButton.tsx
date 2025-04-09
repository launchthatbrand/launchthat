"use client";

import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { SectionData } from "@/store/useResumeStore";
import dynamic from "next/dynamic";
import { useState } from "react";

// Use dynamic imports for components that might cause hydration issues
const OcrModal = dynamic(() => import("./OcrModal"), {
  ssr: false,
});

const OcrUploader = dynamic(() => import("./OcrUploader"), {
  ssr: false,
});

const ResumeImportButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parsedSections, setParsedSections] = useState<SectionData[]>([]);

  const handleParsedData = (sections: SectionData[]) => {
    if (sections.length > 0) {
      setParsedSections(sections);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => document.getElementById("resume-ocr-upload")?.click()}
        >
          <FileUp className="mr-2 h-4 w-4" />
          <span>Import from PDF/Word</span>
        </Button>
        <div className="hidden">
          <OcrUploader onParsedData={handleParsedData} />
        </div>
        <p className="text-xs text-gray-500">
          Upload a resume to automatically extract experience, education, skills
          and more
        </p>
      </div>

      <OcrModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parsedSections={parsedSections}
      />
    </>
  );
};

// Export both named and default export for compatibility
export { ResumeImportButton };
export default ResumeImportButton;
