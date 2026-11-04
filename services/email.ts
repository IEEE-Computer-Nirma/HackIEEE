import { Resend } from "resend";
import { renderRegistrationEmail, RegistrationEmailData } from "./templates/registration-confirmation";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendRegistrationConfirmationEmail(data: RegistrationEmailData) {
  if (!resend) {
    console.warn("[Email Service] RESEND_API_KEY not configured. Mocking email delivery for:", data.email);
    return { success: true, mocked: true };
  }

  try {
    const { subject, html, text } = renderRegistrationEmail(data);
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "HackIEEE <onboarding@resend.dev>",
      to: [data.email],
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error("[Email Service] Resend dispatch error:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (err: any) {
    console.error("[Email Service] Unexpected error sending email:", err);
    return { success: false, error: err.message || "Failed to dispatch email" };
  }
}
