import type { Template } from "./types";

// Professional template adapted for construction professionals
export const professionalTemplate: Template = {
  name: "professional",
  label: "Professional",
  description:
    "A structured layout for construction and engineering professionals with emphasis on certifications and project experience.",
  styles: {
    layout: "standard",
    primaryColor: "#2a4365", // Navy blue for construction/engineering
    secondaryColor: "#e2e8f0", // Light gray/steel color
    accentColor: "#c53030", // Construction red accent
    textColor: "#333333",
    backgroundColor: "#ffffff",
    fontFamily: "Lato, sans-serif",

    // Main content styling
    section: "mb-6 px-4 py-2",
    sectionTitle:
      "text-base uppercase font-bold tracking-wider border-b border-gray-300 pb-2 mb-4 flex items-center",
    item: "mb-4 pl-5 relative",
    input: "text-gray-800",

    // Header styling
    header: "mb-6 text-center pb-4 border-b border-gray-300",
    headerName: "text-3xl font-bold uppercase tracking-wide mb-1",
    headerTitle: "text-lg mb-3",

    // Skill display
    skillDisplay: "tags",

    // Custom classes for specific elements
    customClasses: {
      contactIcon: "inline-block mr-2 text-[#c53030]",
      profileImage:
        "rounded-full w-28 h-28 object-cover mx-auto mb-3 border border-gray-300",
      sectionIcon: "mr-2 text-[#2a4365]",
      bullet:
        "absolute left-0 top-1.5 w-2 h-2 border border-[#2a4365] rounded-full",
      skillTag:
        "inline-block bg-[#e2e8f0] rounded-full px-3 py-1 text-sm mr-2 mb-2 border-l-2 border-[#c53030]",
      detailSection: "border-r border-gray-300 pr-4",
      dateRange: "text-gray-500 text-sm mb-1 italic",
      jobTitle: "font-bold",
      companyName: "text-gray-700 mb-2",
      infoCard:
        "border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-sm transition-shadow",
      contactRow: "flex items-center mb-1 text-gray-600",
    },
  },
};
