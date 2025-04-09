import { Template } from "./types";

// Modern template inspired by Frank Graham resume
export const modernTemplate: Template = {
  name: "modern",
  label: "Modern",
  description:
    "A clean and professional layout with a sidebar for skills and a main content area.",
  styles: {
    layout: "sidebar-left",
    primaryColor: "#38465a", // Dark blue for sidebar
    secondaryColor: "#69c8c8", // Teal accent
    accentColor: "#69c8c8",
    textColor: "#333333",
    backgroundColor: "#ffffff",
    fontFamily: "Inter, sans-serif",

    // Main content styling
    section: "mb-6",
    sectionTitle: "text-lg font-semibold border-b pb-1 mb-3 text-gray-800",
    item: "hover:bg-gray-50 rounded-md p-1 transition-colors",
    input: "text-gray-800",

    // Header styling
    header: "mb-8 pb-4 flex flex-row items-center gap-6",
    headerName: "text-3xl font-bold text-gray-900",
    headerTitle: "text-xl text-gray-600",

    // Sidebar styling
    sidebar: "bg-[#38465a] text-white p-6 w-1/4",
    sidebarSection: "mb-8",
    sidebarTitle:
      "uppercase text-sm tracking-wider mb-3 font-semibold border-b border-[#69c8c8] pb-1",
    sidebarItem: "py-1",

    // Skill display
    skillDisplay: "bars",

    // Custom classes for specific elements
    customClasses: {
      contactIcon: "inline-block mr-2 text-[#69c8c8]",
      profileImage:
        "rounded-full border-4 border-[#69c8c8] w-32 h-32 object-cover",
      sectionIcon: "p-2 rounded-full bg-[#69c8c8] text-[#38465a] mr-2",
      bullet: "text-[#69c8c8] mr-2",
      skillBar: "h-2 bg-[#69c8c8] rounded-full mt-1",
    },
  },
};
