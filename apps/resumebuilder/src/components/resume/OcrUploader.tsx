"use client";

import { FileText, Loader2, Upload } from "lucide-react";
import {
  SectionData,
  SectionItem,
  useResumeStore,
} from "@/store/useResumeStore";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseResumeFile } from "@/lib/documentParser";

interface OcrUploaderProps {
  onParsedData?: (sections: SectionData[]) => void;
}

const OcrUploader = ({ onParsedData }: OcrUploaderProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isPdfJsLoaded, setIsPdfJsLoaded] = useState(false);
  const { addSection, updateSectionItems } = useResumeStore();

  // Only execute on client-side
  useEffect(() => {
    setIsMounted(true);

    // Check if PDF.js is available
    if (typeof window !== "undefined") {
      // Try to load PDF.js to check if it works
      import("pdfjs-dist")
        .then(() => {
          setIsPdfJsLoaded(true);
        })
        .catch((err) => {
          console.error("Failed to load PDF.js:", err);
          setError(
            "PDF support not available. Please try a Word document instead.",
          );
        });
    }
  }, []);

  // Don't render anything until component is mounted on client
  if (!isMounted) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Only process PDF or Word documents
      if (
        file.type !== "application/pdf" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        file.type !== "application/msword"
      ) {
        throw new Error("File must be a PDF or Word document");
      }

      // Check PDF support if it's a PDF file
      if (file.type === "application/pdf" && !isPdfJsLoaded) {
        throw new Error(
          "PDF support is not available. Please try a Word document instead.",
        );
      }

      // Parse the file
      const resumeData = await parseResumeFile(file);

      // Extract and format sections from the parsed data
      const extractedSections: SectionData[] = [];

      // Extract work experience
      if (resumeData.workExperience && resumeData.workExperience.length > 0) {
        const workItems: SectionItem[] = resumeData.workExperience.map(
          (exp) => ({
            id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            value: `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || "Present"})\n${exp.description}`,
          }),
        );

        extractedSections.push({
          id: "extracted-experience",
          title: "Work Experience",
          items: workItems,
        });
      }

      // Extract education
      if (resumeData.education && resumeData.education.length > 0) {
        const eduItems: SectionItem[] = resumeData.education.map((edu) => ({
          id: `edu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          value: `${edu.degree} in ${edu.fieldOfStudy}, ${edu.institution} (${edu.startDate} - ${edu.endDate || "Present"})`,
        }));

        extractedSections.push({
          id: "extracted-education",
          title: "Education",
          items: eduItems,
        });
      }

      // Extract skills
      if (resumeData.skills && resumeData.skills.length > 0) {
        const skillItems: SectionItem[] = resumeData.skills.map((skill) => ({
          id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          value: skill.name,
        }));

        extractedSections.push({
          id: "extracted-skills",
          title: "Skills",
          items: skillItems,
        });
      }

      // Extract certifications if available
      if (resumeData.certifications && resumeData.certifications.length > 0) {
        const certItems: SectionItem[] = resumeData.certifications.map(
          (cert) => ({
            id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            value: `${cert.name} - ${cert.issuer} (${cert.date})`,
          }),
        );

        extractedSections.push({
          id: "extracted-certifications",
          title: "Certifications",
          items: certItems,
        });
      }

      if (extractedSections.length === 0) {
        setError(
          "No resume sections were detected in the document. Please try a different file or format.",
        );
        return;
      }

      // Call the callback with extracted sections if provided
      if (onParsedData) {
        onParsedData(extractedSections);
      }

      // Auto-add extracted sections to the resume
      extractedSections.forEach((section) => {
        const sectionId = `extracted-${section.id}-${Date.now()}`;
        addSection(sectionId, `${section.title} (Imported)`);
        updateSectionItems(sectionId, section.items);
      });
    } catch (err) {
      console.error("Error processing file:", err);
      setError(err instanceof Error ? err.message : "Failed to process file");
    } finally {
      setIsProcessing(false);
      // Reset the input value to allow uploading the same file again
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            type="file"
            id="resume-ocr-upload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Resume
              </>
            )}
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          disabled={isProcessing}
          className="flex-shrink-0"
          onClick={() => document.getElementById("resume-ocr-upload")?.click()}
        >
          <FileText className="h-4 w-4" />
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <p className="text-xs text-gray-500">
        Upload a PDF or Word document to automatically extract resume
        information. Supported file types: .pdf, .doc, .docx
      </p>
    </div>
  );
};

// Export both named and default export for compatibility
export { OcrUploader };
export default OcrUploader;
