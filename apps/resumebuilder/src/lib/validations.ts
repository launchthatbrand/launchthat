import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
});

export const workExperienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.enum(["1", "2", "3", "4", "5"]).transform(Number).optional(),
});

export const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Invalid URL"),
});

export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine((file) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    return validTypes.includes(file.type);
  }, "File must be a PDF or Word document"),
});
