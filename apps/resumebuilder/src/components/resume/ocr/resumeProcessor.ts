import type { SectionData, SectionItem } from "@/store/useResumeStore";

import { parseResumeFile } from "@/lib/documentParser";

/**
 * Process a resume file and extract structured sections
 * @param file The uploaded resume file (PDF, DOC, or DOCX)
 * @returns An array of structured sections extracted from the resume
 */
export async function processResumeFile(file: File): Promise<SectionData[]> {
  // Parse the file
  const resumeData = await parseResumeFile(file);

  // Extract and format sections from the parsed data
  const extractedSections: SectionData[] = [];

  // Extract work experience
  if (resumeData.workExperience && resumeData.workExperience.length > 0) {
    const workItems: SectionItem[] = resumeData.workExperience.map((exp) => ({
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      value: `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || "Present"})\n${exp.description}`,
    }));

    extractedSections.push({
      id: "extracted-experience",
      title: "Work Experience",
      items: workItems,
    });
  }

  // Extract education
  if (resumeData.education && resumeData.education.length > 0) {
    const eduItems: SectionItem[] = resumeData.education.map((edu) => ({
      id: `edu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      value: `${edu.degree} in ${edu.fieldOfStudy}, ${edu.institution} (${edu.startDate} - ${edu.endDate || "Present"})`,
    }));

    extractedSections.push({
      id: "extracted-education",
      title: "Education",
      items: eduItems,
    });
  }

  // Extract skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    const skillItems: SectionItem[] = resumeData.skills.map((skill) => ({
      id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      value: skill.name,
    }));

    extractedSections.push({
      id: "extracted-skills",
      title: "Skills",
      items: skillItems,
    });
  }

  // Extract certifications if available
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    const certItems: SectionItem[] = resumeData.certifications.map((cert) => ({
      id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      value: `${cert.name} - ${cert.issuer} (${cert.date})`,
    }));

    extractedSections.push({
      id: "extracted-certifications",
      title: "Certifications",
      items: certItems,
    });
  }

  return extractedSections;
}
