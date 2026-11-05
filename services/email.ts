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
    const fromAddress = process.env.RESEND_FROM_EMAIL?.trim() || "HackIEEE <noreply@hack.ieeenirma.org>";
    const replyTo = process.env.RESEND_REPLY_TO?.trim() || undefined;

    console.log(`[Email Service] Dispatching confirmation email to ${data.email} via Resend from ${fromAddress}...`);

    const result = await resend.emails.send({
      from: fromAddress,
      to: [data.email],
      subject,
      html,
      text,
      ...(replyTo ? { replyTo } : {}),
    });

    if (result.error) {
      console.warn("[Email Service] Resend dispatch error:", result.error.message);

      // If Resend is restricted by sandbox domain to the owner's account (deepensify@gmail.com),
      // forward the registration confirmation directly to deepensify@gmail.com so test registrations
      // are delivered and visible in the inbox without getting dropped.
      if (
        result.error.message?.includes("only send testing emails") ||
        result.error.statusCode === 403
      ) {
        console.log(`[Email Service] Sandbox test mode: forwarding email for participant ${data.email} to deepensify@gmail.com...`);
        const fallbackSubject = `[Participant: ${data.email}] ${subject}`;
        const sandboxFrom = fromAddress.includes("@resend.dev")
          ? fromAddress
          : "HackIEEE <onboarding@resend.dev>";
        const fallbackResult = await resend.emails.send({
          from: sandboxFrom,
          to: ["deepensify@gmail.com"],
          subject: fallbackSubject,
          html: `<div style="padding: 12px 16px; background: #24170d; color: #f8cf96; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; border: 1px solid #c06820; border-radius: 8px; margin: 16px auto 24px; max-width: 580px; line-height: 1.5;">
            🔔 <strong>Resend Sandbox Delivery Notice:</strong> Delivered to your verified Resend account (<code>deepensify@gmail.com</code>).<br/>
            Registered Attendee: <strong>${data.name}</strong> (<code>${data.email}</code>)<br/>
            <span style="font-size: 11px; opacity: 0.8;">To send directly to attendee domains, verify your domain at <a href="https://resend.com/domains" style="color: #ffa64d; text-decoration: underline;">resend.com/domains</a> and set <code>RESEND_FROM_EMAIL</code>.</span>
          </div>` + html,
          text: `[Sandbox Delivery for Participant: ${data.name} <${data.email}>]\n\n` + text,
        });

        if (!fallbackResult.error) {
          console.log(`[Email Service] Confirmation email safely delivered to inbox (deepensify@gmail.com)! Message ID: ${fallbackResult.data?.id}`);
          return { success: true, id: fallbackResult.data?.id, sandboxFallback: true };
        }
      }

      return { success: false, error: result.error.message };
    }

    console.log(`[Email Service] Confirmation email sent successfully! Message ID: ${result.data?.id}`);
    return { success: true, id: result.data?.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to dispatch email";
    console.error("[Email Service] Unexpected error sending email:", err);
    return { success: false, error: errorMsg };
  }
}
