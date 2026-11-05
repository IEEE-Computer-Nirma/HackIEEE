import { z } from "zod";

const emailValidator = z
  .string()
  .trim()
  .min(1, "Email address is required")
  .email("Please enter a valid email address");

const phoneRegex = /^[0-9+\s\-()]{7,15}$/;

export interface RegistrationFormData {
  // Step 1: Personal
  fullName: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  phoneNumber: string;
  personalEmail: string;
  collegeEmail?: string;

  // Step 2: Academic
  university: string;
  universityId?: string;
  isCustomUniversity?: boolean;
  degree: string;
  customDegree?: string;
  branch: string;
  yearOfStudy: string;
  graduationYear: string;

  // Step 3: IEEE Membership
  isIeeeMember: boolean;
  ieeeMembershipNumber?: string;
  isIeeeCsMember: boolean;

  // Step 4: Additional Information
  linkedinUrl?: string;
  githubUrl?: string;
  areasOfInterest: string[];
  hearAbout?: string;
  resumeFileName?: string;
  resumeFileSize?: number;
}

export const initialRegistrationFormData: RegistrationFormData = {
  // Step 1
  fullName: "",
  city: "",
  state: "",
  country: "India",
  countryCode: "+91",
  phoneNumber: "",
  personalEmail: "",
  collegeEmail: "",

  // Step 2
  university: "",
  universityId: "",
  isCustomUniversity: false,
  degree: "",
  customDegree: "",
  branch: "",
  yearOfStudy: "",
  graduationYear: "",

  // Step 3
  isIeeeMember: false,
  ieeeMembershipNumber: "",
  isIeeeCsMember: false,

  // Step 4
  linkedinUrl: "",
  githubUrl: "",
  areasOfInterest: [],
  hearAbout: "",
  resumeFileName: "",
  resumeFileSize: 0,
};

export const step1PersonalSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(100),
  country: z.string().trim().min(1, "Country is required").default("India"),
  countryCode: z.string().trim().default("+91"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .refine(
      (val) => phoneRegex.test(val.replace(/\s+/g, "")),
      "Please enter a valid phone number (7-15 digits)"
    ),
  personalEmail: emailValidator,
  collegeEmail: z
    .string()
    .trim()
    .min(1, "College / Student email is required")
    .refine(
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Please enter a valid college / student email address"
    ),
});

export const step2AcademicSchema = z.object({
  university: z
    .string()
    .trim()
    .min(2, "University / Institution name is required")
    .max(250),
  universityId: z.string().optional(),
  isCustomUniversity: z.boolean().default(false),
  degree: z.string().trim().min(1, "Degree / Program is required").max(100),
  customDegree: z.string().trim().max(100).optional(),
  branch: z
    .string()
    .trim()
    .min(2, "Branch / Department is required")
    .max(150),
  yearOfStudy: z.string().trim().min(1, "Current year of study is required"),
  graduationYear: z
    .string()
    .trim()
    .min(1, "Expected graduation year is required"),
});

const membershipBaseSchema = z.object({
  isIeeeMember: z.boolean(),
  ieeeMembershipNumber: z.string().trim().optional().default(""),
  isIeeeCsMember: z.boolean(),
});

export const step3MembershipSchema = membershipBaseSchema.superRefine((data, ctx) => {
  if (data.isIeeeMember) {
    const num = data.ieeeMembershipNumber?.trim();
    if (!num || num.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ieeeMembershipNumber"],
        message: "Please enter your valid IEEE membership number (min 6 digits)",
      });
    }
  }
});

export const step4AdditionalSchema = z.object({
  linkedinUrl: z
    .string()
    .trim()
    .refine(
      (val) =>
        val === "" ||
        /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i.test(val) ||
        /^[a-zA-Z0-9_\-./]+$/.test(val),
      "Please enter a valid LinkedIn URL or profile name"
    )
    .optional()
    .default(""),
  githubUrl: z
    .string()
    .trim()
    .refine(
      (val) =>
        val === "" ||
        /^(https?:\/\/)?(www\.)?github\.com\/.+/i.test(val) ||
        /^[a-zA-Z0-9_\-./]+$/.test(val),
      "Please enter a valid GitHub URL or username"
    )
    .optional()
    .default(""),
  areasOfInterest: z.array(z.string()).default([]),
  hearAbout: z.string().trim().optional().default(""),
  resumeFileName: z.string().optional().default(""),
  resumeFileSize: z.number().optional().default(0),
});

export const fullRegistrationSchema = z
  .object({
    ...step1PersonalSchema.shape,
    ...step2AcademicSchema.shape,
    ...membershipBaseSchema.shape,
    ...step4AdditionalSchema.shape,
  })
  .superRefine((data, ctx) => {
    if (data.isIeeeMember) {
      const num = data.ieeeMembershipNumber?.trim();
      if (!num || num.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ieeeMembershipNumber"],
          message: "Please enter your valid IEEE membership number (min 6 digits)",
        });
      }
    }
  });
