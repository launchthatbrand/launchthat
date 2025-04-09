// Define TextItem and TextContent interfaces based on pdfjs-dist structure
interface TextItem {
  str: string;
  dir?: string;
  transform?: number[];
  width?: number;
  height?: number;
  fontName?: string;
}

interface TextContent {
  items: TextItem[];
  styles?: Record<string, unknown>;
}

// Create a mock textAnalyzer module until the real one is available
export function extractResumeData(_text: string): ResumeData {
  // This is a placeholder implementation
  return {
    contact: {
      name: "Example Name",
      email: "example@email.com",
    },
  };
}

// Define interfaces for the parsed document and resume data
export interface ResumeData {
  // Add more fields as needed
  contact: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    website?: string;
  };
  summary?: string;
  workExperience?: {
    company?: string;
    title?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  education?: {
    institution?: string;
    degree?: string;
    field?: string;
    graduationDate?: string;
    gpa?: string;
  }[];
  skills?: string[];
  certifications?: {
    name?: string;
    issuer?: string;
    date?: string;
  }[];
}

/**
 * Parse a PDF document and extract its text content
 * @param file PDF file to parse
 * @returns Promise with extracted text
 */
export async function parsePdfDocument(file: File): Promise<string> {
  // Only run in browser environment
  if (typeof window === "undefined") {
    throw new Error("PDF parsing is only available in browser environment");
  }

  try {
    // Define type for dynamically imported pdfjs
    interface PdfJsLib {
      getDocument: (data: Uint8Array) => {
        promise: Promise<{
          numPages: number;
          getPage: (pageNum: number) => Promise<{
            getTextContent: () => Promise<TextContent>;
          }>;
        }>;
      };
      GlobalWorkerOptions: { workerSrc: string };
    }

    // Dynamically import PDF.js to avoid server-side issues
    const pdfjs = (await import("pdfjs-dist")) as unknown as PdfJsLib;

    // Set worker source - use CDN version to avoid bundling issues
    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    // Load the PDF file
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);

    // Load and parse the PDF document
    const loadingTask = pdfjs.getDocument(typedArray);
    const pdf = await loadingTask.promise;

    // Extract text from each page
    let fullText = "";
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      // Join all the text items into a single string
      const pageText = content.items
        .filter((item): item is TextItem => "str" in item)
        .map((item) => item.str)
        .join(" ");

      fullText += pageText + "\n";
    }

    return fullText;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF document");
  }
}

/**
 * Parse a DOCX document and extract its text content
 * @param file DOCX file to parse
 * @returns Promise with extracted text
 */
export async function parseDocxDocument(file: File): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("DOCX parsing is only available in browser environment");
  }

  // Dynamically import mammoth to avoid server-side issues
  const mammoth = await import("mammoth");

  const arrayBuffer = await file.arrayBuffer();

  // Use mammoth to convert DOCX to text
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Parse a resume file and extract structured data
 * @param file Resume file (PDF or DOCX)
 * @returns Promise with structured resume data
 */
export async function parseResumeFile(file: File): Promise<ResumeData> {
  // Check file type to determine parsing method
  const fileType = file.type;

  let text = "";

  if (fileType === "application/pdf") {
    text = await parsePdfDocument(file);
  } else if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    text = await parseDocxDocument(file);
  } else {
    throw new Error(
      "Unsupported file format. Please upload a PDF or DOCX file.",
    );
  }

  // Process the extracted text to get structured resume data
  return extractResumeData(text);
}
