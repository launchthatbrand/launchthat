"use client";

import { Plus, X } from "lucide-react";

import { nanoid } from "nanoid";
import { useState } from "react";

interface AddSectionButtonProps {
  onSectionAdd: (sectionName: string, sectionTitle: string) => void;
}

const PREDEFINED_SECTIONS = [
  { id: "projects", title: "Projects" },
  { id: "certifications", title: "Certifications" },
  { id: "languages", title: "Languages" },
  { id: "volunteer", title: "Volunteer Experience" },
  { id: "awards", title: "Awards & Achievements" },
  { id: "interests", title: "Interests & Hobbies" },
  { id: "publications", title: "Publications" },
  { id: "references", title: "References" },
];

export const AddSectionButton = ({ onSectionAdd }: AddSectionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState("");

  const handleAddPredefined = (id: string, title: string) => {
    onSectionAdd(id, title);
    setIsOpen(false);
  };

  const handleAddCustom = () => {
    if (customTitle.trim()) {
      const id = `custom-${nanoid(8)}`;
      onSectionAdd(id, customTitle);
      setCustomTitle("");
      setIsOpen(false);
    }
  };

  return (
    <div className="relative print:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800"
      >
        <Plus size={16} />
        <span>Add Section</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-medium">Add Section</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>
          <div className="space-y-3">
            <div className="grid gap-1.5">
              {PREDEFINED_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleAddPredefined(section.id, section.title)}
                  className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100"
                >
                  {section.title}
                </button>
              ))}
            </div>
            <div className="mt-2 border-t pt-2">
              <label className="mb-1 block text-xs text-gray-500">
                Create Custom Section
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Section Title"
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
                />
                <button
                  onClick={handleAddCustom}
                  disabled={!customTitle.trim()}
                  className="rounded bg-primary px-2 py-1 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
