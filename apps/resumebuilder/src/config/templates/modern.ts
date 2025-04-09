import type { Template } from "./types";

// Modern template with construction theme
export const modernTemplate: Template = {
  name: "modern",
  label: "Modern",
  description:
    "A professional layout ideal for civil engineering and construction professionals with structured sections.",
  styles: {
    layout: "sidebar-left",
    primaryColor: "#1e3a8a", // Deep blue for construction/engineering
    secondaryColor: "#f59e0b", // Amber/yellow for construction highlights
    accentColor: "#f59e0b",
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
    sidebar: "bg-[#1e3a8a] text-white p-6 w-1/4",
    sidebarSection: "mb-8",
    sidebarTitle:
      "uppercase text-sm tracking-wider mb-3 font-semibold border-b border-[#f59e0b] pb-1",
    sidebarItem: "py-1",

    // Skill display
    skillDisplay: "bars",

    // Custom classes for specific elements
    customClasses: {
      contactIcon: "inline-block mr-2 text-[#f59e0b]",
      profileImage:
        "rounded-full border-4 border-[#f59e0b] w-32 h-32 object-cover",
      sectionIcon: "p-2 rounded-full bg-[#f59e0b] text-[#1e3a8a] mr-2",
      bullet: "text-[#f59e0b] mr-2",
      skillBar: "h-2 bg-[#f59e0b] rounded-full mt-1",
    },
  },
};
