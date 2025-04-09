import { devtools, persist } from "zustand/middleware";

import type { TemplateStyles } from "@/config/templates";
import { create } from "zustand";
import { templates } from "@/config/templates";

// Define the types
export interface HeaderData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  profileImage?: string;
}

export interface SectionItem {
  id: string;
  value: string;
}

export interface SectionData {
  id: string;
  title: string;
  items: SectionItem[];
}

interface ResumeState {
  // Template selection
  selectedTemplate: keyof typeof templates;
  currentTemplate: TemplateStyles;

  // Resume content
  headerData: HeaderData;
  sections: SectionData[];

  // Actions
  setTemplate: (templateName: string) => void;
  updateHeaderData: (data: HeaderData) => void;
  updateSectionItems: (sectionId: string, items: SectionItem[]) => void;
  addSection: (sectionName: string, sectionTitle: string) => void;
  deleteSection: (sectionId: string) => void;
}

// Initial data
const initialSections: SectionData[] = [
  {
    id: "experience",
    title: "Experience",
    items: [
      { id: "exp1", value: "Software Engineer at Tech Corp" },
      { id: "exp2", value: "Web Developer at Digital Agency" },
    ],
  },
  {
    id: "education",
    title: "Education",
    items: [
      { id: "edu1", value: "BS in Computer Science" },
      { id: "edu2", value: "High School Diploma" },
    ],
  },
  {
    id: "skills",
    title: "Skills",
    items: [
      { id: "skill1", value: "JavaScript" },
      { id: "skill2", value: "React" },
      { id: "skill3", value: "Node.js" },
    ],
  },
];

const initialHeaderData: HeaderData = {
  fullName: "John Doe",
  title: "Full Stack Developer",
  email: "john.doe@example.com",
  phone: "(123) 456-7890",
  location: "San Francisco, CA",
  website: "johndoe.com",
  profileImage: "",
};

// Create the store
export const useResumeStore = create<ResumeState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        selectedTemplate: "modern",
        currentTemplate: templates.modern,
        headerData: initialHeaderData,
        sections: initialSections,

        // Actions
        setTemplate: (templateName: string) => {
          // Ensure the template name is valid
          if (Object.keys(templates).includes(templateName)) {
            set((state) => ({
              selectedTemplate: templateName as keyof typeof templates,
              currentTemplate:
                templates[templateName as keyof typeof templates],
            }));
          } else {
            console.warn(`Invalid template name: ${templateName}`);
          }
        },

        updateHeaderData: (data: HeaderData) => {
          set(() => ({ headerData: data }));
        },

        updateSectionItems: (sectionId: string, items: SectionItem[]) => {
          set((state) => ({
            sections: state.sections.map((section) =>
              section.id === sectionId ? { ...section, items } : section,
            ),
          }));
        },

        addSection: (sectionName: string, sectionTitle: string) => {
          set((state) => {
            // Check if section already exists
            if (state.sections.some((section) => section.id === sectionName)) {
              alert(
                `A section with the name "${sectionTitle}" already exists.`,
              );
              return state;
            }

            const newSection: SectionData = {
              id: sectionName,
              title: sectionTitle,
              items: [{ id: `${sectionName}-1`, value: "" }],
            };

            return { sections: [...state.sections, newSection] };
          });
        },

        deleteSection: (sectionId: string) => {
          set((state) => ({
            sections: state.sections.filter(
              (section) => section.id !== sectionId,
            ),
          }));
        },
      }),
      {
        name: "resume-builder-storage", // Unique name for localStorage
      },
    ),
  ),
);
