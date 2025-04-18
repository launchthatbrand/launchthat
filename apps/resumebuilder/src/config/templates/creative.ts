import type { Template } from "./types";

// Creative template for construction professionals
export const creativeTemplate: Template = {
  name: "creative",
  label: "Creative",
  description:
    "A bold, modern layout with striking contrasts and a split design - perfect for showcasing construction expertise.",
  styles: {
    layout: "sidebar-left",
    primaryColor: "#1c1c1c", // Dark background
    secondaryColor: "#ffd500", // Yellow accent - construction theme
    accentColor: "#ffd500",
    textColor: "#1c1c1c", // Default text color for main content (black)
    backgroundColor: "#ffffff",
    fontFamily: "Poppins, sans-serif",

    // Main content styling (right side)
    section: "mb-8",
    sectionTitle: "text-2xl font-bold text-gray-800 mb-4 relative",
    item: "mb-3 pl-4 border-l-2 border-indigo-200 text-sm",
    input: "text-sm text-gray-800 focus:ring-1 focus:ring-indigo-300 rounded",

    // Header styling (right side)
    header:
      "text-center mb-8 py-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white",
    headerName: "text-4xl font-extrabold tracking-tight",
    headerTitle: "text-xl mt-2 text-indigo-100",
    headerContact: "text-sm text-indigo-200 mt-3", // Added style for contact info

    // Sidebar styling (left side)
    sidebar: "w-1/3 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-8",
    sidebarSection: "mb-8",
    sidebarTitle: "text-lg font-semibold border-b border-gray-600 pb-2 mb-4",
    sidebarItem: "mb-2 text-xs",
    sidebarInput:
      "text-xs text-gray-200 bg-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400",

    // Skill display
    skillDisplay: "bars",

    // Custom classes for specific elements
    customClasses: {
      contactIcon: "inline-block mr-2 text-[#ffd500]",
      profileImage: "w-full object-cover mb-5",
      sectionHighlight: "bg-[#ffd500] h-1 w-12 mb-4",
      nameHighlight: "absolute -bottom-3 left-0 h-3 bg-[#ffd500] w-3/4 -z-10",
      dateRange: "text-gray-700 text-sm mb-1 uppercase tracking-wider", // Darker text for dates
      jobTitle: "text-gray-900 text-lg font-light uppercase tracking-wide", // Darker text for job titles
      companyName: "text-gray-700 mb-2 font-medium", // Already dark
      skillBar: "h-1 bg-[#ffd500] mt-1",
      skillName: "text-sm uppercase tracking-wider font-light text-gray-800", // Darker text for skill names in main content
      aboutSection: "mb-8 text-gray-300 font-light", // For sidebar text
      skillBarBg: "h-1 bg-gray-200 w-full mt-1", // Lighter background for skill bars in main content
    },
  },
};
