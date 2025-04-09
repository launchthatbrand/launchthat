import { Template } from "./types";

// Corporate template for business-focused profiles
export const corporateTemplate: Template = {
  name: "corporate",
  label: "Corporate",
  description:
    "A structured, conservative design suited for corporate and executive roles.",
  styles: {
    layout: "standard",
    primaryColor: "#003366", // Navy blue
    secondaryColor: "#e6eef7", // Light blue
    accentColor: "#990000", // Burgundy accent
    textColor: "#333333",
    backgroundColor: "#ffffff",
    fontFamily: "Georgia, serif",

    // Main content styling
    section: "mb-8 border-b border-gray-200 pb-4",
    sectionTitle:
      "text-[#003366] text-lg font-bold mb-4 px-2 py-1 border-l-4 border-[#990000]",
    item: "mb-4 pl-2",
    input: "text-gray-800",

    // Header styling
    header: "mb-8 pb-4 border-b-2 border-[#003366]",
    headerName: "text-3xl font-bold text-[#003366] mb-1",
    headerTitle: "text-xl text-[#990000] font-normal italic",

    // Skill display
    skillDisplay: "dots",

    // Custom classes for specific elements
    customClasses: {
      contactIcon: "inline-block mr-2 text-[#003366]",
      profileImage:
        "float-right ml-4 border-2 border-[#003366] w-32 h-32 object-cover",
      bullet: "text-[#990000] mr-2",
      dateRange: "text-[#990000] font-bold mb-1",
      jobTitle: "font-bold text-[#003366]",
      companyName: "text-gray-700 italic mb-2",
      skillDot: "inline-block w-3 h-3 rounded-full mr-1 bg-[#003366]",
      skillEmptyDot:
        "inline-block w-3 h-3 rounded-full mr-1 border border-[#003366]",
      divider: "my-4 border-t-2 border-[#e6eef7]",
      skillWrapper: "mb-2 flex items-center",
      skillLabel: "w-1/3 font-bold text-[#003366]",
    },
  },
};
