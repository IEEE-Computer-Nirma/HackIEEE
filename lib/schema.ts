import { z } from "zod";

const email = z.string().email("Invalid email address");

export const sponsorshipSchema = z.object({
  orgName: z.string().min(1, "Organization name is required").max(200),
  contactPerson: z.string().min(1, "Contact person is required").max(200),
  email,
  message: z.string().max(5000).optional().default(""),
});

export type SponsorshipData = z.infer<typeof sponsorshipSchema>;
