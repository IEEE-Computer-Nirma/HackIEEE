"use server";

import { supabase } from "@/lib/supabase";
import { sponsorshipSchema } from "@/lib/schema";

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
    tier_interest: d.tierInterest,
    message: d.message,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return { ok: true };
}
