"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionData, useResumeStore } from "@/store/useResumeStore";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface OcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  parsedSections: SectionData[];
}

const OcrModal = ({ isOpen, onClose, parsedSections }: OcrModalProps) => {
  const { addSection, updateSectionItems } = useResumeStore();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedSections, setSelectedSections] = useState<
    Record<string, boolean>
  >({});

  // Only run on client side to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);

    // Initialize selected sections when parsedSections change
    if (parsedSections.length > 0) {
      setSelectedSections(
        parsedSections.reduce(
          (acc, section) => {
            acc[section.id] = true; // Default to selected
            return acc;
          },
          {} as Record<string, boolean>,
        ),
      );
    }
  }, [parsedSections]);

  // Don't render anything until client-side hydration is complete
  if (!isMounted) return null;

  // Toggle section selection
  const toggleSection = (sectionId: string) => {
    setSelectedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Import selected sections
  const handleImport = () => {
    const sectionsToImport = parsedSections.filter(
      (section) => selectedSections[section.id],
    );

    sectionsToImport.forEach((section) => {
      const sectionId = `imported-${section.id}-${Date.now()}`;
      addSection(sectionId, `${section.title} (Imported)`);
      updateSectionItems(sectionId, section.items);
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resume Data Detected</DialogTitle>
          <DialogDescription>
            Select the sections you want to import into your resume.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {parsedSections.length > 0 ? (
            parsedSections.map((section) => (
              <div
                key={section.id}
                className="flex items-start space-x-2 rounded-md border p-3"
              >
                <Checkbox
                  id={section.id}
                  checked={selectedSections[section.id]}
                  onCheckedChange={() => toggleSection(section.id)}
                />
                <div className="flex-1">
                  <Label
                    htmlFor={section.id}
                    className="cursor-pointer text-sm font-medium leading-none"
                  >
                    {section.title}
                  </Label>
                  <p className="mt-1 text-xs text-gray-500">
                    {section.items.length} items detected
                  </p>
                  <div className="mt-2 max-h-20 overflow-y-auto text-xs text-gray-600">
                    {section.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="mb-1">
                        •{" "}
                        {item.value.length > 50
                          ? `${item.value.substring(0, 50)}...`
                          : item.value}
                      </div>
                    ))}
                    {section.items.length > 3 && (
                      <div className="text-gray-400">
                        + {section.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-gray-500">
              No resume data was detected in the document.
            </p>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={
              parsedSections.length === 0 ||
              !Object.values(selectedSections).some((selected) => selected)
            }
          >
            Import Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Export both named and default export for compatibility
export { OcrModal };
export default OcrModal;
