import type { Template } from "./types";

// Creative template inspired by Austin Bronson resume
export const creativeTemplate: Template = {
  name: "creative",
  label: "Creative",
  description:
    "A bold, modern layout with striking contrasts and a split design that stands out.",
  styles: {
    layout: "sidebar-left",
    primaryColor: "#1c1c1c", // Dark background
    secondaryColor: "#ffd500", // Yellow accent
    accentColor: "#ffd500",
    textColor: "#ffffff",
    backgroundColor: "#ffffff",
    fontFamily: "Poppins, sans-serif",

    // Main content styling
    section: "mb-8 px-6",
    sectionTitle:
      "text-lg uppercase tracking-widest mb-4 font-light relative border-b border-gray-200 pb-2",
    item: "mb-6",
    input: "text-gray-800",

    // Header styling
    header: "mb-12",
    headerName: "text-4xl font-bold mb-1 relative pb-2 inline-block",
    headerTitle: "text-gray-500 text-lg font-light",

    // Sidebar styling
    sidebar: "bg-[#1c1c1c] text-white p-8 w-1/3",
    sidebarSection: "mb-8",
    sidebarTitle:
      "text-[#ffd500] uppercase tracking-widest text-base mb-4 font-light",
    sidebarItem: "mb-2 text-gray-300",

    // Skill display
    skillDisplay: "bars",

    // Custom classes for specific elements
    customClasses: {
      contactIcon: "inline-block mr-2 text-[#ffd500]",
      profileImage: "w-full object-cover mb-5",
      sectionHighlight: "bg-[#ffd500] h-1 w-12 mb-4",
      nameHighlight: "absolute -bottom-3 left-0 h-3 bg-[#ffd500] w-3/4 -z-10",
      dateRange: "text-gray-400 text-sm mb-1 uppercase tracking-wider",
      jobTitle: "text-lg font-light uppercase tracking-wide",
      companyName: "text-gray-700 mb-2 font-medium",
      skillBar: "h-1 bg-[#ffd500] mt-1",
      skillName: "text-sm uppercase tracking-wider font-light",
      aboutSection: "mb-8 text-gray-300 font-light",
      skillBarBg: "h-1 bg-gray-800 w-full mt-1",
    },
  },
};
