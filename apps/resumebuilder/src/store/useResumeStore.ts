import type { TemplateName, TemplateStyles } from "@/config/templates";
import { getTemplateStyles, templates } from "@/config/templates";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

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
  selectedTemplate: TemplateName;
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
  resetToDefaults: () => void;
}

// Initial data
const initialSections: SectionData[] = [
  {
    id: "experience",
    title: "Experience",
    items: [
      {
        id: "exp1",
        value:
          "Civil Engineer at Bridge Construction Corp | 2018-Present | Led structural integrity analysis for 3 major bridge projects.",
      },
      {
        id: "exp2",
        value:
          "Project Manager at Highway Development Inc | 2015-2018 | Managed road construction projects with $5M+ budgets.",
      },
    ],
  },
  {
    id: "education",
    title: "Education",
    items: [
      {
        id: "edu1",
        value: "BS in Civil Engineering, University of Engineering | 2011-2015",
      },
      {
        id: "edu2",
        value:
          "Professional Engineering License, State Board of Engineering | 2017",
      },
    ],
  },
  {
    id: "skills",
    title: "Skills",
    items: [
      { id: "skill1", value: "Structural Analysis" },
      { id: "skill2", value: "AutoCAD" },
      { id: "skill3", value: "Construction Management" },
      { id: "skill4", value: "Project Planning" },
      { id: "skill5", value: "Quality Control" },
    ],
  },
  {
    id: "certifications",
    title: "Certifications",
    items: [
      { id: "cert1", value: "Certified Construction Manager (CCM)" },
      { id: "cert2", value: "OSHA 30-Hour Safety Certification" },
    ],
  },
];

const initialHeaderData: HeaderData = {
  fullName: "Robert Johnson",
  title: "Civil Engineer & Project Manager",
  email: "robert.johnson@example.com",
  phone: "(555) 123-4567",
  location: "Portland, OR",
  website: "robertjohnsonengineering.com",
  profileImage: "",
};

// Create the store
export const useResumeStore = create<ResumeState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        selectedTemplate: "professional",
        currentTemplate: getTemplateStyles("professional"),
        headerData: initialHeaderData,
        sections: initialSections,

        // Actions
        setTemplate: (templateName: string) => {
          // Ensure the template name is valid
          if (Object.keys(templates).includes(templateName)) {
            set({
              selectedTemplate: templateName as TemplateName,
              currentTemplate: getTemplateStyles(templateName),
            });
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

        // Reset to defaults
        resetToDefaults: () => {
          const defaultTemplateName = "classic";
          const defaultTemplate = getTemplateStyles(defaultTemplateName);
          set({
            selectedTemplate: defaultTemplateName as TemplateName,
            currentTemplate: defaultTemplate,
            headerData: {
              fullName: "Robert Johnson",
              title: "Civil Engineer & Project Manager",
              email: "robert.johnson@email.com",
              phone: "(555) 123-4567",
              location: "Anytown, USA",
              website: "linkedin.com/in/robertjohnson",
            },
            sections: initialSections,
          });
        },
      }),
      {
        name: "resume-builder-store-v2",
        storage: createJSONStorage(() => localStorage),
        // Only persist resume data, not transient tour command state
        partialize: (state) => ({
          selectedTemplate: state.selectedTemplate,
          currentTemplate: state.currentTemplate,
          headerData: state.headerData,
          sections: state.sections,
        }),
      },
    ),
  ),
);
