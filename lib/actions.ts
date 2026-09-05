"use server";

import { supabase } from "@/lib/supabase";
import { sponsorshipSchema } from "@/lib/schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ActionResult = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitSponsorshipForm(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  // Honeypot — if this field has a value, it's a bot
  if (formData.get("website")) {
    return { ok: true };
  }

  const raw = Object.fromEntries(formData.entries());
  delete raw.website;

  const result = sponsorshipSchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { ok: false, error: "Validation failed.", fieldErrors };
  }

  const d = result.data;
  const { error } = await supabase.from("sponsorship_submissions").insert({
    org_name: d.orgName,
    contact_person: d.contactPerson,
    email: d.email,
    message: d.message,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  // Send email notification via Resend
  try {
    await resend.emails.send({
      from: "HackIEEE Sponsorships <onboarding@resend.dev>",
      to: "deep@computer.org",
      subject: `New Sponsorship Inquiry from ${d.orgName}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #16249E;">New Sponsorship Submission</h2>
          <p><strong>Organization:</strong> ${d.orgName}</p>
          <p><strong>Contact Person:</strong> ${d.contactPerson}</p>
          <p><strong>Email:</strong> ${d.email}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${d.message || "No message provided."}</p>
        </div>
      `,
    });
  } catch (emailError) {
    // We log the error but still return success to the user since the DB insert succeeded
    console.error("Failed to send email notification:", emailError);
  }

  return { ok: true };
}
