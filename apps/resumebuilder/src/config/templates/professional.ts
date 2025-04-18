import type { Template } from "./types";

// Professional template - Corrected layout: Top Header + 2/3 Left Col + 1/3 Right Col
export const professionalTemplate: Template = {
  name: "professional",
  label: "Professional",
  description:
    "A professional layout with a full header and a main content area beside a narrower sidebar.",
  styles: {
    // --- Core Styles ---
    layout: "split", // Changed to place sidebar on the right
    primaryColor: "#4B5563", // Dark Gray (Primary text)
    secondaryColor: "#6B7280", // Medium Gray (Secondary text/titles)
    accentColor: "#FEECE0", // Peach/Light Orange accent (Potentially unused)
    textColor: "#4B5563", // Default text color
    backgroundColor: "#ffffff",
    fontFamily: "'Inter', sans-serif",

    // --- Header Styles (Top Full Width: Name, Title, Contact, Image) ---
    // Using flex to allow profile image placement on the right
    header:
      "flex items-start justify-between px-6 md:px-10 py-8 mb-6 border-b border-gray-200",
    headerName: "text-3xl font-bold text-gray-800 mb-1",
    headerTitle: "text-lg text-gray-600 mb-3",
    headerContact: "text-sm text-gray-600", // Style for contact info within header

    // --- Main Content Styles (Left Column - 2/3) ---
    section: "mb-8 pr-6 md:pr-8 pt-6", // Main content area styles
    sectionTitle:
      "text-base font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-4", // Style for titles like 'EXPERIENCE'
    item: "mb-1 text-gray-700 text-sm", // Added text-sm
    input: "text-sm text-gray-800 focus:ring-1 focus:ring-gray-300 rounded", // Added text-sm

    // --- Sidebar Styles (Right Column - 1/3) ---
    sidebar: "w-1/3 pl-6 md:pl-8 pt-6 border-l border-gray-200", // Width, padding, border for right sidebar
    sidebarSection: "mb-6",
    sidebarTitle:
      "text-sm uppercase tracking-[0.1em] text-gray-500 mb-3 font-semibold border-b border-gray-200 pb-1", // Style for titles like 'EDUCATION', 'SKILLS'
    sidebarItem: "mb-1 text-gray-700 text-xs", // Changed to text-xs
    sidebarInput:
      "text-xs text-gray-700 focus:ring-1 focus:ring-gray-300 rounded", // Changed to text-xs

    // --- Skill Display ---
    skillDisplay: "text",

    // --- Custom Classes ---
    customClasses: {
      // Style for the block containing name, title, contact info within the header
      headerTextContainer: "flex-1 mr-6 text-center",
      // Style for contact info within the header
      contactIcon: "inline-block mr-1.5 text-gray-500 h-4 w-4",
      contactItem: "flex items-center text-sm text-gray-600 mr-4 mb-1",
      // Profile image style for header placement
      profileImage: "w-24 h-24 rounded-full object-cover flex-shrink-0", // Placed on the right of header
      // Styles for main content Experience section
      jobTitle: "font-semibold text-gray-800",
      companyDate: "text-sm text-gray-500 mb-1",
    },
  },
};
