"use client";

import { formatDate } from "@/lib/utils";
import { ResumeData, ResumeTemplate } from "@/store/resumeStore";

interface TemplateProps {
  data: ResumeData;
  template?: ResumeTemplate; // Make template optional with a default in the component
}

export function ModernTemplate({ data, template }: TemplateProps) {
  const { firstName, lastName, email, phone, address, title, summary } =
    data.personalInfo;
  const { workExperience, education, skills, certifications, socialLinks } =
    data;

  // Use default template colors if template is not provided
  const defaultTemplate = {
    primaryColor: "#3b82f6",
    secondaryColor: "#f3f4f6",
  };

  const activeTemplate = template ?? defaultTemplate;

  // Create a style object based on the template colors
  const styles = {
    header: {
      backgroundColor: activeTemplate.primaryColor,
      color: "white",
    },
    sectionTitle: {
      color: activeTemplate.primaryColor,
      borderBottom: `2px solid ${activeTemplate.primaryColor}`,
    },
    itemTitle: {
      color: activeTemplate.primaryColor,
    },
  };

  return (
    <div className="flex h-full w-full flex-col p-8 font-sans">
      {/* Header */}
      <header className="mb-6 w-full rounded-md p-8" style={styles.header}>
        <h1 className="mb-1 text-3xl font-bold">
          {firstName} {lastName}
        </h1>
        <p className="mb-4 text-xl">{title}</p>

        <div className="flex flex-wrap gap-4 text-sm">
          {email && <span>{email}</span>}
          {phone && <span>{phone}</span>}
          {address && <span>{address}</span>}
        </div>
      </header>

      {/* Body */}
      <div className="flex-1">
        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <h2
              className="mb-2 pb-1 text-lg font-bold"
              style={styles.sectionTitle}
            >
              Summary
            </h2>
            <p className="text-sm">{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <section className="mb-6">
            <h2
              className="mb-2 pb-1 text-lg font-bold"
              style={styles.sectionTitle}
            >
              Work Experience
            </h2>
            <div className="space-y-4">
              {workExperience.map((job) => (
                <div key={job.id} className="text-sm">
                  <div className="flex justify-between">
                    <h3 className="font-bold" style={styles.itemTitle}>
                      {job.position}
                    </h3>
                    <span className="text-gray-600">
                      {formatDate(job.startDate)} -{" "}
                      {job.current ? "Present" : formatDate(job.endDate)}
                    </span>
                  </div>
                  <p className="font-medium">
                    {job.company}
                    {job.location ? `, ${job.location}` : ""}
                  </p>
                  {job.description && (
                    <p className="mt-1 text-gray-700">{job.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2
              className="mb-2 pb-1 text-lg font-bold"
              style={styles.sectionTitle}
            >
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="text-sm">
                  <div className="flex justify-between">
                    <h3 className="font-bold" style={styles.itemTitle}>
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </h3>
                    <span className="text-gray-600">
                      {formatDate(edu.startDate)} -{" "}
                      {edu.current ? "Present" : formatDate(edu.endDate)}
                    </span>
                  </div>
                  <p className="font-medium">
                    {edu.institution}
                    {edu.location ? `, ${edu.location}` : ""}
                  </p>
                  {edu.description && (
                    <p className="mt-1 text-gray-700">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-6">
            <h2
              className="mb-2 pb-1 text-lg font-bold"
              style={styles.sectionTitle}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full px-3 py-1 text-sm"
                  style={{
                    backgroundColor: `${activeTemplate.primaryColor}20`,
                    color: activeTemplate.primaryColor,
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mb-6">
            <h2
              className="mb-2 pb-1 text-lg font-bold"
              style={styles.sectionTitle}
            >
              Certifications
            </h2>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-sm">
                  <h3 className="font-bold" style={styles.itemTitle}>
                    {cert.name}
                  </h3>
                  <p className="text-gray-700">
                    {cert.issuer} • {formatDate(cert.date)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <section className="mb-6">
            <h2
              className="mb-2 pb-1 text-lg font-bold"
              style={styles.sectionTitle}
            >
              Social & Online Presence
            </h2>
            <div className="flex flex-col space-y-1">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                  style={{ color: activeTemplate.primaryColor }}
                >
                  {link.platform}: {link.url}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
