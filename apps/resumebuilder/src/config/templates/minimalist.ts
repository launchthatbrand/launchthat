import type { Template } from "./types";

// Minimalist template inspired by Olivia Wilson resume
export const minimalistTemplate: Template = {
  name: "minimal",
  label: "Minimalist",
  description:
    "A clean, elegant layout with ample white space and subtle design touches.",
  styles: {
    layout: "split",
    primaryColor: "#333333", // Dark text
    secondaryColor: "#e5e0dd", // Light beige/gray
    accentColor: "#e5e0dd",
    textColor: "#333333",
    backgroundColor: "#fcfbfa",
    fontFamily: "Montserrat, sans-serif",

    // Main content styling
    section: "mb-8 px-2",
    sectionTitle:
      "text-base font-medium uppercase tracking-wide mb-4 text-gray-700 relative",
    item: "mb-5 border-l-2 border-gray-200 pl-4 py-1 hover:border-gray-400 transition-colors text-sm",
    input: "text-sm text-gray-800 focus:ring-1 focus:ring-gray-300 rounded",

    // Header styling
    header: "mb-10 flex flex-col items-start",
    headerName: "text-4xl font-bold text-gray-800 mb-2",
    headerTitle: "text-lg text-gray-600 font-light",

    // Sidebar styling
    sidebar: "bg-[#e5e0dd] p-6 w-1/3 border-r border-gray-200",
    sidebarSection: "mb-8",
    sidebarTitle:
      "text-gray-700 font-semibold text-xl mb-4 pb-2 border-b border-gray-300",
    sidebarItem: "py-1 text-gray-600 text-xs",
    sidebarInput:
      "text-xs text-gray-700 focus:ring-1 focus:ring-gray-400 rounded",

    // Skill display
    skillDisplay: "text",

    // Custom classes for specific elements
    customClasses: {
      contactIcon: "inline-block mr-3 text-gray-500 w-5",
      profileImage: "border border-gray-200 w-full object-cover mb-4",
      contactItem: "flex items-center mb-2 text-gray-600",
      dateRange: "text-sm font-light text-gray-500 mb-1",
      companyName: "font-medium text-gray-800",
      jobTitle: "text-gray-700",
      profileSection: "bg-[#e5e0dd] px-6 py-8",
    },
  },
};
