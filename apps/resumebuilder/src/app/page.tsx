"use client";

import type { TemplateStyles } from "@/config/templates";
import type { Tour } from "nextstepjs";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
// Need to create these components
import { Sidebar } from "@/components/layout/Sidebar";
import { CustomTourCard } from "@/components/onboarding/CustomTourCard";
import {
  HeaderData,
  SectionData,
  SectionItem,
  useResumeStore,
} from "@/store/useResumeStore";
// Import NextStep components and hook
import { NextStep, NextStepProvider, useNextStep } from "nextstepjs";

import { ResumeContent } from "../components/resume/ResumeContent";

// Use dynamic import for the ResumeImportButton to avoid hydration issues
// This will be used later when implementing import functionality
const _ResumeImportButton = dynamic(
  () => import("@/components/resume/ResumeImportButton"),
  { ssr: false },
);

// Function to clear old localStorage data
const clearOldStorageData = () => {
  try {
    // Remove the old storage keys to ensure the new defaults are used
    localStorage.removeItem("resume-builder-storage");
    localStorage.removeItem("resume-builder-storage-construction-v1");

    // Also remove any potential Zustand cache items for the resume builder
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith("resume-builder") || key.includes("zustand"))
      ) {
        localStorage.removeItem(key);
        console.log(`Removed localStorage item: ${key}`);
      }
    }

    console.log("Cleared resume builder storage data");
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

// Define the updated onboarding steps
const onboardingSteps: Tour[] = [
  {
    tour: "initialOnboarding",
    steps: [
      {
        icon: "🎨",
        selector: "#template-sidebar", // Target the sidebar
        title: "1. Select a Template",
        content: "Choose a base style for your resume.",
        side: "right",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "👤",
        selector: "#resume-header", // Target the header section
        title: "2. Personal Information",
        content: "Click on your name, title, or contact details to edit them.",
        side: "bottom", // Position below the header
        showControls: true,
        showSkip: true,
        viewportID: "resume-viewport",
      },
      {
        icon: "➕",
        selector: "#sections-container",
        title: "3. Add & Edit Sections",
        content:
          "Fill in details for Experience, Skills, etc. Use the 'Add Section' button in the sidebar for more sections.",
        side: "bottom",
        showControls: true,
        showSkip: true,
        viewportID: "resume-viewport",
      },
      {
        icon: "💾",
        selector: "#print-button-container", // Target the button's container
        title: "4. Save or Print",
        content:
          "When you're finished, use this button to save your resume as a PDF or print it.",
        side: "bottom-right",
        showControls: true,
        showSkip: true,
        viewportID: "page-viewport",
      },
    ],
  },
];

// Define props for the inner layout component
interface ResumeAppLayoutProps {
  selectedTemplate: string;
  currentTemplate: TemplateStyles;
  headerData: HeaderData;
  sections: SectionData[];
  onTemplateChange: (templateName: string) => void;
  onSectionAdd: (sectionName: string, sectionTitle: string) => void;
  onHeaderChange: (data: HeaderData) => void;
  onSectionChange: (sectionId: string, items: SectionItem[]) => void;
  onDeleteSection: (sectionId: string) => void;
}

// Inner component that uses the NextStep hook
const ResumeAppLayout = ({
  selectedTemplate,
  currentTemplate,
  headerData,
  sections,
  onTemplateChange,
  onSectionAdd,
  onHeaderChange,
  onSectionChange,
  onDeleteSection,
}: ResumeAppLayoutProps) => {
  // Get tour state and controls, including visibility state
  const {
    startNextStep,
    setCurrentStep,
    currentStep,
    currentTour,
    isNextStepVisible,
  } = useNextStep();

  const mainRef = useRef<HTMLElement>(null);

  // Function to trigger the tour
  const handleStartTour = () => {
    console.log("Starting onboarding tour...");
    startNextStep("initialOnboarding");
  };

  // TEMP: Start tour automatically on load for testing
  useEffect(() => {
    const timer = setTimeout(() => {
      handleStartTour();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to toggle body and main element class based on tour visibility
  useEffect(() => {
    const mainEl = mainRef.current;
    if (isNextStepVisible) {
      document.body.classList.add("tour-active");
      mainEl?.classList.add("tour-active");
    } else {
      document.body.classList.remove("tour-active");
      mainEl?.classList.remove("tour-active");
    }
    // Cleanup function
    return () => {
      document.body.classList.remove("tour-active");
      mainEl?.classList.remove("tour-active");
    };
  }, [isNextStepVisible]);

  // Wrapper function to handle template selection and advance tour
  const handleTemplateSelectAndAdvance = (templateName: string) => {
    onTemplateChange(templateName);
    if (currentTour === "initialOnboarding" && currentStep === 0) {
      console.log(
        "Template selected during tour step 1, advancing with setCurrentStep...",
      );
      setCurrentStep(1); // Directly set step to index 1 (the second step)
    }
  };

  // Define a subtle background pattern style
  const mainBackgroundStyle = {
    backgroundColor: "#f9fafb",
    backgroundImage: `radial-gradient(#e5e7eb 1px, transparent 1px)`,
    backgroundSize: "20px 20px",
  };

  return (
    <main ref={mainRef} className="min-h-screen w-full">
      <NextStep
        steps={onboardingSteps}
        cardComponent={CustomTourCard}
        noInViewScroll={true}
        scrollToTop={true}
      >
        <div
          className="container flex min-h-screen w-full"
          style={mainBackgroundStyle}
        >
          <Sidebar
            selectedTemplate={selectedTemplate}
            // Use the handler that calls setCurrentStep
            onTemplateSelect={handleTemplateSelectAndAdvance}
            onSectionAdd={onSectionAdd}
            id="template-sidebar"
          />
          <ResumeContent
            headerData={headerData}
            sections={sections}
            currentTemplate={currentTemplate}
            selectedTemplate={selectedTemplate}
            onHeaderChange={onHeaderChange}
            onSectionChange={onSectionChange}
            onDeleteSection={onDeleteSection}
          />
        </div>
      </NextStep>
    </main>
  );
};

export default function Home() {
  // Get state and actions from the store
  const {
    selectedTemplate,
    currentTemplate,
    headerData,
    sections,
    setTemplate,
    updateHeaderData,
    updateSectionItems,
    addSection,
    deleteSection,
    resetToDefaults,
  } = useResumeStore();

  // Clear old storage data and reset to defaults on first load
  useEffect(() => {
    clearOldStorageData();
    // Reset to construction-themed defaults
    resetToDefaults();
  }, [resetToDefaults]);

  // Handlers remain here as they interact with the store
  const handleSectionChange = (sectionId: string, newItems: SectionItem[]) => {
    updateSectionItems(sectionId, newItems);
  };
  const handleAddSection = (sectionName: string, sectionTitle: string) => {
    addSection(sectionName, sectionTitle);
  };
  const handleDeleteSection = (sectionId: string) => {
    deleteSection(sectionId);
  };
  const handleHeaderChange = (data: HeaderData) => {
    updateHeaderData(data);
  };
  const handleTemplateChange = (templateName: string) => {
    const templateName1stCap =
      templateName.charAt(0).toUpperCase() + templateName.slice(1);
    console.log(`Applying ${templateName1stCap} template...`);
    setTemplate(templateName);
  };

  return (
    // Render Provider at the top level
    <NextStepProvider>
      {/* Render the inner layout component, passing props */}
      <ResumeAppLayout
        selectedTemplate={selectedTemplate}
        currentTemplate={currentTemplate}
        headerData={headerData}
        sections={sections}
        onTemplateChange={handleTemplateChange}
        onSectionAdd={handleAddSection}
        onHeaderChange={handleHeaderChange}
        onSectionChange={handleSectionChange}
        onDeleteSection={handleDeleteSection}
      />
    </NextStepProvider>
  );
}
