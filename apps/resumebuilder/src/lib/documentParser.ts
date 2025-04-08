import { ResumeData } from "@/store/resumeStore";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export type ParsedDocument = {
  text: string;
  metadata?: Record<string, unknown>;
  resumeData?: Partial<ResumeData>;
};

/**
 * Parse a PDF document
 */
export const parsePdfDocument = async (file: File): Promise<ParsedDocument> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const data = await pdfParse(Buffer.from(arrayBuffer));

    return {
      text: data.text,
      metadata: {
        info: data.info,
        pageCount: data.numpages,
      },
    };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF document");
  }
};

/**
 * Parse a DOCX document
 */
export const parseDocxDocument = async (
  file: File,
): Promise<ParsedDocument> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({
      arrayBuffer: arrayBuffer,
    });

    return {
      text: result.value,
      metadata: {
        messages: result.messages,
      },
    };
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    throw new Error("Failed to parse DOCX document");
  }
};

/**
 * Extract resume data from parsed document text (basic implementation)
 * This function can be enhanced in the future to use more sophisticated
 * natural language processing for better extraction.
 */
export const extractResumeData = (
  parsedDocument: ParsedDocument,
): Partial<ResumeData> => {
  // In a real-world scenario, this would use more sophisticated text processing
  // For now, we'll implement a simple placeholder

  // Extract name (assuming it's at the beginning of the document)
  const text = parsedDocument.text;
  const lines = text.split("\n").filter((line) => line.trim().length > 0);

  let personalInfo = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    summary: "",
  };

  // Very simple extraction - would need to be much more sophisticated in reality
  if (lines.length > 0) {
    // Assume first line is the full name
    const nameParts = lines[0].trim().split(" ");
    if (nameParts.length >= 2) {
      personalInfo.firstName = nameParts[0];
      personalInfo.lastName = nameParts[nameParts.length - 1];
    }

    // Look for email in the text
    const emailMatch = text.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    );
    if (emailMatch) {
      personalInfo.email = emailMatch[0];
    }

    // Look for phone number
    const phoneMatch = text.match(
      /(\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/,
    );
    if (phoneMatch) {
      personalInfo.phone = phoneMatch[0];
    }
  }

  return {
    personalInfo,
    // Other sections would be extracted using more sophisticated techniques
    workExperience: [],
    education: [],
    skills: [],
    certifications: [],
    socialLinks: [],
  };
};

/**
 * Main function to parse an uploaded resume file
 */
export const parseResumeFile = async (
  file: File,
): Promise<Partial<ResumeData>> => {
  try {
    let parsedDocument: ParsedDocument;

    if (file.type === "application/pdf") {
      parsedDocument = await parsePdfDocument(file);
    } else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"
    ) {
      parsedDocument = await parseDocxDocument(file);
    } else {
      throw new Error("Unsupported file type");
    }

    // Extract resume data from the parsed document
    const resumeData = extractResumeData(parsedDocument);

    return resumeData;
  } catch (error) {
    console.error("Error parsing resume file:", error);
    throw error;
  }
};
