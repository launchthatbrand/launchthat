export interface TemplateStyles {
  section: string;
  sectionTitle: string;
  item: string;
  input: string;
  header: string;
  headerName: string;
  headerTitle: string;
}

export const templates: Record<string, TemplateStyles> = {
  modern: {
    section: "mb-6",
    sectionTitle: "text-lg font-semibold border-b pb-1 mb-3",
    item: "hover:bg-gray-50 rounded-md p-1 transition-colors",
    input: "text-gray-800",
    header: "mb-8 border-b pb-4",
    headerName: "text-3xl font-bold text-gray-900",
    headerTitle: "text-xl text-gray-600",
  },
  professional: {
    section: "mb-6",
    sectionTitle:
      "text-lg font-semibold mb-3 text-blue-800 border-b border-blue-200 pb-1",
    item: "hover:bg-blue-50 rounded-md p-1 transition-colors",
    input: "text-gray-800",
    header: "mb-8 bg-blue-50 p-4 rounded-lg",
    headerName: "text-3xl font-bold text-blue-900",
    headerTitle: "text-xl text-blue-700",
  },
  minimal: {
    section: "mb-6",
    sectionTitle:
      "text-md font-medium text-gray-500 uppercase tracking-wider mb-3",
    item: "hover:bg-gray-50 rounded-md p-1 transition-colors",
    input: "text-gray-800",
    header: "mb-6",
    headerName: "text-2xl font-semibold text-gray-900",
    headerTitle: "text-lg text-gray-600",
  },
  classic: {
    section: "mb-6",
    sectionTitle:
      "text-lg font-bold uppercase tracking-wider mb-3 text-gray-700",
    item: "hover:bg-gray-50 rounded-md p-1 transition-colors",
    input: "text-gray-800",
    header: "mb-8 text-center",
    headerName: "text-3xl font-bold text-gray-900 mb-1",
    headerTitle: "text-xl text-gray-600",
  },
  creative: {
    section: "mb-6",
    sectionTitle:
      "text-lg font-bold mb-3 text-purple-700 border-l-4 border-purple-500 pl-2",
    item: "hover:bg-purple-50 rounded-md p-1 transition-colors",
    input: "text-gray-800",
    header: "mb-8 bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg",
    headerName: "text-3xl font-bold text-purple-900",
    headerTitle: "text-xl text-purple-700",
  },
};
