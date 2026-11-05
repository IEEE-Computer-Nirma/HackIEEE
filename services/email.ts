import { Resend } from "resend";
import { renderRegistrationEmail, RegistrationEmailData } from "./templates/registration-confirmation";

export async function sendRegistrationConfirmationEmail(data: RegistrationEmailData) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[Email Service] RESEND_API_KEY not configured. Mocking email delivery for:", data.email);
    return { success: true, mocked: true };
  }

  const resend = new Resend(apiKey);

  try {
    const { subject, html, text } = renderRegistrationEmail(data);
    const fromAddress = process.env.RESEND_FROM_EMAIL?.trim() || "HackIEEE <onboarding@resend.dev>";

    console.log(`[Email Service] Dispatching confirmation email to ${data.email} via Resend from ${fromAddress}...`);

    const result = await resend.emails.send({
      from: fromAddress,
      to: [data.email],
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error("[Email Service] Resend dispatch error:", result.error);
      return { success: false, error: result.error.message };
    }

    console.log(`[Email Service] Confirmation email sent successfully! Message ID: ${result.data?.id}`);
    return { success: true, id: result.data?.id };
  } catch (err: any) {
    console.error("[Email Service] Unexpected error sending email:", err);
    return { success: false, error: err.message || "Failed to dispatch email" };
  }
}
