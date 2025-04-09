/**
 * Extracts structured resume data from plain text
 * Uses pattern matching to identify different sections of a resume
 */
export function extractResumeData(text: string): ResumeData {
  const lines = text.split("\n").filter((line) => line.trim().length > 0);

  // Initialize resume data structure
  const contact: ResumeData["contact"] = {
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    website: "",
  };

  const workExperience: ResumeData["workExperience"] = [];
  const education: ResumeData["education"] = [];
  const skills: ResumeData["skills"] = [];
  const certifications: ResumeData["certifications"] = [];

  // Extract contact information
  if (lines.length > 0) {
    // Assume first line is the full name
    if (lines[0].trim().length > 0 && !lines[0].match(/^\d/)) {
      contact.name = lines[0].trim();
    }

    // Look for contact information
    const emailMatch = text.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    );
    if (emailMatch) {
      contact.email = emailMatch[0];
    }

    const phoneMatch = text.match(
      /(\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/,
    );
    if (phoneMatch) {
      contact.phone = phoneMatch[0];
    }

    // Look for LinkedIn URL
    const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+/);
    if (linkedinMatch) {
      contact.linkedin = `https://www.${linkedinMatch[0]}`;
    }

    // Look for website
    const websiteMatch = text.match(
      /(http|https):\/\/[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/,
    );
    if (websiteMatch && !websiteMatch[0].includes("linkedin.com")) {
      contact.website = websiteMatch[0];
    }

    // Look for address (simple pattern)
    const addressMatch = text.match(/[A-Z][a-z]+,\s*[A-Z]{2}/);
    if (addressMatch) {
      contact.address = addressMatch[0];
    }
  }

  // Find section indices
  const expKeywords = [
    "EXPERIENCE",
    "EMPLOYMENT",
    "WORK HISTORY",
    "PROFESSIONAL EXPERIENCE",
  ];
  const eduKeywords = ["EDUCATION", "ACADEMIC", "ACADEMICS", "DEGREE"];
  const skillsKeywords = [
    "SKILLS",
    "TECHNICAL SKILLS",
    "CORE COMPETENCIES",
    "COMPETENCIES",
  ];
  const certKeywords = ["CERTIFICATION", "CERTIFICATIONS", "LICENSES"];

  let currentSection = "";
  let expStartIndex = -1;
  let eduStartIndex = -1;
  let skillsStartIndex = -1;
  let certStartIndex = -1;

  // Identify section boundaries
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toUpperCase().trim();

    if (
      expStartIndex === -1 &&
      expKeywords.some((keyword) => line.includes(keyword))
    ) {
      expStartIndex = i;
      currentSection = "experience";
    } else if (
      eduStartIndex === -1 &&
      eduKeywords.some((keyword) => line.includes(keyword))
    ) {
      eduStartIndex = i;
      currentSection = "education";
    } else if (
      skillsStartIndex === -1 &&
      skillsKeywords.some((keyword) => line.includes(keyword))
    ) {
      skillsStartIndex = i;
      currentSection = "skills";
    } else if (
      certStartIndex === -1 &&
      certKeywords.some((keyword) => line.includes(keyword))
    ) {
      certStartIndex = i;
      currentSection = "certifications";
    } else if (
      currentSection === "experience" &&
      (eduStartIndex !== -1 || skillsStartIndex !== -1 || certStartIndex !== -1)
    ) {
      // Extract experience entries
      extractWorkExperience(lines, expStartIndex, i, workExperience);
      currentSection = "";
    } else if (
      currentSection === "education" &&
      (skillsStartIndex !== -1 || certStartIndex !== -1)
    ) {
      // Extract education entries
      extractEducation(lines, eduStartIndex, i, education);
      currentSection = "";
    } else if (currentSection === "skills" && certStartIndex !== -1) {
      // Extract skills entries
      extractSkills(lines, skillsStartIndex, i, skills);
      currentSection = "";
    }
  }

  // Process remaining sections that weren't closed by another section
  if (expStartIndex !== -1 && workExperience.length === 0) {
    const endIndex =
      eduStartIndex !== -1
        ? eduStartIndex
        : skillsStartIndex !== -1
          ? skillsStartIndex
          : certStartIndex !== -1
            ? certStartIndex
            : lines.length;
    extractWorkExperience(lines, expStartIndex, endIndex, workExperience);
  }

  if (eduStartIndex !== -1 && education.length === 0) {
    const endIndex =
      skillsStartIndex !== -1
        ? skillsStartIndex
        : certStartIndex !== -1
          ? certStartIndex
          : lines.length;
    extractEducation(lines, eduStartIndex, endIndex, education);
  }

  if (skillsStartIndex !== -1 && skills.length === 0) {
    const endIndex = certStartIndex !== -1 ? certStartIndex : lines.length;
    extractSkills(lines, skillsStartIndex, endIndex, skills);
  }

  if (certStartIndex !== -1 && certifications.length === 0) {
    extractCertifications(lines, certStartIndex, lines.length, certifications);
  }

  // Return the structured resume data
  return {
    contact,
    workExperience: workExperience.length ? workExperience : undefined,
    education: education.length ? education : undefined,
    skills: skills.length ? skills : undefined,
    certifications: certifications.length ? certifications : undefined,
  };
}

/**
 * Extract work experience entries from a section of the resume
 */
function extractWorkExperience(
  lines: string[],
  startIndex: number,
  endIndex: number,
  workExperience: NonNullable<ResumeData["workExperience"]>,
): void {
  let currentExp: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
  } | null = null;

  for (let i = startIndex + 1; i < endIndex; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Look for patterns that indicate a new position
    // Company + date pattern
    const companyDatePattern =
      /(.+?)\s*(?:\||\-|,)\s*(.+?)\s*(?:\-|to|–)\s*(.+)/i;
    // Position at Company pattern
    const positionAtCompanyPattern = /(.+?)\s+(?:at|@)\s+(.+)/i;
    // Date pattern
    const datePattern =
      /(\d{1,2}\/\d{2,4}|\d{1,2}-\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4})/i;

    if (
      (companyDatePattern.test(line) || positionAtCompanyPattern.test(line)) &&
      (datePattern.test(line) ||
        line.includes("Present") ||
        line.includes("Current"))
    ) {
      // This looks like a new position
      if (currentExp && (currentExp.company || currentExp.position)) {
        workExperience.push(currentExp);
      }

      currentExp = {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      };

      // Try to extract position and company
      const positionMatch = line.match(positionAtCompanyPattern);
      const companyDateMatch = line.match(companyDatePattern);

      if (positionMatch) {
        currentExp.position = positionMatch[1].trim();
        currentExp.company = positionMatch[2].trim();
      } else if (companyDateMatch) {
        // Could be either company first or position first, make best guess
        // If first part has "Engineer", "Manager", etc., it's likely the position
        const firstPart = companyDateMatch[1].trim();
        const positionKeywords = [
          "engineer",
          "manager",
          "developer",
          "analyst",
          "consultant",
          "specialist",
          "director",
        ];

        if (
          positionKeywords.some((keyword) =>
            firstPart.toLowerCase().includes(keyword),
          )
        ) {
          currentExp.position = firstPart;
          // Company might be in the second part before the date
          const secondParts = companyDateMatch[2].split(/\s+(?=\d)/);
          if (secondParts.length > 1) {
            currentExp.company = secondParts[0].trim();
          }
        } else {
          // Assume company is first
          currentExp.company = firstPart;
          // Position might be in the next line
        }
      }

      // Extract dates
      const dateMatches = line.match(
        /(\w+ \d{4}|\d{1,2}\/\d{4})\s*(?:-|–|to)\s*(\w+ \d{4}|\d{1,2}\/\d{4}|Present|Current)/i,
      );
      if (dateMatches) {
        currentExp.startDate = dateMatches[1];
        currentExp.endDate =
          dateMatches[2] === "Present" || dateMatches[2] === "Current"
            ? undefined
            : dateMatches[2];
      }
    } else if (currentExp) {
      // If we have a current experience but no position yet, this might be the position
      if (!currentExp.position && line.length < 100) {
        currentExp.position = line;
      } else {
        // Add to description of current experience
        currentExp.description += line + " ";
      }
    }
  }

  // Add the last experience entry
  if (currentExp && (currentExp.company || currentExp.position)) {
    workExperience.push(currentExp);
  }
}

/**
 * Extract education entries from a section of the resume
 */
function extractEducation(
  lines: string[],
  startIndex: number,
  endIndex: number,
  education: NonNullable<ResumeData["education"]>,
): void {
  let currentEdu: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
  } | null = null;

  for (let i = startIndex + 1; i < endIndex; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Look for patterns that indicate a new education entry
    // School + date pattern
    const schoolDatePattern = /(.+?)\s*(?:\||\-|,)\s*(.+)/i;
    // Degree pattern
    const degreePattern =
      /(Bachelor|Master|Doctor|BA|BS|BSc|MA|MS|MSc|MBA|PhD|MD|JD|Associate)/i;
    // Date pattern
    const datePattern =
      /(\d{1,2}\/\d{2,4}|\d{1,2}-\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}|\d{4})/i;

    if (
      schoolDatePattern.test(line) &&
      (datePattern.test(line) || degreePattern.test(line))
    ) {
      // This looks like a new education entry
      if (currentEdu && currentEdu.institution) {
        education.push(currentEdu);
      }

      currentEdu = {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
      };

      // Try to extract institution
      const schoolMatch = line.match(schoolDatePattern);
      if (schoolMatch) {
        currentEdu.institution = schoolMatch[1].trim();

        // Look for degree in the same line
        const degreeMatch = line.match(degreePattern);
        if (degreeMatch) {
          const degreeFieldPattern = new RegExp(
            `${degreeMatch[1]}[^,]*(?:in|of)\\s+([^,]+)`,
            "i",
          );
          const degreeFieldMatch = line.match(degreeFieldPattern);

          if (degreeFieldMatch) {
            currentEdu.degree = degreeMatch[0];
            currentEdu.fieldOfStudy = degreeFieldMatch[1].trim();
          } else {
            currentEdu.degree = degreeMatch[0];
          }
        }

        // Extract dates
        const dateMatches = line.match(
          /(\d{4})\s*(?:-|–|to)\s*(\d{4}|Present|Current)/i,
        );
        if (dateMatches) {
          currentEdu.startDate = dateMatches[1];
          currentEdu.endDate =
            dateMatches[2] === "Present" || dateMatches[2] === "Current"
              ? undefined
              : dateMatches[2];
        } else {
          // Look for single year (graduation year)
          const yearMatch = line.match(/\b(20\d{2}|19\d{2})\b/);
          if (yearMatch) {
            currentEdu.endDate = yearMatch[1];
          }
        }
      }
    } else if (currentEdu) {
      // If we have a current education but no degree yet, this might be the degree
      if (!currentEdu.degree && degreePattern.test(line)) {
        const degreeMatch = line.match(degreePattern);
        if (degreeMatch) {
          currentEdu.degree = line;

          // Try to extract field of study
          const fieldMatch = line.match(/in\s+([^,]+)/i);
          if (fieldMatch) {
            currentEdu.fieldOfStudy = fieldMatch[1].trim();
          }
        }
      } else if (!currentEdu.fieldOfStudy && line.length < 100) {
        // This might be the field of study
        currentEdu.fieldOfStudy = line;
      }
    }
  }

  // Add the last education entry
  if (currentEdu && currentEdu.institution) {
    education.push(currentEdu);
  }
}

/**
 * Extract skills from a section of the resume
 */
function extractSkills(
  lines: string[],
  startIndex: number,
  endIndex: number,
  skills: NonNullable<ResumeData["skills"]>,
): void {
  let skillText = "";

  // Collect all text in the skills section
  for (let i = startIndex + 1; i < endIndex; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    skillText += line + " ";
  }

  // Split by common delimiters
  let skillArray: string[] = [];

  // Try comma-separated first
  if (skillText.includes(",")) {
    skillArray = skillText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  // Try bullet points
  else if (skillText.includes("•")) {
    skillArray = skillText
      .split("•")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  // Try pipe-separated
  else if (skillText.includes("|")) {
    skillArray = skillText
      .split("|")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  // Try line breaks
  else if (skillText.includes("\n")) {
    skillArray = skillText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  // If all else fails, try to split on whitespace for longer tokens
  else {
    skillArray = skillText.split(/\s+/).filter((s) => s.length > 3);
  }

  // Convert array to skill objects
  for (const skill of skillArray) {
    // Skip very short or likely non-skill items
    if (skill.length < 2 || /^\d+$/.test(skill)) continue;

    // Check if skill has a level indicator
    const levelMatch = skill.match(
      /(.+)\s*[:-]\s*(Beginner|Intermediate|Advanced|Expert|Proficient|\d+\s*\/\s*\d+)/i,
    );

    if (levelMatch) {
      skills.push({
        name: levelMatch[1].trim(),
        level: levelMatch[2].trim(),
      });
    } else {
      skills.push({
        name: skill,
      });
    }
  }
}

/**
 * Extract certifications from a section of the resume
 */
function extractCertifications(
  lines: string[],
  startIndex: number,
  endIndex: number,
  certifications: NonNullable<ResumeData["certifications"]>,
): void {
  let currentCert: {
    name: string;
    issuer: string;
    date: string;
  } | null = null;

  for (let i = startIndex + 1; i < endIndex; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Look for certification patterns
    // Certification + issuer pattern
    const certPattern = /(.+?)\s*(?:\||\-|,|from)\s*(.+)/i;
    // Date pattern
    const datePattern =
      /(\d{1,2}\/\d{2,4}|\d{1,2}-\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}|\d{4})/i;

    if (certPattern.test(line)) {
      // This looks like a new certification entry
      if (currentCert && currentCert.name) {
        certifications.push(currentCert);
      }

      currentCert = {
        name: "",
        issuer: "",
        date: "",
      };

      // Extract certification name and issuer
      const certMatch = line.match(certPattern);
      if (certMatch) {
        currentCert.name = certMatch[1].trim();
        currentCert.issuer = certMatch[2].trim();

        // Extract date if present in the same line
        const dateMatch = line.match(datePattern);
        if (dateMatch) {
          currentCert.date = dateMatch[1];

          // Clean up the issuer if it contains the date
          currentCert.issuer = currentCert.issuer
            .replace(datePattern, "")
            .trim();
          // Remove trailing commas, dashes, etc.
          currentCert.issuer = currentCert.issuer
            .replace(/[,\-|]+$/, "")
            .trim();
        }
      }
    } else if (currentCert && !currentCert.date && datePattern.test(line)) {
      // This line contains a date for the current certification
      const dateMatch = line.match(datePattern);
      if (dateMatch) {
        currentCert.date = dateMatch[1];
      }
    }
  }

  // Add the last certification entry
  if (currentCert && currentCert.name) {
    certifications.push(currentCert);
  }
}

// Interface for resume data structure
interface ResumeData {
  workExperience?: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
  }[];
  education?: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
  }[];
  skills?: {
    name: string;
    level?: string;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
  }[];
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    website?: string;
  };
}
