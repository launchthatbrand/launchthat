import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Define types for resume data
export type ResumeSection =
  | "personalInfo"
  | "workExperience"
  | "education"
  | "skills"
  | "certifications"
  | "socialLinks";

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  socialLinks: SocialLink[];
}

export interface ResumeTemplate {
  id: string;
  name: string;
  thumbnail: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  layout: "single-column" | "two-column" | "modern";
}

export interface ResumeState {
  activeSection: ResumeSection;
  data: ResumeData;
  activeTemplate: ResumeTemplate;
  availableTemplates: ResumeTemplate[];

  // Actions
  setActiveSection: (section: ResumeSection) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addWorkExperience: (experience: Omit<WorkExperience, "id">) => void;
  updateWorkExperience: (
    id: string,
    experience: Partial<WorkExperience>,
  ) => void;
  removeWorkExperience: (id: string) => void;
  addEducation: (education: Omit<Education, "id">) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Omit<Skill, "id">) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addCertification: (certification: Omit<Certification, "id">) => void;
  updateCertification: (
    id: string,
    certification: Partial<Certification>,
  ) => void;
  removeCertification: (id: string) => void;
  addSocialLink: (link: Omit<SocialLink, "id">) => void;
  updateSocialLink: (id: string, link: Partial<SocialLink>) => void;
  removeSocialLink: (id: string) => void;
  setActiveTemplate: (templateId: string) => void;
  resetResumeData: () => void;
  setResumeData: (data: ResumeData) => void;
}

// Define default resume data
const defaultPersonalInfo: PersonalInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  title: "",
  summary: "",
};

// Define available templates
const resumeTemplates: ResumeTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    thumbnail: "/templates/modern.png",
    primaryColor: "#3b82f6",
    secondaryColor: "#f3f4f6",
    fontFamily: "Inter, sans-serif",
    layout: "modern",
  },
  {
    id: "professional",
    name: "Professional",
    thumbnail: "/templates/professional.png",
    primaryColor: "#4b5563",
    secondaryColor: "#f9fafb",
    fontFamily: "Roboto, sans-serif",
    layout: "single-column",
  },
  {
    id: "creative",
    name: "Creative",
    thumbnail: "/templates/creative.png",
    primaryColor: "#8b5cf6",
    secondaryColor: "#f5f3ff",
    fontFamily: "Poppins, sans-serif",
    layout: "two-column",
  },
];

// Ensure we have at least one template
const DEFAULT_TEMPLATE = resumeTemplates[0];

// Create Zustand store
export const useResumeStore = create<ResumeState>()(
  devtools(
    persist(
      (set) => ({
        activeSection: "personalInfo",
        data: {
          personalInfo: defaultPersonalInfo,
          workExperience: [],
          education: [],
          skills: [],
          certifications: [],
          socialLinks: [],
        },
        activeTemplate: DEFAULT_TEMPLATE,
        availableTemplates: resumeTemplates,

        // Actions
        setActiveSection: (section) => set({ activeSection: section }),

        updatePersonalInfo: (info) =>
          set((state) => ({
            data: {
              ...state.data,
              personalInfo: { ...state.data.personalInfo, ...info },
            },
          })),

        addWorkExperience: (experience) =>
          set((state) => ({
            data: {
              ...state.data,
              workExperience: [
                ...state.data.workExperience,
                { id: uuidv4(), ...experience },
              ],
            },
          })),

        updateWorkExperience: (id, experience) =>
          set((state) => ({
            data: {
              ...state.data,
              workExperience: state.data.workExperience.map((item) =>
                item.id === id ? { ...item, ...experience } : item,
              ),
            },
          })),

        removeWorkExperience: (id) =>
          set((state) => ({
            data: {
              ...state.data,
              workExperience: state.data.workExperience.filter(
                (item) => item.id !== id,
              ),
            },
          })),

        addEducation: (education) =>
          set((state) => ({
            data: {
              ...state.data,
              education: [
                ...state.data.education,
                { id: uuidv4(), ...education },
              ],
            },
          })),

        updateEducation: (id, education) =>
          set((state) => ({
            data: {
              ...state.data,
              education: state.data.education.map((item) =>
                item.id === id ? { ...item, ...education } : item,
              ),
            },
          })),

        removeEducation: (id) =>
          set((state) => ({
            data: {
              ...state.data,
              education: state.data.education.filter((item) => item.id !== id),
            },
          })),

        addSkill: (skill) =>
          set((state) => ({
            data: {
              ...state.data,
              skills: [...state.data.skills, { id: uuidv4(), ...skill }],
            },
          })),

        updateSkill: (id, skill) =>
          set((state) => ({
            data: {
              ...state.data,
              skills: state.data.skills.map((item) =>
                item.id === id ? { ...item, ...skill } : item,
              ),
            },
          })),

        removeSkill: (id) =>
          set((state) => ({
            data: {
              ...state.data,
              skills: state.data.skills.filter((item) => item.id !== id),
            },
          })),

        addCertification: (certification) =>
          set((state) => ({
            data: {
              ...state.data,
              certifications: [
                ...state.data.certifications,
                { id: uuidv4(), ...certification },
              ],
            },
          })),

        updateCertification: (id, certification) =>
          set((state) => ({
            data: {
              ...state.data,
              certifications: state.data.certifications.map((item) =>
                item.id === id ? { ...item, ...certification } : item,
              ),
            },
          })),

        removeCertification: (id) =>
          set((state) => ({
            data: {
              ...state.data,
              certifications: state.data.certifications.filter(
                (item) => item.id !== id,
              ),
            },
          })),

        addSocialLink: (link) =>
          set((state) => ({
            data: {
              ...state.data,
              socialLinks: [
                ...state.data.socialLinks,
                { id: uuidv4(), ...link },
              ],
            },
          })),

        updateSocialLink: (id, link) =>
          set((state) => ({
            data: {
              ...state.data,
              socialLinks: state.data.socialLinks.map((item) =>
                item.id === id ? { ...item, ...link } : item,
              ),
            },
          })),

        removeSocialLink: (id) =>
          set((state) => ({
            data: {
              ...state.data,
              socialLinks: state.data.socialLinks.filter(
                (item) => item.id !== id,
              ),
            },
          })),

        setActiveTemplate: (templateId) =>
          set((state) => {
            // Use type assertion to ensure TypeScript knows we'll always have a valid template
            const activeTemplate =
              state.availableTemplates.find((t) => t.id === templateId) ??
              (resumeTemplates[0] as ResumeTemplate);

            return { activeTemplate };
          }),

        resetResumeData: () =>
          set({
            data: {
              personalInfo: defaultPersonalInfo,
              workExperience: [],
              education: [],
              skills: [],
              certifications: [],
              socialLinks: [],
            },
          }),

        setResumeData: (data) => set({ data }),
      }),
      {
        name: "resume-storage",
        skipOptions: true,
      },
    ),
  ),
);
